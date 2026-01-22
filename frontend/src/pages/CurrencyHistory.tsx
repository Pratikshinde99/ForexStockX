import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/helpers';
import BackButton from '../components/BackButton';
import { ArrowLeftRight, FileText } from 'lucide-react';

interface CurrencyHistory {
    id: string;
    inrAmount: number;
    targetCurrency: string;
    exchangeRate: number;
    foreignAmount: number;
    remainingBalance: number;
    timestamp: string;
}

const CurrencyHistoryItems: React.FC = () => {
    const [history, setHistory] = useState<CurrencyHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/api/currency/history');
            if (response.data.success) {
                setHistory(response.data.history);
            }
        } catch (error) {
            console.error('Failed to fetch history:', error);
        } finally {
            setLoading(false);
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
                    <FileText className="w-8 h-8 mr-3 text-primary-500" />
                    Currency History
                </h1>
                <p className="text-slate-400">Records of your international currency exchanges</p>
            </div>

            {history.length === 0 ? (
                <div className="card text-center py-20 border-dashed border-2">
                    <ArrowLeftRight className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-slate-400">No History Found</h2>
                </div>
            ) : (
                <div className="card overflow-hidden animate-slide-up p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700 bg-slate-800/50">
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">INR Spent</th>
                                    <th className="text-center py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Target</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Foreign Received</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Rate</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {history.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="py-4 px-6 text-sm text-slate-300">
                                            {formatDate(item.timestamp)}
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-red-400">
                                            -{formatCurrency(item.inrAmount)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded text-xs font-bold">
                                                {item.targetCurrency}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-green-400">
                                            {formatCurrency(item.foreignAmount, item.targetCurrency)}
                                        </td>
                                        <td className="py-4 px-6 text-right text-xs text-slate-500">
                                            ₹{item.exchangeRate.toFixed(2)}
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

export default CurrencyHistoryItems;
