# ⚡ ForexStockX - Quick Reference Card

## 🚀 Quick Start Commands

### First Time Setup (One-time only)
```powershell
# 1. Create PostgreSQL database
createdb forexstockx

# 2. Update backend/.env with your PostgreSQL password
# DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/forexstockx"

# 3. Run database migrations
cd backend
npx prisma migrate dev --name init
cd ..

# 4. Start the application
npm run dev
```

### Regular Start
```powershell
# Quick start (from project root)
.\start.ps1

# OR manually
npm run dev
```

---

## 🌐 URLs

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Database GUI:** `cd backend && npx prisma studio`

---

## 📁 Important Files

### Configuration
- `backend/.env` - Backend environment variables (UPDATE PostgreSQL password!)
- `frontend/.env` - Frontend environment variables
- `backend/prisma/schema.prisma` - Database schema

### Documentation
- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed setup instructions
- `PROJECT_SUMMARY.md` - Complete feature list
- `QUICK_REFERENCE.md` - This file

---

## 🔐 Routes Structure

### Public Routes (No Login Required)
```
/               → Landing Page
/register       → User Registration
/login          → User Login
```

### Protected Routes (Login Required)
```
/dashboard              → Main Dashboard
/currency-exchange      → Currency Exchange
/stock-prediction       → Stock Prediction
/history/currency       → Currency History
/history/stocks         → Stock History
/profile               → User Profile
/logout                → Logout & Redirect
```

---

## 💻 Development Commands

### Backend
```powershell
cd backend

# Start dev server
npm run dev

# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Open database GUI
npx prisma studio
```

### Frontend
```powershell
cd frontend

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Testing Checklist

1. ✅ Register new user
2. ✅ Login with credentials
3. ✅ View dashboard (₹1,00,000 balance)
4. ✅ Exchange INR to USD
5. ✅ View currency history
6. ✅ Invest in a stock
7. ✅ View stock history
8. ✅ Check profile
9. ✅ Logout

---

## 🔧 Troubleshooting

### Database Connection Error
```powershell
# Check if PostgreSQL is running
# Update DATABASE_URL in backend/.env
# Verify database exists: psql -U postgres -l
```

### Port Already in Use
```powershell
# Change PORT in backend/.env
# Update VITE_API_URL in frontend/.env
```

### Prisma Client Error
```powershell
cd backend
npx prisma generate
```

---

## 📊 Default Data

- **Initial Balance:** ₹1,00,000 INR
- **Currencies:** USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY, SGD, AED
- **Stocks:** 10 promoted Indian stocks

---

## 🔒 Security Features

✅ bcrypt password hashing (12 rounds)
✅ JWT authentication
✅ httpOnly cookies
✅ Protected routes
✅ Input validation
✅ CORS configuration
✅ SQL injection protection

---

## 📞 Need Help?

1. Check `SETUP_GUIDE.md` for detailed instructions
2. Review `PROJECT_SUMMARY.md` for complete feature list
3. Ensure PostgreSQL is running
4. Verify environment variables are correct

---

## 🎉 You're All Set!

Your production-ready Currency Exchange & Stock Prediction platform is ready to use!

**Happy Trading! 🚀💰**
