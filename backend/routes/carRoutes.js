import express from "express";
import { addCar, getOwnerCars, updateCar, deleteCar } from "../controllers/carController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, roleMiddleware(["owner"]), addCar);
router.get("/", authMiddleware, roleMiddleware(["owner"]), getOwnerCars);
router.put("/:carId", authMiddleware, roleMiddleware(["owner"]), updateCar);
router.delete("/:carId", authMiddleware, roleMiddleware(["owner"]), deleteCar);

export default router;
