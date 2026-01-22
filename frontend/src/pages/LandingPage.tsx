import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, ArrowRight, IndianRupee, BarChart3 } from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-900/10 via-transparent to-primary-900/10"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center animate-fade-in">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
                            India's Trusted{' '}
                            <span className="gradient-text">Trade Platform</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto">
                            The simplest way to exchange currency and predict stock growth.
                            Secure, fast, and designed for every Indian trader.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/register" className="btn-primary text-lg px-8 py-4">
                                Get Started Free
                                <ArrowRight className="inline-block ml-2 w-5 h-5" />
                            </Link>
                            <Link to="/login" className="btn-outline text-lg px-8 py-4">
                                Sign In
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="card text-center animate-slide-up">
                        <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <IndianRupee className="w-8 h-8 text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Currency Exchange</h3>
                        <p className="text-slate-400">
                            Exchange INR to USD, EUR, and more with live rates and zero hidden fees.
                        </p>
                    </div>

                    <div className="card text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BarChart3 className="w-8 h-8 text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Stock Prediction</h3>
                        <p className="text-slate-400">
                            AI-powered insights to help you identify high-growth stocks in the Indian market.
                        </p>
                    </div>

                    <div className="card text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <div className="w-16 h-16 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-primary-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Safe & Secure</h3>
                        <p className="text-slate-400">
                            Your funds are protected with bank-grade encryption and 2FA support.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-slate-800/30 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold mb-2">₹1 Cr+</div>
                            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Trade Volume</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50,000+</div>
                            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">Active Users</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">99.9%</div>
                            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">Uptime</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="border-t border-slate-700 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-500">
                    <div className="flex items-center space-x-2 mb-4 md:mb-0">
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-bold text-white">ForexStockX</span>
                    </div>
                    <p className="text-sm">© 2026 ForexStockX India. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
