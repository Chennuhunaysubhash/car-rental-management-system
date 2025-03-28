import express from "express";
import { getCars } from "../controllers/renterController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// 🏎️ Get available cars (search & pagination)
router.get("/cars", authMiddleware, roleMiddleware(["renter"]), getCars);

export default router;
