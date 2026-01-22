# ForexStockX - Complete Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
3. **npm** or **yarn** package manager (comes with Node.js)

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

Open your terminal in the project root directory and run:

```powershell
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Step 2: Setup PostgreSQL Database

1. **Start PostgreSQL service** (if not already running)

2. **Create a new database:**

```powershell
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE forexstockx;

# Exit psql
\q
```

### Step 3: Configure Environment Variables

#### Backend Environment Variables

1. Copy the example file:
```powershell
cd backend
copy .env.example .env
```

2. Edit `backend/.env` with your actual values:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/forexstockx"
JWT_SECRET="your-super-secret-jwt-key-min-32-characters-long-change-this"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Important:** Replace `YOUR_PASSWORD` with your PostgreSQL password!

#### Frontend Environment Variables

1. Copy the example file:
```powershell
cd ../frontend
copy .env.example .env
```

2. The default values should work:
```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Setup Database Schema

Run Prisma migrations to create all database tables:

```powershell
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

This will create all necessary tables:
- users
- wallets
- currency_exchange_history
- stock_investment_history

### Step 5: Start the Application

You have two options:

#### Option A: Start Both Servers Together (Recommended)

From the root directory:
```powershell
npm run dev
```

This will start:
- Backend API on `http://localhost:5000`
- Frontend on `http://localhost:5173`

#### Option B: Start Servers Separately

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## 🎯 Testing the Application

### 1. Register a New User

1. Click "Get Started" or "Create Account"
2. Fill in:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Click "Create Account"

### 2. Login

1. Use the credentials you just created
2. You'll be redirected to the dashboard

### 3. Explore Features

**Dashboard:**
- View your INR balance (₹1,00,000 initial balance)
- See transaction statistics
- Quick access to all features

**Currency Exchange:**
- Select a currency (USD, EUR, GBP, etc.)
- Enter amount to exchange
- View live exchange rates
- Complete the exchange

**Stock Prediction:**
- Browse promoted stocks
- View AI predictions (Up/Down/Neutral)
- Select a stock and invest
- Track your investments

**History:**
- View currency exchange history
- View stock investment history

**Profile:**
- View account details
- See wallet summary
- Check activity statistics

## 🛠️ Development Tools

### View Database in Browser

```powershell
cd backend
npx prisma studio
```

This opens a GUI at `http://localhost:5555` to view and edit database records.

### Reset Database

If you need to reset the database:

```powershell
cd backend
npx prisma migrate reset
```

**Warning:** This will delete all data!

### Create New Migration

After modifying `prisma/schema.prisma`:

```powershell
cd backend
npx prisma migrate dev --name your_migration_name
```

## 📁 Project Structure

```
ForexStockX/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   └── config.js          # App configuration
│   │   ├── controllers/           # Business logic
│   │   │   ├── authController.js
│   │   │   ├── currencyController.js
│   │   │   ├── stockController.js
│   │   │   └── userController.js
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT authentication
│   │   ├── routes/                # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── currencyRoutes.js
│   │   │   ├── stockRoutes.js
│   │   │   └── userRoutes.js
│   │   └── server.js              # Express server
│   ├── .env                       # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx    # Auth state management
│   │   ├── pages/                 # All page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CurrencyExchange.tsx
│   │   │   ├── StockPrediction.tsx
│   │   │   ├── CurrencyHistory.tsx
│   │   │   ├── StockHistory.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── utils/
│   │   │   ├── api.ts             # Axios configuration
│   │   │   └── helpers.ts         # Utility functions
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   ├── .env                       # Environment variables
│   └── package.json
└── README.md
```

## 🔒 Security Features

✅ **Password Hashing:** bcrypt with 12 rounds
✅ **JWT Authentication:** Secure token-based auth
✅ **httpOnly Cookies:** XSS protection
✅ **Input Validation:** All endpoints validated
✅ **SQL Injection Protection:** Prisma ORM
✅ **CORS Configuration:** Controlled access
✅ **Environment Variables:** Sensitive data protection

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Currency Exchange
- `GET /api/currency/rates` - Get exchange rates
- `POST /api/currency/exchange` - Perform exchange
- `GET /api/currency/history` - Get exchange history

### Stock Prediction
- `GET /api/stocks` - Get promoted stocks (with optional search)
- `POST /api/stocks/invest` - Record investment
- `GET /api/stocks/history` - Get investment history

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/wallet` - Get wallet details

## 🐛 Troubleshooting

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
1. Ensure PostgreSQL is running
2. Check DATABASE_URL in `backend/.env`
3. Verify database exists: `psql -U postgres -l`

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
1. Change PORT in `backend/.env`
2. Update VITE_API_URL in `frontend/.env`

### Prisma Client Error

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```powershell
cd backend
npx prisma generate
```

### CORS Error

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Ensure backend is running
2. Check FRONTEND_URL in `backend/.env` matches your frontend URL

## 📝 Default User Credentials

After registration, you can create any user. Initial wallet balance is **₹1,00,000**.

## 🚀 Production Deployment

### Build Frontend

```powershell
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

### Environment Variables for Production

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (minimum 32 characters)
3. Update `DATABASE_URL` to production database
4. Enable HTTPS
5. Configure proper CORS origins

## 📞 Support

If you encounter any issues:

1. Check this setup guide
2. Review error messages carefully
3. Ensure all prerequisites are installed
4. Verify environment variables are correct

## 🎉 Success!

If everything is working:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ Database connected
- ✅ You can register, login, and use all features

**Happy Trading! 🚀**
