import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Add a car to the cart
router.post("/add", authMiddleware, addToCart);

// ✅ Remove a car from the cart
router.delete("/remove/:carId", authMiddleware, removeFromCart);

// ✅ Get all cart cars for the logged-in renter
router.get("/", authMiddleware, getCart);


export default router;
