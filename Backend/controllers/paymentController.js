import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";

// Initialize Razorpay instance
const getRazorpayInstance = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// ==========================================
// CREATE PAYMENT ORDER
// ==========================================
export const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    const booking = await Booking.findById(bookingId).populate("tutor");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Authorization check
    if (
      req.user &&
      req.user.role !== "admin" &&
      booking.studentEmail.toLowerCase() !== req.user.email?.toLowerCase()
    ) {
      return res.status(403).json({
        message: "Unauthorized: You can only create payment orders for your own bookings.",
      });
    }

    const amountInRupees = booking.amount || (booking.tutor && booking.tutor.fees) || 500;
    const amountInPaise = Math.round(amountInRupees * 100);

    const razorpay = getRazorpayInstance();

    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${booking._id.toString().slice(-8)}`,
      notes: {
        bookingId: booking._id.toString(),
        studentEmail: booking.studentEmail,
        subject: booking.subject,
      },
    };

    let order;
    let isSimulated = false;
    try {
      order = await razorpay.orders.create(options);
    } catch (rzpErr) {
      console.warn("Razorpay API warning (using dev simulated mode):", rzpErr.message);
      isSimulated = true;
      order = {
        id: `order_sim_${Date.now()}`,
        amount: amountInPaise,
        currency: "INR",
        receipt: options.receipt,
      };
    }

    // Save order id and amount in booking
    booking.razorpayOrderId = order.id;
    booking.amount = amountInRupees;
    await booking.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      isSimulated,
      keyId: process.env.RAZORPAY_KEY_ID || "",
      booking: {
        _id: booking._id,
        studentName: booking.studentName,
        studentEmail: booking.studentEmail,
        subject: booking.subject,
      },
    });
  } catch (error) {
    console.error("createPaymentOrder error:", error);
    res.status(500).json({
      message: error.message || "Failed to create payment order",
    });
  }
};

// ==========================================
// VERIFY PAYMENT SIGNATURE
// ==========================================
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } =
      req.body;

    if (!bookingId || !razorpay_payment_id) {
      return res.status(400).json({
        message: "Missing payment verification parameters",
      });
    }

    const booking = await Booking.findById(bookingId).populate("tutor");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Authorization check
    if (
      req.user &&
      req.user.role !== "admin" &&
      booking.studentEmail.toLowerCase() !== req.user.email?.toLowerCase()
    ) {
      return res.status(403).json({
        message: "Unauthorized: You can only verify payments for your own bookings.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET ;
    const isProduction = process.env.NODE_ENV === "production";

    // In production, razorpay_order_id and razorpay_signature are strictly required
    if (isProduction && (!razorpay_order_id || !razorpay_signature)) {
      return res.status(400).json({
        message: "Razorpay order ID and signature are required for payment verification.",
      });
    }

    // Verify HMAC signature if signature and order_id are provided
    if (razorpay_order_id && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac("sha256", secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isDevFallback = !isProduction && razorpay_order_id.startsWith("order_sim_");
      if (!isDevFallback && generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          message: "Invalid payment signature verification failed",
        });
      }
    }

    // Update booking payment state with Escrow Protection
    booking.paymentStatus = "paid";
    booking.escrowStatus = "held";
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    // ==========================================
    // NOTIFY TEACHER: PAYMENT RECEIVED & HOME VISIT AUTHORIZED
    // ==========================================
    if (booking.tutor && booking.tutor.email) {
      try {
        const tutorNotification = await Notification.create({
          recipientEmail: booking.tutor.email,
          message: `💰 Payment of ₹${booking.amount || 500} received from ${booking.studentName} for ${booking.subject}. You are now authorized to visit the student's home for class on ${booking.date} at ${booking.time}.`,
          type: "payment",
          bookingId: booking._id,
        });

        if (req.io) {
          const room = `user_${booking.tutor.email.toLowerCase().trim()}`;
          req.io.to(room).emit("new_notification", tutorNotification);
          req.io.to(room).emit("payment_received", {
            bookingId: booking._id,
            paymentStatus: "paid",
            amount: booking.amount,
          });
        }
      } catch (notifyErr) {
        console.error("Tutor payment notification error:", notifyErr.message);
      }
    }

    res.status(200).json({
      success: true,
      message: "Payment verified and booking confirmed successfully",
      booking,
    });
  } catch (error) {
    console.error("verifyPayment error:", error);
    res.status(500).json({
      message: error.message || "Payment verification failed",
    });
  }
};
