import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Enhanced mock stock data with realistic simulation parameters
const PROMOTED_STOCKS = [
    {
        id: '1',
        name: 'Reliance Industries',
        symbol: 'RELIANCE',
        currentPrice: 2456.75,
        prediction: 'Up',
        change: '+2.3%',
        sector: 'Energy',
        sentiment: 'Bullish',
        riskLevel: 'Moderate',
        details: {
            targetPrice: 2680.00,
            daysToPeak: 12,
            confidence: 88,
            dailyVolatility: 1.2,
            expectedReturn: 9.1,
            beta: 1.15,
            marketCap: '17.4T'
        }
    },
    {
        id: '2',
        name: 'Tata Consultancy Services',
        symbol: 'TCS',
        currentPrice: 3678.90,
        prediction: 'Up',
        change: '+1.8%',
        sector: 'IT',
        sentiment: 'Strong Buy',
        riskLevel: 'Low',
        details: {
            targetPrice: 3850.00,
            daysToPeak: 8,
            confidence: 75,
            dailyVolatility: 0.8,
            expectedReturn: 4.6,
            beta: 0.85,
            marketCap: '13.5T'
        }
    },
    {
        id: '3',
        name: 'HDFC Bank',
        symbol: 'HDFCBANK',
        currentPrice: 1623.45,
        prediction: 'Neutral',
        change: '+0.5%',
        sector: 'Banking',
        sentiment: 'Market Perform',
        riskLevel: 'Low',
        details: {
            targetPrice: 1650.00,
            daysToPeak: 15,
            confidence: 60,
            dailyVolatility: 0.5,
            expectedReturn: 1.6,
            beta: 0.92,
            marketCap: '12.1T'
        }
    },
    {
        id: '4',
        name: 'Infosys',
        symbol: 'INFY',
        currentPrice: 1456.30,
        prediction: 'Up',
        change: '+3.2%',
        sector: 'IT',
        sentiment: 'Bullish',
        riskLevel: 'Moderate',
        details: {
            targetPrice: 1580.00,
            daysToPeak: 5,
            confidence: 92,
            dailyVolatility: 2.1,
            expectedReturn: 8.5,
            beta: 1.25,
            marketCap: '6.2T'
        }
    },
    {
        id: '5',
        name: 'ICICI Bank',
        symbol: 'ICICIBANK',
        currentPrice: 987.60,
        prediction: 'Down',
        change: '-1.2%',
        sector: 'Banking',
        sentiment: 'Bearish',
        riskLevel: 'Moderate',
        details: {
            targetPrice: 920.00,
            daysToPeak: 6,
            confidence: 82,
            dailyVolatility: 1.5,
            expectedReturn: -6.8,
            beta: 1.10,
            marketCap: '7.1T'
        }
    },
];

// Get promoted stocks with simulated live price movement
export const getPromotedStocks = async (req, res) => {
    try {
        const { search } = req.query;

        // Add a small random fluctuation to currentPrice for a "Live" feel
        const dynamicStocks = PROMOTED_STOCKS.map(stock => {
            const movement = 1 + (Math.random() * 0.002 - 0.001); // 0.1% fluctuation
            return {
                ...stock,
                currentPrice: parseFloat((stock.currentPrice * movement).toFixed(2))
            };
        });

        let stocks = dynamicStocks;

        // Filter by search query if provided
        if (search) {
            const searchLower = search.toLowerCase();
            stocks = stocks.filter(
                (stock) =>
                    stock.name.toLowerCase().includes(searchLower) ||
                    stock.symbol.toLowerCase().includes(searchLower)
            );
        }

        res.json({
            success: true,
            stocks,
        });
    } catch (error) {
        console.error('Get promoted stocks error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch stocks.',
            error: error.message,
        });
    }
};

// Record stock investment
export const investInStock = async (req, res) => {
    try {
        const { stockName, symbol, priceAtInvestment, amount, prediction } = req.body;
        const userId = req.user.id;

        // Validation
        if (!stockName || !symbol || !priceAtInvestment || !amount) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.',
            });
        }

        const investmentAmount = parseFloat(amount);

        if (investmentAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Investment amount must be greater than zero.',
            });
        }

        // Check user balance
        const wallet = await prisma.wallet.findUnique({ where: { userId } });
        if (!wallet || wallet.inrBalance < investmentAmount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient INR balance to complete this investment.',
            });
        }

        // Transaction: Update wallet and create history
        const result = await prisma.$transaction(async (tx) => {
            // Deduct from wallet
            const updatedWallet = await tx.wallet.update({
                where: { userId },
                data: {
                    inrBalance: { decrement: investmentAmount }
                }
            });

            // Create investment record
            const investment = await tx.stockInvestmentHistory.create({
                data: {
                    userId,
                    stockName,
                    symbol,
                    priceAtInvestment,
                    amount: investmentAmount,
                    prediction: prediction || 'Neutral',
                },
            });

            return { updatedWallet, investment };
        });

        res.status(201).json({
            success: true,
            message: 'Investment successful and balance updated!',
            investment: result.investment,
            inrBalance: result.updatedWallet.inrBalance
        });
    } catch (error) {
        console.error('Invest in stock error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record investment.',
            error: error.message,
        });
    }
};

// Get stock investment history
export const getInvestmentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const history = await prisma.stockInvestmentHistory.findMany({
            where: { userId },
            orderBy: { timestamp: 'desc' },
        });

        res.json({
            success: true,
            history,
        });
    } catch (error) {
        console.error('Get investment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch investment history.',
            error: error.message,
        });
    }
};
