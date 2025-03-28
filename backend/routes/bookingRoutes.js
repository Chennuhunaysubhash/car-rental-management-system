import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import Booking from "../models/bookingModel.js";
import Car from "../models/carModel.js";
import { createNotification } from "../controllers/notificationController.js";

const router = express.Router();

/**
 * 📌 **Book a Car (Renter Only)**
 */
router.post("/book/:carId", authMiddleware, roleMiddleware(["renter"]), async (req, res) => {
  try {
    const { carId } = req.params;
    const { startDate, endDate } = req.body;
    const renterId = req.user._id;
    const renterName = req.user.firstName + " " + req.user.lastName;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and End dates are required" });
    }

    // Check if the car exists
    const car = await Car.findById(carId);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Prevent owner from booking their own car
    if (car.owner.toString() === renterId.toString()) {
      return res.status(400).json({ message: "You cannot book your own car" });
    }

    // Check if the car is already booked for the given dates
    const existingBooking = await Booking.findOne({
      carId,
      status: "accepted",
      $or: [
        { startDate: { $lte: endDate }, endDate: { $gte: startDate } }, // Overlapping bookings
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Car is already booked for selected dates" });
    }

    // Create new booking request
    const booking = new Booking({
      carId,
      renterId,
      ownerId: car.owner,
      startDate,
      endDate,
      status: "pending",
    });

    await booking.save();

    // Create notification for the car owner
    const message = `Booking request for ${car.model} from ${renterName}`;
    await createNotification(message, car.owner, carId, booking._id);

    res.status(201).json({ message: "Car booked successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 📌 **Owner Accepts or Rejects Booking**
 */
router.put("/:bookingId/status", authMiddleware, roleMiddleware(["owner"]), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    const ownerId = req.user._id;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find booking and ensure owner is modifying their own car's booking
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.ownerId.toString() !== ownerId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    // Update status
    booking.status = status;
    await booking.save();

    // Notify renter about the status change
    const statusMessage = status === "accepted" ? "approved" : "declined";
    const notificationMessage = `Your booking request for ${booking.carId.model} has been ${statusMessage}`;
    await createNotification(notificationMessage, booking.renterId, booking.carId._id, booking._id);

    res.json({ message: `Booking ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 📌 **Get Owner's Booking History**
 * ✅ Only shows accepted bookings for the logged-in owner
 */
router.get("/history/owner", authMiddleware, roleMiddleware(["owner"]), async (req, res) => {
  try {
    const ownerId = req.user._id;

    // Fetch only "accepted" bookings related to the owner
    const bookings = await Booking.find({ ownerId, status: "accepted" })
      .populate("carId renterId");

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 📌 **Get Renter's Booking History**
 * ✅ Shows approved & pending bookings separately
 */
router.get("/history/renter", authMiddleware, roleMiddleware(["renter"]), async (req, res) => {
  try {
    const renterId = req.user._id;

    // Fetch approved & pending bookings separately
    const approvedBookings = await Booking.find({ renterId, status: "accepted" })
      .populate("carId ownerId");
    const pendingBookings = await Booking.find({ renterId, status: "pending" })
      .populate("carId ownerId");

    res.json({ approvedBookings, pendingBookings });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 📌 **Resend Pending Booking Request (Renter Only)**
 */
router.put("/history/renter/resend/:bookingId", authMiddleware, roleMiddleware(["renter"]), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const renterId = req.user._id;

    const booking = await Booking.findById(bookingId).populate("carId");;
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renterId.toString() !== renterId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be resent" });
    }

    // Send Notification to Owner
    const message = `Booking request re-sent for ${booking.carId.model}`;
    await createNotification(message, booking.ownerId, booking.carId._id, booking._id);

    res.json({ message: "Booking request resent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * 📌 **Close Pending Booking Request (Renter Only)**
 */
router.delete("/history/renter/close/:bookingId", authMiddleware, roleMiddleware(["renter"]), async (req, res) => {
  try {
    const { bookingId } = req.params;
    const renterId = req.user._id;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.renterId.toString() !== renterId.toString()) {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({ message: "Only pending bookings can be closed" });
    }

    await booking.deleteOne();

    res.json({ message: "Booking request closed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
