import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { 
  ownerDashboard, 
  getPendingRequests, 
  updateBookingRequest 
} from '../controllers/ownerController.js';

const router = express.Router();

// 📌 Owner Dashboard Route
router.get('/dashboard', authMiddleware, roleMiddleware(['owner']), ownerDashboard);

// 📌 Get Pending Requests Route
router.get('/pending-requests', authMiddleware, roleMiddleware(['owner']), getPendingRequests);

// 📌 Update Booking Request Route (Accept/Reject)
router.put('/update-request/:bookingId', authMiddleware, roleMiddleware(['owner']), updateBookingRequest);

export default router;
