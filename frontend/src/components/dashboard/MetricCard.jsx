import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ title, value, change, isPositive, icon: Icon }) => {
  return (
    <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50 shadow-sm hover:border-slate-600 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-700/30 rounded-lg text-slate-300">
          <Icon size={22} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
          isPositive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
        }`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}%
        </div>
      </div>
      
      <div>
        <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default MetricCard;