import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import analyticsService from '../features/analytics/analyticsService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#ec4899', '#eab308']; // Blue (Meta), Pink (TikTok), Yellow (Other)

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await analyticsService.getPlatformStats();
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const formatCurrency = (val) => `$${val}`;

  return (
    <div className="flex min-h-screen bg-dark-bg text-white">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-slate-400 text-sm">Deep dive into your ad performance by platform.</p>
        </header>

        {loading ? (
             <div className="h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
             </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. PIE CHART: Spend Distribution */}
                <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-lg font-bold mb-4">Ad Spend Distribution</h2>
                    <div className="h-[300px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data?.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="totalSpend"
                                    nameKey="_id"
                                >
                                    {data?.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} 
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. BAR CHART: Daily Comparison */}
                <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-lg font-bold mb-4">Platform Spend (Daily)</h2>
                    <div className="h-[300px] w-full text-xs text-slate-400">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis 
                                    dataKey="date" 
                                    stroke="#94a3b8" 
                                    tickLine={false} 
                                    tickFormatter={(str) => {
                                        const d = new Date(str);
                                        return `${d.getMonth()+1}/${d.getDate()}`;
                                    }}
                                />
                                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={formatCurrency}/>
                                <Tooltip 
                                    cursor={{fill: '#334155', opacity: 0.2}}
                                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="META" name="Meta Ads" stackId="a" fill="#3b82f6" radius={[0,0,4,4]} />
                                <Bar dataKey="TIKTOK" name="TikTok Ads" stackId="a" fill="#ec4899" radius={[4,4,0,0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Summary Card */}
                <div className="col-span-1 lg:col-span-2 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-lg text-white">
                            <Loader2 size={24} className={loading ? "animate-spin" : ""} /> 
                            {/* Just an icon placeholder, using Loader2 as generic 'Process' icon */}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">Insight</h3>
                            <p className="text-slate-400 text-sm">
                                You are spending about <strong>70%</strong> of your budget on Meta Ads. 
                                Consider diversifying if your TikTok ROAS is higher.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        )}
      </main>
    </div>
  );
};

export default AnalyticsPage;