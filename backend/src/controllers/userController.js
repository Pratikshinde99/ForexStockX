import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get user profile with detailed statistics and investment value
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                wallet: {
                    select: {
                        inrBalance: true,
                        foreignBalances: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        // Fetch counts and investment history
        const [currencyTransactions, stockInvestments, investments] = await Promise.all([
            prisma.currencyExchangeHistory.count({ where: { userId } }),
            prisma.stockInvestmentHistory.count({ where: { userId } }),
            prisma.stockInvestmentHistory.findMany({ where: { userId } }),
        ]);

        // Calculate investment totals
        const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);

        // Simulating current market value for the "Real Time Environment" feel
        const simulatedROI = 0.045 + (Math.random() * 0.02 - 0.01); // Fluctuates for realism
        const currentInvestmentValue = totalInvested * (1 + simulatedROI);
        const dailyPL = totalInvested * (Math.random() * 0.02 - 0.005);

        // Elite News Headlines
        const marketNews = [
            { id: 1, title: 'RBI maintains status quo on repo rate', time: '10m ago', impact: 'Neutral' },
            { id: 2, title: 'Reliance announces strategic shift in green energy', time: '45m ago', impact: 'Bullish' },
            { id: 3, title: 'Global IT demand shows recovery signs in Q3', time: '2h ago', impact: 'Bullish' }
        ];

        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt,
            },
            wallet: {
                inrBalance: user.wallet.inrBalance,
                foreignBalances: user.wallet.foreignBalances,
                totalInvested,
                currentInvestmentValue,
            },
            stats: {
                currencyTransactions,
                stockInvestments,
                dailyPL,
                totalProfit: currentInvestmentValue - totalInvested,
                lastUpdate: new Date().toISOString(),
                marketNews,
                riskScore: totalInvested > 50000 ? 'Moderate' : 'Low'
            },
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch profile.',
            error: error.message,
        });
    }
};

// ... rest of the file ...
export const getWalletDetails = async (req, res) => {
    try {
        const userId = req.user.id;

        const wallet = await prisma.wallet.findUnique({
            where: { userId },
        });

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: 'Wallet not found.',
            });
        }

        res.json({
            success: true,
            wallet,
        });
    } catch (error) {
        console.error('Get wallet details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch wallet details.',
            error: error.message,
        });
    }
};
