import express from 'express';
import {
    getExchangeRates,
    exchangeCurrency,
    getExchangeHistory,
} from '../controllers/currencyController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All currency routes are protected
router.get('/rates', authMiddleware, getExchangeRates);
router.post('/exchange', authMiddleware, exchangeCurrency);
router.get('/history', authMiddleware, getExchangeHistory);

export default router;
