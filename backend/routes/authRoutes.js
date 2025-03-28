import express from 'express';
import { register, login, getUserProfile, updateProfile } from '../controllers/authController.js';
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Get User Profile
router.get('/profile', authMiddleware, getUserProfile)
router.put('/update-profile', authMiddleware, updateProfile);

export default router;
