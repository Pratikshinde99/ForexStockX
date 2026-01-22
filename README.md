# ForexStockX - Currency Exchange & Stock Prediction Platform

A secure and modern financial platform for real-time currency exchange and stock market predictions. Built with a focus on performance, security, and a premium user experience.

## 🚀 Key Features

### 📊 Portfolio Dashboard
- **Real-time Overview**: Track your total net worth (INR + Stocks) in real-time.
- **Market News**: Stay updated with the latest financial news and their market impact.
- **Risk Analysis**: View your portfolio's risk level based on your investment strategy.
- **Asset Allocation**: Visual breakdown of your wealth between cash and investments.

### 💱 Currency Exchange
- **Live Rates**: Exchange INR for major global currencies with real-time rate tracking.
- **Instant Settlement**: Fast and secure currency swap transactions.
- **Transaction History**: Detailed logs of all your past currency exchanges.

### 📈 Stock Prediction
- **AI-Powered Insights**: Get target prices, confidence scores, and predicted growth for top stocks.
- **Instant Investment**: Record your stock investments with automatic balance deduction.
- **Market Sentiment**: Understand if a stock is Bullish, Bearish, or a Strong Buy.
- **Investment History**: Track all your stock positions and their entry prices.

## 🛡️ Security & Architecture
- **JWT Authentication**: Secure login/register with httpOnly cookies.
- **Data Integrity**: Atomic database transactions for financial accuracy.
- **Global State**: Instant synchronization of balances across all pages.
- **TypeScript**: End-to-end type safety for a robust application.

## 📁 Project Structure

```
ForexStockX/
├── backend/           # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/ # Business Logic & Calculations
│   │   ├── middleware/ # Auth & Security
│   │   └── server.js
├── frontend/          # React/TypeScript Application
│   ├── src/
│   │   ├── pages/      # Feature Pages
│   │   ├── components/ # Reusable UI Modules
│   │   └── App.tsx
└── package.json       # Workspace Orchestration
```

## 🛠️ Quick Start

1. **Install Dependencies**: `npm install && npm run install:all`
2. **Environment**: Setup `backend/.env` with your DB details and `JWT_SECRET`.
3. **Database**: Run `npm run prisma:migrate`.
4. **Launch**: Run `npm run dev` to start both frontend and backend.

---
*Developed for professional financial tracking and analysis.*
