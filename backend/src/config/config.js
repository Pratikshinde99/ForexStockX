import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  bcryptRounds: 12,
  jwtExpiry: '7d',
  cookieMaxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// Validate critical environment variables
if (!process.env.JWT_SECRET && config.nodeEnv === 'production') {
  console.error('FATAL ERROR: JWT_SECRET is not defined in production!');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('FATAL ERROR: DATABASE_URL is not defined!');
  process.exit(1);
}
