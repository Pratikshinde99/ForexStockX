import express from 'express';
import {
    getPromotedStocks,
    investInStock,
    getInvestmentHistory,
} from '../controllers/stockController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All stock routes are protected
router.get('/', authMiddleware, getPromotedStocks);
router.post('/invest', authMiddleware, investInStock);
router.get('/history', authMiddleware, getInvestmentHistory);

export default router;
