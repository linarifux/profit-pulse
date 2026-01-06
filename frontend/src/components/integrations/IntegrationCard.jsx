import React, { useState } from 'react';
import { Check, Loader2, Plus, ExternalLink } from 'lucide-react';

const IntegrationCard = ({ name, description, icon: Icon, color, isConnected, onConnect }) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = () => {
    if (isConnected) return;
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
        setLoading(false);
        onConnect();
    }, 2000);
  };

  return (
    <div className="bg-card-bg border border-slate-700/50 rounded-xl p-6 relative overflow-hidden group hover:border-slate-600 transition-all duration-300">
      {/* Background Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100`}></div>

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-lg`}>
           {/* If it's a component (Lucide), render it, otherwise it's an image/text */}
           <Icon size={24} className={`text-${color}-500`} />
        </div>
        
        {isConnected ? (
             <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20">
                <Check size={12} />
                Connected
             </div>
        ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-400 text-xs font-medium rounded-full border border-slate-600">
                Not Connected
            </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-lg font-bold text-white mb-2">{name}</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed h-10 line-clamp-2">
            {description}
        </p>

        <button 
            onClick={handleConnect}
            disabled={isConnected || loading}
            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 
                ${isConnected 
                    ? 'bg-slate-800 text-slate-400 cursor-default border border-slate-700' 
                    : 'bg-white text-slate-900 hover:bg-slate-200 shadow-lg shadow-white/5'
                }
            `}
        >
            {loading ? (
                <>
                    <Loader2 size={16} className="animate-spin" />
                    Connecting...
                </>
            ) : isConnected ? (
                <>
                    Manage Connection
                    <ExternalLink size={16} />
                </>
            ) : (
                <>
                    Connect {name}
                    <Plus size={16} />
                </>
            )}
        </button>
      </div>
    </div>
  );
};

export default IntegrationCard;