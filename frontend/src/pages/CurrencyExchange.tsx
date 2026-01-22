import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';
import BackButton from '../components/BackButton';
import {
    IndianRupee,
    ArrowRightLeft,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Info,
    History as HistoryIcon,
    Loader2
} from 'lucide-react';

const CurrencyExchange: React.FC = () => {
    const { user, refreshUser } = useAuth();
    const navigate = useNavigate();

    const [rates, setRates] = useState<any>({});
    const [inrAmount, setInrAmount] = useState<string>('');
    const [targetCurrency, setTargetCurrency] = useState<string>('USD');
    const [loading, setLoading] = useState(false);
    const [ratesLoading, setRatesLoading] = useState(true);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    useEffect(() => {
        fetchRates();
        const interval = setInterval(fetchRates, 30000); // Live Rates update every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchRates = async () => {
        try {
            const response = await api.get('/api/currency/rates');
            if (response.data.success) {
                setRates(response.data.rates);
            }
        } catch (error) {
            console.error('Failed to fetch rates:', error);
        } finally {
            setRatesLoading(false);
        }
    };

    const handleExchange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inrAmount || parseFloat(inrAmount) <= 0) return;

        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const response = await api.post('/api/currency/exchange', {
                inrAmount: parseFloat(inrAmount),
                targetCurrency,
            });

            if (response.data.success) {
                setStatus({
                    type: 'success',
                    message: `Exchange Successful! ${formatCurrency(parseFloat(inrAmount))} has been converted to ${targetCurrency}.`
                });
                setInrAmount('');
                await refreshUser(); // Global state update

                // auto hide success after 5s
                setTimeout(() => setStatus({ type: null, message: '' }), 5000);
            }
        } catch (error: any) {
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Transaction failed. Please check your balance.'
            });
        } finally {
            setLoading(false);
        }
    };

    const exchangeRate = rates[targetCurrency] || 0;
    const foreignAmount = inrAmount ? parseFloat(inrAmount) / exchangeRate : 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <BackButton />

            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white">Currency Exchange</h1>
                    <p className="text-slate-400 mt-1">Convert your INR to global currencies instantly</p>
                </div>
                <button
                    onClick={() => navigate('/history/currency')}
                    className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-bold text-xs uppercase tracking-widest mt-4 md:mt-0"
                >
                    <HistoryIcon className="w-4 h-4" />
                    <span>View History</span>
                </button>
            </div>

            {/* Success/Error Alerts */}
            {status.type && (
                <div className={`mb-6 p-4 rounded-xl border flex items-start space-x-3 animate-fade-in ${status.type === 'success' ? 'bg-green-500/10 border-green-500/50 text-green-500' : 'bg-red-500/10 border-red-500/50 text-red-500'
                    }`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5 mt-0.5" /> : <AlertCircle className="w-5 h-5 mt-0.5" />}
                    <p className="font-medium">{status.message}</p>
                </div>
            )}

            <div className="grid md:grid-cols-5 gap-8">
                {/* Exchange Form */}
                <div className="md:col-span-3">
                    <div className="card p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <ArrowRightLeft className="w-24 h-24 text-white" />
                        </div>

                        <form onSubmit={handleExchange} className="space-y-8 relative z-10">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">You Send (INR)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <IndianRupee className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <input
                                        type="number"
                                        value={inrAmount}
                                        onChange={(e) => setInrAmount(e.target.value)}
                                        className="w-full bg-slate-800/50 border-2 border-slate-700 rounded-2xl py-5 pl-14 pr-6 text-2xl font-bold text-white focus:border-primary-500 transition-all outline-none"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-slate-500 mt-3 font-medium">
                                    Current Balance: <span className="text-white font-bold">{formatCurrency(user?.wallet?.inrBalance || 0)}</span>
                                </p>
                            </div>

                            <div className="flex justify-center -my-4 relative z-20">
                                <div className="bg-slate-900 p-3 rounded-full border-4 border-slate-950 shadow-xl">
                                    <ArrowRightLeft className="w-6 h-6 text-primary-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">You Receive</label>
                                <div className="flex space-x-4">
                                    <select
                                        value={targetCurrency}
                                        onChange={(e) => setTargetCurrency(e.target.value)}
                                        className="bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-5 text-xl font-bold text-white focus:border-primary-500 transition-all outline-none appearance-none cursor-pointer"
                                    >
                                        {Object.keys(rates).map(curr => (
                                            <option key={curr} value={curr}>{curr}</option>
                                        ))}
                                    </select>
                                    <div className="flex-1 bg-slate-900/50 border-2 border-slate-800 rounded-2xl py-5 px-6 flex items-center">
                                        <span className="text-2xl font-bold text-slate-500">
                                            {foreignAmount.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !inrAmount}
                                className="w-full btn-primary py-5 rounded-2xl text-lg font-bold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Processing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Exchange</span>
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="card p-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
                            <Info className="w-4 h-4 mr-2 text-primary-500" />
                            Live Market Rate
                        </h3>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-bold uppercase">1 {targetCurrency} =</p>
                                <p className="text-3xl font-bold text-white mt-1">₹{exchangeRate.toFixed(2)}</p>
                            </div>
                            <div className="text-right">
                                <span className={`text-xs font-bold px-2 py-1 rounded ${ratesLoading ? 'bg-slate-800 text-slate-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {ratesLoading ? 'FETCHING...' : 'LIVE'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="card p-6 rounded-2xl border-dashed border-2 border-slate-800 text-slate-500">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3">Trading Tip</h4>
                        <p className="text-sm italic leading-relaxed">
                            "Exchanging larger volumes can sometimes be better for portfolio hedging. Watch for {targetCurrency} dips before converting large sums of INR."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CurrencyExchange;
