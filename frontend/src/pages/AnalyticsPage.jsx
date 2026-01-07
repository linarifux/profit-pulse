import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import analyticsService from '../features/analytics/analyticsService';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2, Menu, BarChart as BarChartIcon } from 'lucide-react'; 

const COLORS = ['#3b82f6', '#ec4899', '#eab308']; // Blue (Meta), Pink (TikTok), Yellow (Other)

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Protect Route
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await analyticsService.getPlatformStats();
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user]);

  if (!user) return null;

  const formatCurrency = (val) => `$${val}`;

  return (
    <div className="flex min-h-screen bg-dark-bg text-white relative">
      
      {/* 1. Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* 2. Desktop Fixed Sidebar (Visible md+) */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* 3. Mobile Slide-out Sidebar (Visible < md) */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* 4. Main Content */}
      {/* md:ml-64 pushes content exactly 256px to the right to accommodate the fixed sidebar  */}
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8 space-y-6 overflow-x-hidden">
        
        {/* HEADER */}
        <header className="flex items-center gap-3 mb-6 md:mb-8">
            <button 
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
            >
                <Menu size={20} />
            </button>
            <div>
                <h1 className="text-xl md:text-2xl font-bold">Analytics</h1>
                <p className="text-slate-400 text-xs md:text-sm">Deep dive into your ad performance by platform.</p>
            </div>
        </header>

        {loading ? (
             <div className="h-64 md:h-96 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
             </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. PIE CHART: Spend Distribution */}
                <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-base md:text-lg font-bold mb-4">Ad Spend Distribution</h2>
                    <div className="h-[250px] md:h-[300px] flex items-center justify-center">
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
                <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-base md:text-lg font-bold mb-4">Platform Spend (Daily)</h2>
                    <div className="h-[250px] md:h-[300px] w-full text-xs text-slate-400">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                    <div className="flex items-start md:items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-lg text-white shrink-0">
                            <BarChartIcon size={24} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-white mb-1">Insight</h3>
                            <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
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