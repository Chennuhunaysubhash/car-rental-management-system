import express from "express";
import { deleteNotification,getOwnerNotifications, getUserNotifications } from "../controllers/notificationController.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();

// Get notifications for the logged-in user (renter or owner)
router.get("/user", authMiddleware, getUserNotifications);

// Get notifications for the owner
router.get("/owner", authMiddleware, getOwnerNotifications);

// Delete a specific notification (owner only)
router.delete("/:notificationId", authMiddleware, deleteNotification);
export default router;
