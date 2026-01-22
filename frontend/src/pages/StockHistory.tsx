import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import BackButton from '../components/BackButton';
import { TrendingUp, TrendingDown, Minus, Briefcase } from 'lucide-react';

interface StockHistory {
    id: string;
    stockName: string;
    symbol: string;
    priceAtInvestment: number;
    amount: number;
    prediction: string;
    timestamp: string;
}

const StockHistoryItems: React.FC = () => {
    const [history, setHistory] = useState<StockHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/stocks/history');
            if (response.data.success) {
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPredictionIcon = (prediction: string) => {
        switch (prediction) {
            case 'Up':
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'Down':
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            default:
                return <Minus className="w-4 h-4 text-yellow-500" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BackButton />

            <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                    <Briefcase className="w-8 h-8 mr-3 text-primary-500" />
                    Stock History
                </h1>
                <p className="text-slate-400">Your past stock investments and performance</p>
            </div>

            {history.length === 0 ? (
                <div className="card text-center py-20 border-dashed border-2">
                    <TrendingUp className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-400">No History Found</h2>
                </div>
            ) : (
                <div className="card overflow-hidden animate-slide-up p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/50">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock</th>
                                    <th className="text-center py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Symbol</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Investment</th>
                                    <th className="text-center py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Prediction</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {history.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {formatDate(item.timestamp)}
                                        </td>
                                        <td className="py-4 px-6 font-semibold text-white">
                                            {item.stockName}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">
                                                {item.symbol}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-primary-400">
                                            {formatCurrency(item.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <div className="flex items-center justify-center space-x-1">
                                                {getPredictionIcon(item.prediction)}
                                                <span className="text-xs">{item.prediction}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StockHistoryItems;
