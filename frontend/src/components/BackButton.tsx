import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const BackButton: React.FC = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors mb-6 group"
        >
            <div className="p-1.5 bg-slate-800 rounded-lg group-hover:bg-primary-500/20 transition-colors">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Previous</span>
        </button>
    );
};

export default BackButton;
