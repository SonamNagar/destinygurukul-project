import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshAccessToken);

// Password Reset Flow
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password/:token", authLimiter, resetPassword);

// User Profile (Protected)
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;