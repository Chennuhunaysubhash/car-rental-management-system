import mongoose from "mongoose";
import Notification from "../models/notificationModel.js";

/**
 * 📌 **Get All Notifications for a User**
 * Fetches all notifications for a specific user.
 */
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user ID

    const notifications = await Notification.find({ userId })
      .populate("car_id", "model brand carNumber")
      .populate("bookingId", "status")
      .sort({ createdAt: -1 });

    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 **Create Notification**
 * Adds a new notification when an event occurs (e.g., booking request update).
 */
export const createNotification = async (message, ownerId, car_id, bookingId) => {
  try {
    console.log("Creating Notification - Owner ID:", ownerId); // Debugging

    const notification = new Notification({
      message,
      userId: new mongoose.Types.ObjectId(ownerId), // Ensure correct owner reference
      car_id,
      bookingId,
    });

    const savedNotification = await notification.save();
    console.log("Saved Notification:", savedNotification); // Debugging
  } catch (error) {
    console.error("Error creating notification:", error.message);
  }
};

/**
 * 📌 **Get All Notifications for Owner**
 * Fetches notifications specific to the logged-in owner.
 */
export const getOwnerNotifications = async (req, res) => {
  try {
    console.log("Full User Object:", req.user); // 🔍 Debugging

    const userId = req.user._id; // Fetch notifications based on userId
    console.log("Extracted User ID:", userId);

    const notifications = await Notification.find({ userId })
      .populate("car_id", "model brand carNumber")
      .populate("bookingId", "status")
      .sort({ createdAt: -1 });

    console.log("Fetched Notifications:", notifications); // 🔍 Debugging

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * 📌 **Delete Notification (Owner)**
 * Allows an owner to delete their notification.
 */
export const deleteOwnerNotification = async (req, res) => {
  try {
    const ownerId = req.user._id;
    const { notificationId } = req.params;

    // Find the notification and ensure it belongs to the owner
    const notification = await Notification.findById(notificationId).populate({
      path: "car_id",
      select: "ownerId",
    });

    if (!notification || !notification.car_id || notification.car_id.ownerId.toString() !== ownerId.toString()) {
      return res.status(404).json({ success: false, message: "Notification not found or not authorized" });
    }

    await Notification.findByIdAndDelete(notificationId);
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;

    // Find and delete the notification by ID
    const notification = await Notification.findByIdAndDelete(notificationId);

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
