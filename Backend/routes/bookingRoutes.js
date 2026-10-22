import express from "express";
import {
  createBooking,
  studentBooking,
  tutorBooking,
  updateBookingStatus,
  verifyClassStartOtp,
  refundBooking,
} from "../controllers/bookingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create booking
router.post("/", authMiddleware, createBooking);

// Student bookings
router.get("/student/:email", authMiddleware, studentBooking);

// Teacher bookings
router.get("/tutor/:tutorId", authMiddleware, tutorBooking);

// Update booking status
router.put("/:id/status", authMiddleware, updateBookingStatus);

// 4-Digit Class Start OTP Verification
router.post("/:id/verify-otp", authMiddleware, verifyClassStartOtp);

// 100% Escrow Money-Back Refund
router.post("/:id/refund", authMiddleware, refundBooking);

export default router;
