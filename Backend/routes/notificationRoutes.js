import express from "express";
import {
  getNotification,
  getUnreadCount,
  readNotification,
  markAllAsRead,
} from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth to all notification routes
router.use(authMiddleware);

// GET unread notification count
router.get("/unread-count/:email", getUnreadCount);

// GET notifications by student/user email (support both /user/:email and /:email)
router.get("/user/:email", getNotification);
router.get("/:email", getNotification);

// PUT mark all notifications as read
router.put("/read-all/:email", markAllAsRead);

// PUT mark single notification as read (support both /read/:id and /:id/read)
router.put("/read/:id", readNotification);
router.put("/:id/read", readNotification);

export default router;
