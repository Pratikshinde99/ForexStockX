import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/config.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';
import stockRoutes from './routes/stockRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middleware
app.use(
    cors({
        origin: config.frontendUrl,
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'ForexStockX API is running!',
        timestamp: new Date().toISOString(),
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/user', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: config.nodeEnv === 'development' ? err : {},
    });
});

// Start server
app.listen(config.port, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🚀 ForexStockX API Server                     ║
║                                                            ║
║  Server running on: http://localhost:${config.port}              ║
║  Environment: ${config.nodeEnv}                              ║
║  Frontend URL: ${config.frontendUrl}        ║
║                                                            ║
║  API Endpoints:                                            ║
║  - POST /api/auth/register                                 ║
║  - POST /api/auth/login                                    ║
║  - POST /api/auth/logout                                   ║
║  - GET  /api/auth/me                                       ║
║  - GET  /api/currency/rates                                ║
║  - POST /api/currency/exchange                             ║
║  - GET  /api/currency/history                              ║
║  - GET  /api/stocks                                        ║
║  - POST /api/stocks/invest                                 ║
║  - GET  /api/stocks/history                                ║
║  - GET  /api/user/profile                                  ║
║  - GET  /api/user/wallet                                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});

export default app;
