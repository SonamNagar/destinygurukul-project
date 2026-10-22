import express from "express";
import {
  getAdminStats,
  getAllTutors,
  getPendingApplications,
  updateTutorStatus,
  scheduleOfflineInterview,
  submitInterviewResult,
} from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// Admin Dashboard Stats
router.get("/stats", authMiddleware, adminMiddleware, getAdminStats);

// All Tutor Applications
router.get("/tutors", authMiddleware, adminMiddleware, getAllTutors);

// Pending Tutor Applications
router.get(
  "/pending-applications",
  authMiddleware,
  adminMiddleware,
  getPendingApplications
);

// Approve / Reject Tutor
router.put(
  "/tutor-applications/:id",
  authMiddleware,
  adminMiddleware,
  updateTutorStatus
);

// Schedule Offline Interview
router.post(
  "/tutor-applications/:id/schedule-interview",
  authMiddleware,
  adminMiddleware,
  scheduleOfflineInterview
);
router.post(
  "/tutors/:id/schedule-interview",
  authMiddleware,
  adminMiddleware,
  scheduleOfflineInterview
);

// Submit Interview Result & Evaluation
router.post(
  "/tutor-applications/:id/interview-result",
  authMiddleware,
  adminMiddleware,
  submitInterviewResult
);
router.post(
  "/tutors/:id/interview-result",
  authMiddleware,
  adminMiddleware,
  submitInterviewResult
);

export default router;