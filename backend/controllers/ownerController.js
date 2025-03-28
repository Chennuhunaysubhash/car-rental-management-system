import Booking from '../models/bookingModel.js';
import { createNotification } from "./notificationController.js";
/**
 * 📌 **Get Pending Requests for Owner**
 * Fetches all pending booking requests related to the owner's cars.
 */
export const getPendingRequests = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Fetch pending booking requests related to the owner's cars
    const pendingRequests = await Booking.find({ ownerId, status: "pending" })
      .populate("carId", "model brand pricePerHour carNumber image") // Added brand, price, and car number
      .populate("renterId", "email userId"); // Get renter details

    res.json({ pendingRequests });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 📌 **Accept Booking Request**
 * Updates the booking status to "accepted"
 */
export const updateBookingRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // Expecting "accepted" or "rejected"

    // Validate status input
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    // Update the booking status and populate necessary fields
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    )
      .populate({
        path: "carId",
        select: "model brand owner",
        populate: { path: "owner", select: "firstName" } // Populate owner's first name
      })
      .populate("renterId", "email _id"); // Populate renter details

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Get owner's first name
    const ownerName = booking.carId.owner?.firstName || "the owner"; // Fallback if missing

    // 🔹 Generate notification message with owner's name
    const message =
      status === "accepted"
        ? `Booking request for ${booking.carId.brand} ${booking.carId.model} has been approved by ${ownerName}`
        : `Booking request for ${booking.carId.brand} ${booking.carId.model} has been cancelled by ${ownerName}`;

    // Create a notification for the renter
    await createNotification(message, booking.renterId._id, booking.carId._id, booking._id);

    res.json({ success: true, message: `Booking ${status} successfully`, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



/**
 * 📌 **Owner Dashboard**
 * Returns a welcome message for the logged-in owner.
 */
export const ownerDashboard = (req, res) => {
  res.json({ message: `Welcome ${req.user.name}` });
};
