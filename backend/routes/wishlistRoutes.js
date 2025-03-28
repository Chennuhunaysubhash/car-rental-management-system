import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add a car to the wishlist
router.post("/add", authMiddleware, addToWishlist);

// ✅ Remove a car from the wishlist
router.delete("/remove/:carId", authMiddleware, removeFromWishlist);

// ✅ Get all wishlist cars for the logged-in renter
router.get("/", authMiddleware, getWishlist);

export default router;
