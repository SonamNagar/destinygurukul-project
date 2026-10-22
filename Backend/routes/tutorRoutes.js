import express from "express";
import {
  getAllTutors,
  getTutorById,
  createTutor,
  updateTutor,
  deleteTutor,
  getTutorByEmail,
  getTutorStats,
  getPopularSubjects,
  addTutorReview,
} from "../controllers/tutorController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Home page stats
router.get("/stats", getTutorStats);

// Popular subjects
router.get("/popular-subjects", getPopularSubjects);

// All approved tutors (public directory)
router.get("/", getAllTutors);

// Tutor by email (for Teacher Dashboard)
router.get("/email/:email", getTutorByEmail);

// Single tutor by ID
router.get("/:id", getTutorById);

// Submit review for tutor (authenticated students)
router.post("/:id/reviews", authMiddleware, addTutorReview);

// Submit tutor application
router.post("/", createTutor);

// Update tutor (authenticated: owner or admin)
router.put("/:id", authMiddleware, updateTutor);

// Delete tutor (authenticated: owner or admin)
router.delete("/:id", authMiddleware, deleteTutor);

export default router;
