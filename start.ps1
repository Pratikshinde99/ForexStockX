# ForexStockX Quick Start Script
# Run this script to start both backend and frontend servers

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   ForexStockX - Starting Application   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if PostgreSQL is running
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow
$pgCheck = Test-Connection -ComputerName localhost -Port 5432 -ErrorAction SilentlyContinue

if (-not $pgCheck) {
    Write-Host "⚠️  WARNING: PostgreSQL might not be running on port 5432" -ForegroundColor Red
    Write-Host "   Please ensure PostgreSQL is started before continuing." -ForegroundColor Red
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host "✓ PostgreSQL check passed" -ForegroundColor Green
Write-Host ""

# Check if database migrations are needed
Write-Host "Checking database setup..." -ForegroundColor Yellow
$migrationsExist = Test-Path "backend\prisma\migrations"

if (-not $migrationsExist) {
    Write-Host "⚠️  Database migrations not found!" -ForegroundColor Red
    Write-Host "   Running initial migration..." -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location backend
    npx prisma migrate dev --name init
    Set-Location ..
    
    Write-Host ""
    Write-Host "✓ Database migrations completed" -ForegroundColor Green
} else {
    Write-Host "✓ Database migrations found" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Starting Servers...                  " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend API: http://localhost:5000" -ForegroundColor Green
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop all servers" -ForegroundColor Yellow
Write-Host ""

# Start both servers using concurrently
npm run dev
