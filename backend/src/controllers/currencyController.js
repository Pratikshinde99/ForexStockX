import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mock exchange rates (in production, use a real API like exchangerate-api.com)
const EXCHANGE_RATES = {
    USD: 83.12,
    EUR: 90.45,
    GBP: 105.23,
    JPY: 0.56,
    AUD: 55.67,
    CAD: 61.89,
    CHF: 97.34,
    CNY: 11.58,
    SGD: 62.15,
    AED: 22.63,
};

// Get exchange rates
export const getExchangeRates = async (req, res) => {
    try {
        res.json({
            success: true,
            rates: EXCHANGE_RATES,
            lastUpdated: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Get exchange rates error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exchange rates.',
            error: error.message,
        });
    }
};

// Perform currency exchange
export const exchangeCurrency = async (req, res) => {
    try {
        const { inrAmount, targetCurrency } = req.body;
        const userId = req.user.id;

        // Validation
        if (!inrAmount || !targetCurrency) {
            return res.status(400).json({
                success: false,
                message: 'INR amount and target currency are required.',
            });
        }

        if (inrAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be greater than zero.',
            });
        }

        if (!EXCHANGE_RATES[targetCurrency]) {
            return res.status(400).json({
                success: false,
                message: 'Invalid target currency.',
            });
        }

        // Get user's wallet
        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found.',
            });
        }

        // Check sufficient balance
        if (wallet.inrBalance < inrAmount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient INR balance.',
                available: wallet.inrBalance,
                required: inrAmount,
            });
        }

        const exchangeRate = EXCHANGE_RATES[targetCurrency];
        const foreignAmount = inrAmount / exchangeRate;
        const newInrBalance = wallet.inrBalance - inrAmount;

        // Update wallet and create history in transaction
        const result = await prisma.$transaction(async (tx) => {
            // Update INR balance and foreign currency balance
            const foreignBalances = wallet.foreignBalances || {};
            foreignBalances[targetCurrency] = (foreignBalances[targetCurrency] || 0) + foreignAmount;

            const updatedWallet = await tx.wallet.update({
                where: { userId },
                data: {
                    inrBalance: newInrBalance,
                    foreignBalances,
                },
            });

            // Create exchange history record
            const history = await tx.currencyExchangeHistory.create({
                data: {
                    userId,
                    inrAmount,
                    targetCurrency,
                    exchangeRate,
                    foreignAmount,
                    remainingBalance: newInrBalance,
                },
            });

            return { wallet: updatedWallet, history };
        });

        res.json({
            success: true,
            message: 'Currency exchange successful!',
            exchange: {
                inrAmount,
                targetCurrency,
                exchangeRate,
                foreignAmount,
                remainingInrBalance: newInrBalance,
            },
            history: result.history,
        });
    } catch (error) {
        console.error('Exchange currency error:', error);
        res.status(500).json({
            success: false,
            message: 'Currency exchange failed.',
            error: error.message,
        });
    }
};

// Get currency exchange history
export const getExchangeHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await prisma.currencyExchangeHistory.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
        });

        res.json({
            success: true,
            history,
        });
    } catch (error) {
        console.error('Get exchange history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch exchange history.',
            error: error.message,
        });
    }
};
