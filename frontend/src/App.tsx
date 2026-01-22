import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CurrencyExchange from './pages/CurrencyExchange';
import StockPrediction from './pages/StockPrediction';
import CurrencyHistory from './pages/CurrencyHistory';
import StockHistory from './pages/StockHistory';
import ProfilePage from './pages/ProfilePage';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="min-h-screen">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/currency-exchange"
                            element={
                                <ProtectedRoute>
                                    <CurrencyExchange />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/stock-prediction"
                            element={
                                <ProtectedRoute>
                                    <StockPrediction />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history/currency"
                            element={
                                <ProtectedRoute>
                                    <CurrencyHistory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/history/stocks"
                            element={
                                <ProtectedRoute>
                                    <StockHistory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Logout Route */}
                        <Route path="/logout" element={<Navigate to="/login" replace />} />

                        {/* Catch all - redirect to home */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
