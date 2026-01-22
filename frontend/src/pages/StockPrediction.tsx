import { useEffect, useState } from 'react';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/BackButton';
import {
    TrendingUp,
    TrendingDown,
    Search,
    Briefcase,
    Target,
    AlertTriangle,
    CheckCircle2,
    ShieldCheck,
    Loader2,
    ArrowUpRight
} from 'lucide-react';

interface Stock {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    prediction: string;
    change: string;
    sector: string;
    sentiment: string;
    riskLevel: string;
    details: {
        targetPrice: number;
        daysToPeak: number;
        confidence: number;
        dailyVolatility: number;
        expectedReturn: number;
    };
}

const StockPrediction: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [amount, setAmount] = useState('');
    const [isInvesting, setIsInvesting] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const fetchStocks = async () => {
        try {
            const response = await api.get(`/api/stocks?search=${search}`);
            if (response.data.success) {
                setStocks(response.data.stocks);
                // Update selected stock if it exists to show live price
                if (selectedStock) {
                    const updated = response.data.stocks.find((s: Stock) => s.id === selectedStock.id);
                    if (updated) setSelectedStock(updated);
                }
            }
        } catch (error) {
            console.error('Failed to fetch stocks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStocks();
        const interval = setInterval(fetchStocks, 5000); // Poll every 5s for live price feeling
        return () => clearInterval(interval);
    }, [search]);

    const handleInvest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStock || !amount) return;

        setIsInvesting(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await api.post('/api/stocks/invest', {
                stockName: selectedStock.name,
                symbol: selectedStock.symbol,
                priceAtInvestment: selectedStock.currentPrice,
                amount: parseFloat(amount),
                prediction: selectedStock.prediction,
            });

            if (response.data.success) {
                setStatus({
                    type: 'success',
                    message: `Successfully invested ${formatCurrency(parseFloat(amount))} in ${selectedStock.name}!`
                });
                setAmount('');
                await refreshUser();

                setTimeout(() => {
                    setStatus({ type: null, message: '' });
                    setSelectedStock(null);
                }, 4000);
            }
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Investment failed. Please check your balance.'
            });
        } finally {
            setIsInvesting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BackButton />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                <div className="animate-fade-in">
                    <h1 className="text-4xl font-bold text-white flex items-center">
                        <Target className="w-10 h-10 mr-4 text-primary-500" />
                        Stock Prediction
                    </h1>
                    <p className="text-slate-400 mt-2">AI-driven market insights and high-growth opportunities</p>
                </div>

                <div className="relative w-full md:w-96 animate-fade-in">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search stocks or industries..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border-2 border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-primary-500 transition-all outline-none shadow-lg"
                    />
                </div>
            </div>

            {status.type && (
                <div className={`mb-8 p-5 rounded-2xl border flex items-center space-x-4 animate-slide-up shadow-xl ${status.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    <p className="font-bold tracking-tight">{status.message}</p>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Stock List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        <div className="flex justify-center p-20">
                            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                        </div>
                    ) : (
                        stocks.map((stock) => (
                            <div
                                key={stock.id}
                                onClick={() => setSelectedStock(stock)}
                                className={`card group cursor-pointer p-6 transition-all duration-300 transform hover:-translate-y-1 ${selectedStock?.id === stock.id ? 'border-primary-500 ring-1 ring-primary-500 bg-primary-500/5' : 'border-slate-800 hover:border-slate-600'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${stock.prediction === 'Up' ? 'bg-green-500/10 text-green-500' :
                                                stock.prediction === 'Down' ? 'bg-red-500/10 text-red-500' : 'bg-slate-700/50 text-slate-400'
                                            }`}>
                                            {stock.symbol.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white group-hover:text-primary-400 transition-colors uppercase tracking-tight">{stock.name}</h3>
                                            <div className="flex items-center space-x-3 mt-1">
                                                <span className="text-xs font-bold text-slate-500 tracking-widest">{stock.symbol}</span>
                                                <span className="text-[10px] px-2 py-0.5 bg-slate-800 rounded text-slate-400 font-bold uppercase">{stock.sector}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-white font-mono">₹{stock.currentPrice.toLocaleString()}</p>
                                        <div className="flex items-center justify-end mt-1 space-x-2">
                                            {stock.prediction === 'Up' ? (
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                            ) : (
                                                <TrendingDown className="w-4 h-4 text-red-500" />
                                            )}
                                            <span className={`text-xs font-bold ${stock.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                                {stock.change}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Investment Panel */}
                <div className="lg:col-span-1">
                    {selectedStock ? (
                        <div className="card p-8 rounded-3xl sticky top-24 overflow-hidden border-primary-500/30 shadow-2xl animate-fade-in">
                            <div className="absolute top-0 right-0 p-4">
                                <ShieldCheck className="w-10 h-10 text-primary-500 opacity-10" />
                            </div>

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-white">{selectedStock.name}</h2>
                                <p className="text-primary-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Executive Summary</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Target Price</p>
                                        <p className="text-lg font-bold text-white">₹{selectedStock.details.targetPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Time Horizon</p>
                                        <p className="text-lg font-bold text-white">{selectedStock.details.daysToPeak} Days</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                                        <span className="text-sm font-medium text-slate-400">Market Sentiment</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-lg ${selectedStock.sentiment.includes('Buy') ? 'bg-green-500/10 text-green-500' : 'bg-slate-800 text-slate-400'
                                            }`}>{selectedStock.sentiment}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                                        <span className="text-sm font-medium text-slate-400">Risk Profile</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-lg ${selectedStock.riskLevel === 'Low' ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
                                            }`}>{selectedStock.riskLevel}</span>
                                    </div>
                                </div>

                                <form onSubmit={handleInvest} className="space-y-4 pt-4 border-t border-slate-800">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Investment Amount (INR)</label>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl py-4 px-6 font-bold text-xl text-white focus:border-primary-500 transition-all outline-none"
                                            placeholder="Enter Amount"
                                            required
                                        />
                                        <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase">Available Balance: {formatCurrency(user?.wallet?.inrBalance || 0)}</p>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isInvesting || !amount}
                                        className="w-full btn-primary py-4 rounded-2xl font-bold flex items-center justify-center space-x-3 group"
                                    >
                                        {isInvesting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <span>Execute Investment</span>
                                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="card p-12 text-center rounded-3xl border-dashed border-2 flex flex-col items-center justify-center h-full min-h-[400px]">
                            <Briefcase className="w-16 h-16 text-slate-800 mb-6" />
                            <h3 className="text-xl font-bold text-slate-400 mb-2 uppercase tracking-tight">Expert Terminal</h3>
                            <p className="text-slate-600 text-sm max-w-[200px] font-medium leading-relaxed">
                                Select a stock from the list to view real-time analysis and invest.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StockPrediction;
