
import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";

// ==========================================
// INITIALIZE RAZORPAY
// ==========================================
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay configuration missing. Check RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// ==========================================
// HELPER: CHECK BOOKING AUTHORIZATION
// ==========================================
const isAuthorizedBookingUser = (req, booking) => {
  // Authentication middleware should populate req.user.
  if (!req.user) {
    return false;
  }

  // Only the booking owner or admin can access payment.
  if (req.user.role === "admin") {
    return true;
  }

  const userEmail = req.user.email?.toLowerCase().trim();
  const studentEmail = booking.studentEmail?.toLowerCase().trim();

  return Boolean(userEmail && studentEmail && userEmail === studentEmail);
};

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required.",
      });
    }

    if (!/^[a-f\d]{24}$/i.test(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(bookingId).populate("tutor");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Authorization check
    if (!isAuthorizedBookingUser(req, booking)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to pay for this booking.",
      });
    }

    // Prevent duplicate payment orders for completed payments.
    if (booking.paymentStatus === "paid") {
      return res.status(409).json({
        success: false,
        message: "This booking has already been paid for.",
      });
    }

    // Determine the booking amount.
    const amountInRupees =
      booking.amount || booking.tutor?.fees || 500;

    if (
      !Number.isFinite(Number(amountInRupees)) ||
      Number(amountInRupees) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking amount.",
      });
    }

    const amountInPaise = Math.round(Number(amountInRupees) * 100);

    // Initialize Razorpay.
    const razorpay = getRazorpayInstance();

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${booking._id.toString().slice(-8)}_${Date.now()
        .toString()
        .slice(-6)}`,
      notes: {
        bookingId: booking._id.toString(),
        studentEmail: booking.studentEmail || "",
        subject: booking.subject || "",
      },
    };

    let order;

    // Create a REAL Razorpay order.
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpError) {
      console.error("Razorpay order creation failed:", {
        message: rzpError.message,
        statusCode: rzpError.statusCode,
        error: rzpError.error,
      });

      return res.status(502).json({
        success: false,
        message: "Unable to create Razorpay order. Please try again.",
      });
    }

    // Save order details.
    booking.razorpayOrderId = order.id;
    booking.amount = Number(amountInRupees);

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Razorpay order created successfully.",
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      booking: {
        _id: booking._id,
        studentName: booking.studentName,
        studentEmail: booking.studentEmail,
        subject: booking.subject,
        amount: booking.amount,
      },
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment order.",
    });
  }
};

// ==========================================
// VERIFY PAYMENT SIGNATURE
// ==========================================
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    // Validate required fields.
    if (
      !bookingId ||
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message: "All Razorpay payment verification fields are required.",
      });
    }

    if (!/^[a-f\d]{24}$/i.test(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const booking = await Booking.findById(bookingId).populate("tutor");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    // Authorization check.
    if (!isAuthorizedBookingUser(req, booking)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to verify this payment.",
      });
    }

    // Verify the order belongs to this booking.
    if (
      !booking.razorpayOrderId ||
      booking.razorpayOrderId !== razorpay_order_id
    ) {
      return res.status(400).json({
        success: false,
        message: "Razorpay order does not match this booking.",
      });
    }

    // Prevent repeated verification.
    if (booking.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        message: "This booking has already been paid for.",
        booking,
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      console.error("RAZORPAY_KEY_SECRET is missing.");

      return res.status(500).json({
        success: false,
        message: "Payment configuration error.",
      });
    }

    // Generate the expected HMAC signature.
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest();

    let receivedSignature;

    try {
      receivedSignature = Buffer.from(razorpay_signature, "hex");
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature.",
      });
    }

    // Compare signatures safely.
    if (
      !/^[a-f\d]{64}$/i.test(razorpay_signature) ||
      generatedSignature.length !== receivedSignature.length ||
      !crypto.timingSafeEqual(generatedSignature, receivedSignature)
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment signature verification failed.",
      });
    }

    // Confirm the payment status with Razorpay itself.
    const razorpay = getRazorpayInstance();

    let payment;

    try {
      payment = await razorpay.payments.fetch(razorpay_payment_id);
    } catch (rzpError) {
      console.error("Razorpay payment fetch failed:", rzpError.message);

      return res.status(502).json({
        success: false,
        message: "Unable to confirm payment status with Razorpay.",
      });
    }

    // Ensure this payment belongs to the expected order.
    if (payment.order_id !== razorpay_order_id) {
      return res.status(400).json({
        success: false,
        message: "Payment does not belong to the expected order.",
      });
    }

    // A payment can be authorized but not yet captured.
    // Do not mark it as paid until it is captured.
    if (payment.status !== "captured") {
      return res.status(409).json({
        success: false,
        message:
          "Payment has not been captured yet. Please wait and check again.",
        paymentStatus: payment.status,
      });
    }

    // Confirm the amount matches the booking amount.
    const expectedAmount = Math.round(Number(booking.amount) * 100);

    if (
      Number(payment.amount) !== expectedAmount ||
      payment.currency !== "INR"
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment amount or currency does not match the booking.",
      });
    }

    // Update the booking only after verification.
    booking.paymentStatus = "paid";
    booking.escrowStatus = "held";
    booking.razorpayPaymentId = razorpay_payment_id;

    await booking.save();

    // ==========================================
    // NOTIFY TEACHER
    // ==========================================
    if (booking.tutor?.email) {
      try {
        const tutorEmail = booking.tutor.email.toLowerCase().trim();

        const tutorNotification = await Notification.create({
          recipientEmail: tutorEmail,
          message:
            `Payment of ₹${booking.amount} received from ` +
            `${booking.studentName} for ${booking.subject}. ` +
            `The payment has been verified. Class: ${booking.date} at ${booking.time}.`,
          type: "payment",
          bookingId: booking._id,
        });

        if (req.io) {
          const room = `user_${tutorEmail}`;

          req.io.to(room).emit("new_notification", tutorNotification);

          req.io.to(room).emit("payment_received", {
            bookingId: booking._id,
            paymentStatus: "paid",
            amount: booking.amount,
          });
        }
      } catch (notificationError) {
        // A notification failure must not undo a verified payment.
        console.error(
          "Tutor payment notification error:",
          notificationError.message
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed successfully.",
      booking,
    });
  } catch (error) {
    console.error("verifyPayment error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "Payment verification failed.",
    });
  }
};

