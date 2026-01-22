import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatNumber, formatDate } from '../utils/helpers';
import BackButton from '../components/BackButton';
import {
    Mail,
    TrendingUp,
    History,
    Shield,
    Globe,
    Briefcase,
    Settings,
    User,
    IndianRupee
} from 'lucide-react';

interface UserProfile {
    user: {
        id: string;
        name: string;
        email: string;
        createdAt: string;
    };
    wallet: {
        inrBalance: number;
        foreignBalances: any;
        totalInvested: number;
        currentInvestmentValue: number;
    };
    stats: {
        currencyTransactions: number;
        stockInvestments: number;
        dailyPL: number;
        totalProfit: number;
        lastUpdate: string;
    };
}

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/user/profile');
                if (response.data.success) {
                    setProfile(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const totalEquity = (profile?.wallet.inrBalance || 0) + (profile?.wallet.currentInvestmentValue || 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BackButton />

            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                    <User className="w-8 h-8 mr-3 text-primary-500" />
                    My Profile
                </h1>
                <p className="text-slate-400">Manage your account settings and view stats</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card text-center animate-slide-up">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center text-4xl font-bold border-4 border-slate-700 mx-auto">
                                {profile?.user.name.charAt(0)}
                            </div>
                            <div className="absolute bottom-0 right-0 p-1.5 bg-green-500 rounded-full border-2 border-slate-800">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-white">{profile?.user.name}</h2>
                        <p className="text-slate-400 text-sm flex items-center justify-center mt-1">
                            <Mail className="w-4 h-4 mr-2" />
                            {profile?.user.email}
                        </p>
                        <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-col space-y-3">
                            <button className="btn-secondary w-full py-2 text-sm">Edit Profile</button>
                            <button className="btn-outline w-full py-2 text-sm border-red-500 text-red-500 hover:bg-red-500">Logout</button>
                        </div>
                    </div>

                    <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                            <Settings className="w-4 h-4 mr-2 text-primary-500" />
                            Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-sm text-slate-300">Price Alerts</span>
                                <div className="w-10 h-5 bg-primary-500 rounded-full relative text-right">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                <span className="text-sm text-slate-300">Two-Factor Auth</span>
                                <span className="text-xs font-bold text-slate-500">OFF</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="card border-l-4 border-primary-500 animate-scale-in">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-400 text-sm font-medium">Net Worth</p>
                                <IndianRupee className="w-5 h-5 text-primary-500 opacity-30" />
                            </div>
                            <h3 className="text-2xl font-bold text-white font-mono">{formatCurrency(totalEquity)}</h3>
                            <div className="mt-3 flex items-center text-xs">
                                <span className="text-green-500 font-bold flex items-center mr-2">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    +12.5%
                                </span>
                                <span className="text-slate-500 tracking-wider">LIFETIME GROWTH</span>
                            </div>
                        </div>

                        <div className="card border-l-4 border-green-500 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-slate-400 text-sm font-medium">Total Profit</p>
                                <TrendingUp className="w-5 h-5 text-green-500 opacity-30" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-500 font-mono">
                                {formatCurrency(profile?.stats.totalProfit || 0)}
                            </h3>
                            <p className="mt-3 text-[10px] text-slate-500 font-bold uppercase">
                                From {profile?.stats.stockInvestments} stock trades
                            </p>
                        </div>
                    </div>

                    <div className="card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                            <Briefcase className="w-5 h-5 mr-3 text-primary-500" />
                            Account Summary
                        </h3>

                        <div className="space-y-8">
                            <div className="p-5 bg-slate-700/30 rounded-xl border border-slate-700">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">Available INR Cash</p>
                                        <p className="text-2xl font-bold text-white">{formatCurrency(profile?.wallet.inrBalance || 0)}</p>
                                    </div>
                                    <Link to="/currency-exchange" className="btn-primary py-2 px-4 text-xs font-bold">ADD FUNDS</Link>
                                </div>
                                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500" style={{ width: '100%' }}></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                                        <History className="w-4 h-4 mr-2" />
                                        Lifetime Activity
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Currency Swaps</span>
                                            <span className="text-white font-bold">{profile?.stats.currencyTransactions}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-400">Stock Investments</span>
                                            <span className="text-white font-bold">{profile?.stats.stockInvestments}</span>
                                        </div>
                                        <div className="pt-3 border-t border-slate-700 mt-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-slate-500 font-bold">MEMBER SINCE</span>
                                                <span className="text-white font-bold">{formatDate(profile?.user.createdAt || '')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                                        <Globe className="w-4 h-4 mr-2" />
                                        Other Asset Balances
                                    </h4>
                                    <div className="space-y-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
                                        {Object.entries(profile?.wallet.foreignBalances || {}).length > 0 ? (
                                            Object.entries(profile?.wallet.foreignBalances).map(([currency, balance]: [string, any]) => (
                                                balance > 0 && (
                                                    <div key={currency} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0 pb-2">
                                                        <span className="text-sm text-slate-400 font-medium">{currency}</span>
                                                        <span className="text-sm font-bold text-white">{formatNumber(balance as number)}</span>
                                                    </div>
                                                )
                                            ))
                                        ) : (
                                            <div className="py-4 text-center">
                                                <p className="text-xs font-medium text-slate-500 italic">No other currency trades yet</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
