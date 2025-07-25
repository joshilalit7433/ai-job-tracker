import { Response } from "express";
import { Notification } from "../models/notification.model.js";
import { AuthRequest } from "../types/user.types.js";

// get Notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};

// delete notifications
export const removeNotification = async (
  req: AuthRequest<{ id: string }>, 
  res: Response
) => {
  try {
    const userId = req.user?._id;
    const { id: notificationId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
        success: false,
      });
    }

    if (notification.user.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this notification",
        success: false,
      });
    }

    await notification.deleteOne();

    return res.status(200).json({
      message: "Notification deleted successfully",
      success: true,
    });
  } catch (error: any) {
    console.error("Error deleting notification:", error.message);
    return res.status(500).json({
      message: "Server error while deleting notification",
      success: false,
    });
  }
};
