import Notification from "../models/Notification.js";

// ==========================================
// GET NOTIFICATIONS BY USER EMAIL
// ==========================================
export const getNotification = async (req, res) => {
  try {
    const email = req.params.email;

    const notifications = await Notification.find({
      recipientEmail: email,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(notifications);
  } catch (err) {
    console.log("getNotification error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const getUserNotifications = getNotification;

// ==========================================
// GET UNREAD NOTIFICATION COUNT
// ==========================================
export const getUnreadCount = async (req, res) => {
  try {
    const email = req.params.email;

    const count = await Notification.countDocuments({
      recipientEmail: email,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (err) {
    console.log("getUnreadCount error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// MARK SINGLE NOTIFICATION AS READ
// ==========================================
export const readNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (err) {
    console.log("readNotification error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};

export const markAsRead = readNotification;

// ==========================================
// MARK ALL NOTIFICATIONS AS READ
// ==========================================
export const markAllAsRead = async (req, res) => {
  try {
    const email = req.params.email;

    await Notification.updateMany(
      { recipientEmail: email, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (err) {
    console.log("markAllAsRead error:", err);
    res.status(500).json({
      message: err.message,
    });
  }
};
