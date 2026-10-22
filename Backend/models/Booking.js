import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    phoneNumber: {
      type: String,
      required: true,
    },

    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BecomeTutor",
      required: true,
      index: true,
    },

    subject: {
      type: String,
      required: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    // Home Location & Address for Google Maps Navigation
    address: {
      type: String,
      default: "",
    },
    area: {
      type: String,
      default: "Bhopal",
    },

    message: {
      type: String,
      default: "",
    },

    // Package Type: Single Session vs Monthly Subscription
    packageType: {
      type: String,
      enum: ["single", "monthly_12", "monthly_24"],
      default: "single",
    },
    totalSessions: {
      type: Number,
      default: 1,
    },
    completedSessions: {
      type: Number,
      default: 0,
    },

    // Booking Lifecycle Status
    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },

    // 4-Digit Class Start OTP Verification
    startOtp: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
    isClassStarted: {
      type: Boolean,
      default: false,
    },
    classStartedAt: {
      type: Date,
    },

    // Payment Tracking
    amount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
      index: true,
    },
    razorpayOrderId: {
      type: String,
      default: "",
    },
    razorpayPaymentId: {
      type: String,
      default: "",
    },

    // Escrow & Money-Back Guarantee Protection
    escrowStatus: {
      type: String,
      enum: ["none", "held", "released_to_tutor", "refunded_to_student"],
      default: "none",
    },
    refundReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
