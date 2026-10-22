import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import BecomeTutor from "../models/BecomeTutor.js";
import {
  sendEmail,
  bookingRequestEmail,
  bookingAcceptedEmail,
  bookingRejectedEmail,
  bookingCompletedEmail,
} from "../utils/emailService.js";

// ==========================================
// CREATE BOOKING (SUPPORTS PACKAGES & ADDRESS)
// ==========================================
export const createBooking = async (req, res) => {
  try {
    const {
      studentName,
      studentEmail,
      phoneNumber,
      tutor,
      subject,
      date,
      time,
      address,
      area,
      packageType,
      message,
    } = req.body;

    const finalStudentName = studentName || (req.user && req.user.name);
    const finalStudentEmail = (studentEmail || (req.user && req.user.email) || "").toLowerCase().trim();

    if (
      !finalStudentName ||
      !finalStudentEmail ||
      !phoneNumber ||
      !tutor ||
      !subject ||
      !date ||
      !time
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check tutor
    const tutorData = await BecomeTutor.findById(tutor);

    if (!tutorData) {
      return res.status(404).json({
        message: "Tutor not found",
      });
    }

    // Tutor must be approved
    if (tutorData.status !== "approved") {
      return res.status(400).json({
        message: "This tutor is not available for booking",
      });
    }

    // Calculate Amount based on Package Type
    const baseFee = tutorData.fees || 500;
    let finalAmount = baseFee;
    let totalSessions = 1;

    if (packageType === "monthly_12") {
      totalSessions = 12;
      // 10% discount for monthly standard (12 classes)
      finalAmount = Math.round(baseFee * 12 * 0.9);
    } else if (packageType === "monthly_24") {
      totalSessions = 24;
      // 20% discount for monthly intensive (24 classes)
      finalAmount = Math.round(baseFee * 24 * 0.8);
    }

    const booking = await Booking.create({
      studentName: finalStudentName,
      studentEmail: finalStudentEmail,
      phoneNumber,
      tutor,
      subject,
      date,
      time,
      address: address || "",
      area: area || "Bhopal",
      packageType: packageType || "single",
      totalSessions,
      completedSessions: 0,
      message: message || "",
      amount: finalAmount,
      status: "pending",
      paymentStatus: "unpaid",
      escrowStatus: "none",
    });

    // Notify teacher
    const notification = await Notification.create({
      recipientEmail: tutorData.email,
      message: `${finalStudentName} has sent you a booking request for ${subject} (${totalSessions > 1 ? `${totalSessions} Classes Monthly Package` : "Single Class"}).`,
      type: "booking",
      bookingId: booking._id,
    });

    // Real-time socket emit to teacher
    if (req.io) {
      const room = `user_${tutorData.email.toLowerCase().trim()}`;
      req.io.to(room).emit("new_notification", notification);
      req.io.to(room).emit("new_booking_request", booking);
    }

    // Send Nodemailer email to Tutor
    sendEmail({
      to: tutorData.email,
      subject: `📚 New Booking Request for ${subject} from ${finalStudentName}`,
      html: bookingRequestEmail({
        tutorName: tutorData.name,
        studentName: finalStudentName,
        subject,
        date,
        time,
        message,
      }),
    }).catch((err) => console.log("Email error:", err));

    res.status(201).json({
      message: "Booking request sent successfully",
      booking,
    });
  } catch (err) {
    console.log("createBooking error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// STUDENT BOOKINGS
// ==========================================
export const studentBooking = async (req, res) => {
  try {
    const email = req.params.email;

    const bookings = await Booking.find({
      studentEmail: email,
    })
      .populate("tutor")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.log("studentBooking error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getStudentBookings = studentBooking;

// ==========================================
// TEACHER BOOKINGS
// ==========================================
export const tutorBooking = async (req, res) => {
  try {
    const tutorId = req.params.tutorId;

    const bookings = await Booking.find({
      tutor: tutorId,
    })
      .populate("tutor")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.log("tutorBooking error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getTutorBookings = tutorBooking;

// ==========================================
// VERIFY 4-DIGIT CLASS START OTP
// ==========================================
export const verifyClassStartOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const booking = await Booking.findById(req.params.id).populate("tutor");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Class cannot be started. Student payment is still pending.",
      });
    }

    if (!otp || booking.startOtp !== otp.toString().trim()) {
      return res.status(400).json({
        message: "Invalid 4-digit OTP. Please ask the student for the code shown in their dashboard.",
      });
    }

    booking.status = "in-progress";
    booking.isClassStarted = true;
    booking.classStartedAt = new Date();
    await booking.save();

    // Notify Student
    const studentNotification = await Notification.create({
      recipientEmail: booking.studentEmail,
      message: `🎯 Class Started! Tutor ${booking.tutor?.name || "Teacher"} has verified your 4-digit OTP and begun the class.`,
      type: "booking",
      bookingId: booking._id,
    });

    if (req.io) {
      const studentRoom = `user_${booking.studentEmail.toLowerCase().trim()}`;
      req.io.to(studentRoom).emit("new_notification", studentNotification);
      req.io.to(studentRoom).emit("class_started", {
        bookingId: booking._id,
        status: "in-progress",
      });
    }

    res.status(200).json({
      success: true,
      message: "4-Digit OTP verified! Class is now in-progress.",
      booking,
    });
  } catch (err) {
    console.log("verifyClassStartOtp error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// UPDATE BOOKING STATUS & ESCROW RELEASE
// ==========================================
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["pending", "accepted", "in-progress", "rejected", "completed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findById(req.params.id).populate("tutor");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = status;

    // Escrow Release upon Class Completion
    if (status === "completed" && booking.escrowStatus === "held") {
      booking.escrowStatus = "released_to_tutor";
      booking.completedSessions = (booking.completedSessions || 0) + 1;

      // Notify Tutor about Escrow Payout
      if (booking.tutor?.email) {
        await Notification.create({
          recipientEmail: booking.tutor.email,
          message: `💵 Escrow Payout Released! ₹${booking.amount} has been released to your account for completing class with ${booking.studentName}.`,
          type: "payment",
          bookingId: booking._id,
        });
      }
    }

    await booking.save();

    // Student Notification
    let studentMessage = "";

    if (status === "accepted") {
      studentMessage = `Your booking request for ${booking.subject} has been accepted by ${
        booking.tutor?.name || "Tutor"
      }. Please complete advance payment to authorize home visit.`;

      sendEmail({
        to: booking.studentEmail,
        subject: `🎉 Booking Accepted for ${booking.subject} — Complete Payment for Home Visit`,
        html: bookingAcceptedEmail({
          studentName: booking.studentName,
          tutorName: booking.tutor?.name || "Your Tutor",
          subject: booking.subject,
          date: booking.date,
          time: booking.time,
          tutorPhone: booking.tutor?.phoneNumber,
        }),
      }).catch((err) => console.log("Email error:", err));

    } else if (status === "rejected") {
      studentMessage = `Your booking request for ${booking.subject} has been rejected by ${
        booking.tutor?.name || "Tutor"
      }.`;

      sendEmail({
        to: booking.studentEmail,
        subject: `Booking Request Update - ${booking.subject}`,
        html: bookingRejectedEmail({
          studentName: booking.studentName,
          tutorName: booking.tutor?.name || "Your Tutor",
          subject: booking.subject,
        }),
      }).catch((err) => console.log("Email error:", err));

    } else if (status === "completed") {
      studentMessage = `Your ${booking.subject} session is complete! Thank you for learning with Destiny Gurukul.`;

      sendEmail({
        to: booking.studentEmail,
        subject: `⭐ Session Completed - Rate Your Tutor`,
        html: bookingCompletedEmail({
          studentName: booking.studentName,
          tutorName: booking.tutor?.name || "Your Tutor",
          subject: booking.subject,
        }),
      }).catch((err) => console.log("Email error:", err));
    }

    if (studentMessage) {
      const studentNotification = await Notification.create({
        recipientEmail: booking.studentEmail,
        message: studentMessage,
        type: "booking",
        bookingId: booking._id,
      });

      if (req.io) {
        const room = `user_${booking.studentEmail.toLowerCase().trim()}`;
        req.io.to(room).emit("new_notification", studentNotification);
        req.io.to(room).emit("booking_status_updated", {
          bookingId: booking._id,
          status,
          message: studentMessage,
        });
      }
    }

    res.status(200).json({
      message: `Booking ${status} successfully`,
      booking,
    });
  } catch (err) {
    console.log("updateBookingStatus error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// 100% MONEY-BACK ESCROW REFUND
// ==========================================
export const refundBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id).populate("tutor");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.paymentStatus !== "paid") {
      return res.status(400).json({ message: "Cannot refund an unpaid booking" });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    booking.escrowStatus = "refunded_to_student";
    booking.refundReason = reason || "Tutor did not attend or cancelled home visit";
    await booking.save();

    // Notify Student
    await Notification.create({
      recipientEmail: booking.studentEmail,
      message: `🛡️ 100% Money-Back Refund: ₹${booking.amount} has been processed back to your payment method under DestinyGurukul Escrow Protection.`,
      type: "booking",
      bookingId: booking._id,
    });

    res.status(200).json({
      success: true,
      message: "100% Money-back guarantee refund processed successfully",
      booking,
    });
  } catch (err) {
    console.log("refundBooking error:", err);
    res.status(500).json({ message: err.message });
  }
};

export { createBooking as Booking };
