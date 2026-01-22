import express from 'express';
import { getUserProfile, getWalletDetails } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All user routes are protected
router.get('/profile', authMiddleware, getUserProfile);
router.get('/wallet', authMiddleware, getWalletDetails);

export default router;
