import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency, formatNumber } from '../utils/helpers';
import {
    IndianRupee,
    TrendingUp,
    ArrowUpRight,
    History,
    RefreshCw,
    Activity,
    Zap,
    Newspaper,
    Briefcase,
    ShieldAlert
} from 'lucide-react';

interface NewsItem {
    id: number;
    title: string;
    time: string;
    impact: string;
}

interface UserData {
    user: {
        name: string;
        email: string;
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
        marketNews: NewsItem[];
        riskScore: string;
    };
}

const Dashboard: React.FC = () => {
    const [data, setData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchData = async () => {
        try {
            setRefreshing(true);
            const response = await api.get('/api/user/profile');
            if (response.data.success) {
                setData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 45000); // Polling every 45s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-vh-80">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const totalAssets = (data?.wallet.inrBalance || 0) + (data?.wallet.currentInvestmentValue || 0);
    const growthRate = ((data?.stats.totalProfit || 0) / (data?.wallet.totalInvested || 1)) * 100;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
                <div className="animate-fade-in">
                    <h1 className="text-3xl font-bold text-white">
                        Dashboard
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Welcome back, {data?.user.name}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Market Status</p>
                        <div className="flex items-center justify-end space-x-2 mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-slate-300">Live Data Active</span>
                        </div>
                    </div>
                    <button
                        onClick={fetchData}
                        className="bg-slate-800 border border-slate-700 hover:bg-slate-700 p-2.5 rounded-lg transition-all"
                        disabled={refreshing}
                    >
                        <RefreshCw className={`w-5 h-5 text-primary-500 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Equity */}
                <div className="card p-6 rounded-2xl animate-scale-in">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-primary-500/10 rounded-lg">
                            <IndianRupee className="w-6 h-6 text-primary-500" />
                        </div>
                        <span className="text-xs font-bold text-green-500">
                            +{growthRate.toFixed(1)}%
                        </span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Total Net Worth</p>
                    <h2 className="text-2xl font-bold text-white mt-1">
                        {formatCurrency(totalAssets)}
                    </h2>
                </div>

                {/* Daily Performance */}
                <div className="card p-6 rounded-2xl animate-scale-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <Activity className="w-6 h-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Daily P&L</p>
                    <h2 className={`text-2xl font-bold mt-1 ${data && data.stats.dailyPL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {data && data.stats.dailyPL > 0 ? '+' : ''}{formatCurrency(data?.stats.dailyPL || 0)}
                    </h2>
                </div>

                {/* Risk Level */}
                <div className="card p-6 rounded-2xl animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`p-2 rounded-lg ${data?.stats.riskScore === 'Low' ? 'bg-blue-500/10' : 'bg-yellow-500/10'}`}>
                            <ShieldAlert className={`w-6 h-6 ${data?.stats.riskScore === 'Low' ? 'text-blue-500' : 'text-yellow-500'}`} />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">Risk Analysis</p>
                    <h2 className="text-2xl font-bold text-white mt-1">{data?.stats.riskScore} Risk</h2>
                </div>

                {/* Available Cash */}
                <div className="card p-6 rounded-2xl animate-scale-in" style={{ animationDelay: '0.3s' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-yellow-500/10 rounded-lg">
                            <Zap className="w-6 h-6 text-yellow-500" />
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">INR Balance</p>
                    <h2 className="text-2xl font-bold text-white mt-1">{formatCurrency(data?.wallet.inrBalance || 0)}</h2>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* News & Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="card p-6 rounded-2xl animate-slide-up">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center mb-6">
                            <Newspaper className="w-4 h-4 mr-2 text-primary-500" />
                            Market News
                        </h3>
                        <div className="space-y-6">
                            {data?.stats.marketNews.map((news) => (
                                <div key={news.id} className="border-l-2 border-slate-700 pl-4">
                                    <p className="text-sm font-medium text-white">{news.title}</p>
                                    <div className="flex items-center mt-2 space-x-3">
                                        <span className="text-[10px] text-slate-500 uppercase">{news.time}</span>
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${news.impact === 'Bullish' ? 'text-green-500 bg-green-500/10' : 'text-slate-400 bg-slate-800'
                                            }`}>{news.impact}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card p-6 rounded-2xl animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center mb-6">
                            <Briefcase className="w-4 h-4 mr-2 text-primary-500" />
                            Portfolio Stats
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Stocks Held</span>
                                <span className="text-white font-bold">{data?.stats.stockInvestments}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Forex Trades</span>
                                <span className="text-white font-bold">{data?.stats.currencyTransactions}</span>
                            </div>
                            <div className="pt-4 border-t border-slate-700 mt-4">
                                <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Portfolio Mix</p>
                                <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-700">
                                    <div className="bg-primary-500 w-3/4"></div>
                                    <div className="bg-yellow-500 w-1/4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="card p-8 rounded-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                            <div>
                                <h3 className="text-xl font-bold text-white">Markets Hub</h3>
                                <p className="text-slate-400 text-sm mt-1">Quick actions and analytics</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <Link to="/currency-exchange" className="btn-secondary py-2 px-4 text-xs">
                                    Currency Exchange
                                </Link>
                                <Link to="/stock-prediction" className="btn-primary py-2 px-4 text-xs">
                                    Stock Prediction
                                </Link>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-700">
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Est. Annual Return</p>
                                    <div className="flex items-end justify-between">
                                        <h4 className="text-3xl font-bold text-white font-mono">+12.42%</h4>
                                        <TrendingUp className="w-10 h-10 text-primary-500/20" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
                                        <History className="w-4 h-4 mr-2" />
                                        Activity History
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <Link to="/history/currency" className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:bg-slate-700 transition-all">
                                            <span className="text-xs font-medium text-slate-300">Currency history</span>
                                            <ArrowUpRight className="w-4 h-4 text-slate-500" />
                                        </Link>
                                        <Link to="/history/stocks" className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:bg-slate-700 transition-all">
                                            <span className="text-xs font-medium text-slate-300">Stock history</span>
                                            <ArrowUpRight className="w-4 h-4 text-slate-500" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-700/30 p-6 rounded-2xl border border-slate-700 flex flex-col justify-between">
                                <div>
                                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Foreign Balances</h4>
                                    <div className="space-y-4 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                                        {Object.entries(data?.wallet.foreignBalances || {}).length > 0 ? (
                                            Object.entries(data?.wallet.foreignBalances).map(([currency, balance]: [string, any]) => (
                                                balance > 0 && (
                                                    <div key={currency} className="flex justify-between items-center py-2 border-b border-slate-700 last:border-0">
                                                        <span className="text-sm font-medium text-slate-400">{currency}</span>
                                                        <span className="text-sm font-bold text-white">{formatNumber(balance as number)}</span>
                                                    </div>
                                                )
                                            ))
                                        ) : (
                                            <div className="text-center py-4">
                                                <p className="text-xs text-slate-500 italic">No foreign holdings</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-primary-500/10 p-4 rounded-xl mt-4">
                                    <p className="text-[10px] text-primary-500 font-bold uppercase mb-1">Trading Insight</p>
                                    <p className="text-xs text-slate-400 italic">"Technology sector shows strong bullish signs for the coming weeks."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
