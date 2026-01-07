import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion'; // Animation library
import toast from 'react-hot-toast'; // Toast library
import Sidebar from '../components/layout/Sidebar';
import MetricCard from '../components/dashboard/MetricCard';
import dashboardService from '../features/dashboard/dashboardService';
import { 
  DollarSign, ShoppingBag, CreditCard, Activity, RefreshCw, Facebook, 
  Video, Globe, Zap, Menu, Smartphone, Apple, Calendar, ArrowUpRight,
  QrCode
} from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, BarChart 
} from 'recharts';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('daily');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  // --- Auth & Initial Logic ---
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchStats = async (isRefresh = false) => {
    if (!user) return;
    
    if (isRefresh) setRefreshing(true);
    
    try {
      // If it's a manual refresh, show a promise toast
      if (isRefresh) {
        const promise = dashboardService.getDashboardStats(timeframe);
        toast.promise(promise, {
          loading: 'Syncing latest data...',
          success: 'Dashboard updated!',
          error: 'Could not sync data.'
        }, {
           style: { background: '#1e293b', color: '#fff', border: '1px solid #334155' }
        });
        const response = await promise;
        setStats(response.data);
      } else {
        // Initial load
        setLoading(true);
        const response = await dashboardService.getDashboardStats(timeframe);
        setStats(response.data);
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        toast.error("Session expired. Please login again.", { id: 'session-expired' });
        navigate('/login');
      } else if (!isRefresh) {
        toast.error("Failed to load dashboard data.", { id: 'fetch-error' });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [timeframe, user]);

  if (!user) return null;

  // --- Helpers ---
  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // --- Custom Components ---
  const SummaryRow = ({ label, value, color = "text-white" }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0 group cursor-default">
      <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">{label}</span>
      <span className={`font-bold text-sm md:text-base ${color}`}>{value}</span>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-700 p-4 rounded-xl shadow-2xl text-xs md:text-sm min-w-[180px]">
          <p className="text-slate-400 mb-3 pb-2 border-b border-slate-700 font-medium">{label}</p>
          <div className="space-y-2">
            {payload.map((entry, index) => (
              <div key={index} className="flex justify-between items-center gap-4">
                 <span style={{ color: entry.fill || entry.stroke }} className="capitalize">{entry.name}:</span>
                 <span className="font-bold text-white">
                   {entry.name === 'margin' ? `${entry.value}%` : formatCurrency(entry.value)}
                 </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen bg-[#0b1120] text-white relative font-sans selection:bg-blue-500/30">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop Sticky */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile Slide-out */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-out md:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Main Content */}
      <main className="flex-1 w-full p-4 md:p-8 space-y-8 overflow-x-hidden">
        
        {/* HEADER SECTION */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center gap-4"
        >
             <div className="flex items-center gap-4">
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 bg-slate-800/50 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors border border-slate-700"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                      {getGreeting()}, {user?.fullName?.split(' ')[0] || 'User'}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                       System operational • Real-time data
                    </p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 bg-slate-900/50 p-1.5 rounded-xl border border-slate-800/50 backdrop-blur-sm">
             <div className="flex">
                {['daily', 'weekly', 'monthly'].map((t) => (
                    <button 
                        key={t} 
                        onClick={() => setTimeframe(t)} 
                        className={`relative px-4 py-2 text-xs font-semibold rounded-lg capitalize transition-all duration-300 z-10 ${
                          timeframe === t ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {timeframe === t && (
                          <motion.div 
                            layoutId="activeTimeframe"
                            className="absolute inset-0 bg-blue-600 rounded-lg -z-10 shadow-lg shadow-blue-500/25"
                          />
                        )}
                        {t}
                    </button>
                ))}
             </div>
             <div className="w-px h-6 bg-slate-700 mx-1"></div>
             <button 
               onClick={() => fetchStats(true)} 
               disabled={refreshing}
               className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-95"
             >
                <RefreshCw size={18} className={refreshing ? "animate-spin text-blue-400" : ""} />
             </button>
          </div>
        </motion.header>

        {!loading && stats ? (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
                {/* 1. METRIC CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <MetricCard title="Total Revenue" value={formatCurrency(stats.cards.totalRevenue)} change={12.5} isPositive={true} icon={DollarSign} />
                    <MetricCard title="Total Ad Spend" value={formatCurrency(stats.cards.totalAdSpend)} change={2.3} isPositive={false} icon={CreditCard} />
                    <MetricCard title="Net Profit" value={formatCurrency(stats.cards.netProfit)} change={stats.cards.profitMargin} isPositive={stats.cards.netProfit > 0} icon={Activity} />
                    <MetricCard title="Total Orders" value={stats.cards.totalOrders} change={5.1} isPositive={true} icon={ShoppingBag} />
                </div>

                {/* 2. MAIN CHART SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Revenue Graph */}
                  <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h2 className="text-lg font-bold text-white">Performance Overview</h2>
                          <p className="text-xs text-slate-400">Revenue vs Costs vs Net Profit</p>
                        </div>
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors border border-slate-700">View Report</button>
                      </div>
                      <div className="h-[350px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                              <ComposedChart data={stats.graphData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                                  <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                  <XAxis dataKey="date" stroke="#64748b" tickLine={false} axisLine={false} dy={10} tick={{fontSize: 12}} tickFormatter={(str) => str.substring(5)} />
                                  <YAxis yAxisId="left" stroke="#64748b" tickLine={false} axisLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" tickLine={false} axisLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `${val}%`} />
                                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.1 }} />
                                  <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="url(#colorRevenue)" radius={[4, 4, 0, 0]} />
                                  <Line yAxisId="left" type="monotone" dataKey="netProfit" stroke="#facc15" strokeWidth={3} dot={{r: 4, fill: '#1e293b', strokeWidth: 2}} activeDot={{r: 6}} />
                                  <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#f97316" strokeWidth={2} strokeDasharray="4 4" dot={false} />
                              </ComposedChart>
                          </ResponsiveContainer>
                      </div>
                  </motion.div>

                  {/* Profit Circle */}
                  <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
                      <h2 className="text-lg font-bold text-white mb-2">Cost Breakdown</h2>
                      <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                  <Pie 
                                    data={stats.costBreakdown} 
                                    cx="50%" cy="50%" 
                                    innerRadius={70} 
                                    outerRadius={90} 
                                    paddingAngle={5} 
                                    dataKey="value" 
                                    stroke="none"
                                  >
                                      {stats.costBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                  </Pie>
                                  <Tooltip />
                              </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                              <span className="text-slate-400 text-xs font-medium">Total Costs</span>
                              <span className="text-2xl font-bold text-white tracking-tight">{formatCurrency(stats.totalCosts)}</span>
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                           {stats.costBreakdown.map((item) => (
                              <div key={item.name} className="flex items-center gap-2 text-xs">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                                <span className="text-slate-300">{item.name}</span>
                              </div>
                           ))}
                      </div>
                  </motion.div>
                </div>

                {/* 3. LOWER GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Channel Bar Chart */}
                     <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-lg font-bold">Ad Spend by Channel</h2>
                             <div className="px-2 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-md border border-orange-500/20">
                                Live Data
                             </div>
                        </div>
                        <div className="h-[220px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={stats.channelData} margin={{ top: 0, right: 20, left: 20, bottom: 0 }} barSize={24}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                                    <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px' }} formatter={(val) => formatCurrency(val)}/>
                                    <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]}>
                                      {stats.channelData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.name === 'Meta' ? '#3b82f6' : entry.name === 'TikTok' ? '#ec4899' : '#f97316'} />
                                      ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Summary List */}
                    <motion.div variants={itemVariants} className="bg-slate-900/40 backdrop-blur-sm p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-center">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                           <Zap size={18} className="text-yellow-400" /> Key Insights
                        </h2>
                        <div className="space-y-1">
                            <SummaryRow label="Total Ad Spend" value={formatCurrency(stats.adMetrics.totalAdSpend)} />
                            <SummaryRow label="POAS" value={stats.adMetrics.poas} color="text-emerald-400" />
                            <SummaryRow label="Blended ROAS" value={stats.adMetrics.blendedROAS} color="text-blue-400" />
                            <SummaryRow label="CAC" value={formatCurrency(stats.customerSummary.cac)} />
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="mt-6 w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-medium shadow-lg shadow-blue-500/20 text-sm flex items-center justify-center gap-2 transition-all"
                        >
                           Detailed Analytics <ArrowUpRight size={16} />
                        </motion.button>
                    </motion.div>
                </div>

                {/* 4. PROMO BANNER */}
                <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 border border-white/10 shadow-2xl">
                     <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                     <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                     
                     <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                           <h3 className="text-2xl font-bold text-white mb-2">ProfitPulse Mobile</h3>
                           <p className="text-purple-200 max-w-md">Access your real-time data anywhere. Download our new mobile app for iOS and Android.</p>
                           <div className="flex gap-3 mt-6 justify-center md:justify-start">
                              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/10 transition-colors text-sm font-medium">
                                <Apple size={16} /> App Store
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg border border-white/10 transition-colors text-sm font-medium">
                                <Smartphone size={16} /> Play Store
                              </button>
                           </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                             <QrCode size={120} className="text-slate-900" />
                        </div>
                     </div>
                </motion.div>
            </motion.div>
        ) : (
            // Loading Skeleton
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-32 bg-slate-800/50 rounded-2xl border border-slate-800"></div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;