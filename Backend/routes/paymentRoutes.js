import express from "express";
import {
  createPaymentOrder,
  verifyPayment,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Razorpay payment order
router.post("/create-order", authMiddleware, createPaymentOrder);

// Verify payment signature
router.post("/verify", authMiddleware, verifyPayment);

export default router;
