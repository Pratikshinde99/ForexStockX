import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    LayoutDashboard,
    ArrowLeftRight,
    TrendingUp,
    User,
    LogOut,
    Menu,
    X,
    Shield
} from 'lucide-react';

const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/currency-exchange', label: 'Currency Exchange', icon: ArrowLeftRight },
        { path: '/stock-prediction', label: 'Stock Prediction', icon: TrendingUp },
        { path: '/profile', label: 'Profile', icon: User },
    ];

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/dashboard" className="flex items-center space-x-3 group">
                        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-white leading-none">ForexStockX</span>
                            <span className="text-[10px] font-semibold text-primary-400 uppercase tracking-widest mt-1">Trading App</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${isActive
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User Menu */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <div className="flex items-center space-x-3 border-r border-slate-700 pr-4">
                            <div className="text-right">
                                <p className="text-sm font-bold text-white leading-none">{user?.name}</p>
                                <div className="flex items-center justify-end space-x-1 mt-1">
                                    <Shield className="w-3 h-3 text-green-500" />
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">SECURED</p>
                                </div>
                            </div>
                            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center font-bold text-primary-500 text-sm">
                                {user?.name.charAt(0)}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-500 transition-all"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg bg-slate-700 text-white"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-slate-800 border-t border-slate-700">
                    <div className="px-4 py-6 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-700'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="text-sm font-bold">{item.label}</span>
                                </Link>
                            );
                        })}
                        <div className="pt-4 border-t border-slate-700 mt-2">
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 font-bold uppercase tracking-wider text-xs"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
