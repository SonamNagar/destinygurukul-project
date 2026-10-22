import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["booking", "application", "system", "payment"],
      default: "booking",
    },

    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
