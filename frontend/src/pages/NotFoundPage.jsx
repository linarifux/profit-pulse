import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        
        {/* Visual Icon with Glow Effect */}
        <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
            <div className="relative flex justify-center">
                <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 shadow-2xl">
                    <AlertTriangle size={64} className="text-blue-500" />
                </div>
            </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
            <h1 className="text-6xl font-bold text-white tracking-tight">404</h1>
            <h2 className="text-2xl font-semibold text-slate-200">Page Not Found</h2>
            <p className="text-slate-400 leading-relaxed">
                Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
            </p>
        </div>

        {/* Primary Action */}
        <div>
            <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
                <Home size={20} />
                Back to Dashboard
            </Link>
        </div>

        {/* Secondary Link */}
        <div className="text-sm pt-4">
            <Link to="/login" className="text-slate-500 hover:text-slate-400 transition-colors">
                Return to Login screen
            </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFoundPage;