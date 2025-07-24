import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications" });
  }
};



export const removeNotification = async (req, res) => {
   try {
      const notificationId = req.params.id;
  
      const notification = await Notification.findById(notificationId);
  
      if (!notification) {
        return res.status(400).json({
          message: "notification not found",
          success: false,
        });
      }
  
      if (notification.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: "You are not authorized to delete this job notification",
          success: false,
        });
      }
  
      await notification.deleteOne();
  
      return res.status(200).json({
        message: "Job notification Deleted Successfully",
        success: true,
      });
    } catch (error) {
      console.error("error deleting job notification", error.message);
      return res.status(500).json({
        message: "Server error while deleting job notification",
        success: false,
      });
    }
};
