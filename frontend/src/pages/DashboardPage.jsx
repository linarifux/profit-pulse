import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import MetricCard from '../components/dashboard/MetricCard';
import dashboardService from '../features/dashboard/dashboardService';
import { DollarSign, ShoppingBag, CreditCard, Activity, RefreshCw, Facebook, Video, Globe, TrendingUp, Zap, Target, QrCode, Smartphone, Apple, Menu } from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, BarChart 
} from 'recharts';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('daily');
  
  // 1. Add State for Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchStats = async () => {
    if (!user) return; 
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats(timeframe);
      setStats(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
          navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [timeframe, user]);

  if (!user) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // ... (Keep existing Helper Components: ChannelIcon, CustomYAxisTick, Tooltips, SummaryRow) ...
  // [For brevity, assuming these helper components are unchanged from previous code]
  const ChannelIcon = ({ name }) => { const n = name.toUpperCase(); if (n === 'META' || n === 'FACEBOOK') return <div className="p-1.5 bg-blue-600 rounded-md"><Facebook size={16} className="text-white"/></div>; if (n === 'TIKTOK') return <div className="p-1.5 bg-pink-600 rounded-md"><Video size={16} className="text-white"/></div>; if (n === 'GOOGLE') return <div className="p-1.5 bg-yellow-500 rounded-md"><Globe size={16} className="text-white"/></div>; return <div className="p-1.5 bg-slate-600 rounded-md"><Globe size={16} className="text-white"/></div>; };
  const CustomYAxisTick = ({ x, y, payload }) => ( <g transform={`translate(${x},${y})`}> <foreignObject x={-40} y={-15} width={30} height={30}> <div className="flex justify-end items-center h-full w-full"> <ChannelIcon name={payload.value} /> </div> </foreignObject> </g> );
  const CustomTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { const revenue = payload.find(p => p.dataKey === "revenue")?.value || 0; const profit = payload.find(p => p.dataKey === "netProfit")?.value || 0; const margin = payload.find(p => p.dataKey === "margin")?.value || 0; return ( <div className="bg-slate-800 border border-slate-700 p-3 md:p-4 rounded-lg shadow-xl text-xs md:text-sm min-w-[150px] md:min-w-[200px] z-50"> <p className="text-slate-400 mb-2 border-b border-slate-700 pb-2">{label}</p> <div className="space-y-1"> <div className="flex justify-between gap-2"><span className="text-emerald-400">Rev:</span> <span className="font-bold text-white">{formatCurrency(revenue)}</span></div> <div className="flex justify-between gap-2"><span className="text-yellow-400">Profit:</span> <span className="font-bold text-white">{formatCurrency(profit)}</span></div> <div className="flex justify-between gap-2"><span className="text-orange-400">Margin:</span> <span className="font-bold text-white">{margin}%</span></div> </div> </div> ); } return null; };
  const OrderTooltip = ({ active, payload, label }) => { if (active && payload && payload.length) { return ( <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-xs md:text-sm z-50"> <p className="text-slate-400 mb-2 border-b border-slate-700 pb-1">{label}</p> <div className="space-y-1"> <div className="flex justify-between gap-4"><span className="text-slate-300">Orders:</span> <span className="font-bold text-white">{payload[0].value}</span></div> <div className="flex justify-between gap-4"><span className="text-orange-400">Ad Spend/Order:</span> <span className="font-bold text-white">{formatCurrency(payload[1].value)}</span></div> </div> </div> ); } return null; };
  const SummaryRow = ({ label, value, color = "text-white" }) => ( <div className="flex justify-between items-center py-2 md:py-3 border-b border-slate-700/50 last:border-0"> <span className="text-slate-400 font-medium text-xs md:text-sm">{label}</span> <span className={`font-bold text-sm md:text-base ${color}`}>{value}</span> </div> );

  return (
    <div className="flex min-h-screen bg-dark-bg text-white relative">
      
      {/* 2. Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* 3. Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:block
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      <main className="flex-1 w-full p-4 md:p-8 space-y-6 overflow-x-hidden">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
             <div className="flex items-center gap-3">
                {/* 4. Toggle Button */}
                <button 
                    onClick={() => setSidebarOpen(true)}
                    className="md:hidden p-2 bg-slate-800 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
                >
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold">Dashboard</h1>
                    <p className="text-slate-400 text-xs md:text-sm">Real-time financial overview.</p>
                </div>
            </div>
            
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
             <div className="bg-card-bg rounded-lg border border-slate-700 p-1 flex flex-1 md:flex-none">
                {['daily', 'weekly', 'monthly'].map((t) => (
                    <button 
                        key={t} 
                        onClick={() => setTimeframe(t)} 
                        className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors ${timeframe === t ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        {t}
                    </button>
                ))}
             </div>
             <button onClick={fetchStats} className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
             </button>
          </div>
        </header>

        {/* ... (Keep existing dashboard content cards below) ... */}
        {!loading && stats && (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <MetricCard title="Total Revenue" value={formatCurrency(stats.cards.totalRevenue)} change={0} isPositive={true} icon={DollarSign} />
                    <MetricCard title="Total Ad Spend" value={formatCurrency(stats.cards.totalAdSpend)} change={0} isPositive={false} icon={CreditCard} />
                    <MetricCard title="Net Profit" value={formatCurrency(stats.cards.netProfit)} change={stats.cards.profitMargin} isPositive={stats.cards.netProfit > 0} icon={Activity} />
                    <MetricCard title="Total Orders" value={stats.cards.totalOrders} change={0} isPositive={true} icon={ShoppingBag} />
                </div>

                {/* Performance Chart */}
                <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-base md:text-lg font-bold mb-4 md:mb-6">Performance Overview</h2>
                    <div className="h-[300px] md:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={stats.graphData} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} tick={{fontSize: 12}} tickFormatter={(str) => str.substring(5)} />
                                <YAxis yAxisId="left" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `${val}%`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                                <ReferenceLine y={0} yAxisId="left" stroke="#475569" />
                                <Bar yAxisId="left" dataKey="revenue" barSize={12} md:barSize={20} fill="#34d399" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey={(data) => -data.totalCosts} name="totalCosts" barSize={12} md:barSize={20} fill="#3b82f6" radius={[0, 0, 4, 4]} opacity={0.8} />
                                <Line yAxisId="left" type="monotone" dataKey="netProfit" stroke="#facc15" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#fb923c" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-base md:text-lg font-bold mb-6">Cost Breakdown</h2>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12">
                        <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.costBreakdown} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                                        {stats.costBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-slate-400 text-xs md:text-sm font-medium">Total Costs</span>
                                <span className="text-lg md:text-2xl font-bold text-white tracking-tight">{formatCurrency(stats.totalCosts)}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 md:gap-x-12 md:gap-y-6 w-full max-w-2xl">
                            {stats.costBreakdown.map((item) => (
                                <div key={item.name} className="flex items-start gap-3">
                                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-md mt-1 shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between md:block">
                                            <p className="text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-wider mb-0 md:mb-1">{item.name}</p>
                                            <p className="text-white font-bold text-sm md:text-lg">{formatCurrency(item.value)}</p>
                                        </div>
                                        <p className="text-slate-500 text-[10px] md:text-xs text-right md:text-left">{((item.value / stats.totalCosts) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ad Spend & Orders vs Spend */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                             <h2 className="text-base md:text-lg font-bold">Ad Spend by Channel</h2>
                             <div className="flex items-center gap-2 text-xs">
                                 <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Total Ad Spend</span>
                             </div>
                        </div>
                        <div className="h-[200px] md:h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={stats.channelData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" tick={<CustomYAxisTick />} width={10} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', fontSize: '12px' }} formatter={(val) => formatCurrency(val)}/>
                                    <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                        <h2 className="text-base md:text-lg font-bold mb-6">Ad Spend Summary</h2>
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                                <span className="text-slate-400 font-medium text-sm">Total Ad Spend</span>
                                <div className="text-right"><div className="text-lg md:text-xl font-bold text-white">{formatCurrency(stats.adMetrics.totalAdSpend)}</div></div>
                            </div>
                            <div className="flex justify-between items-center pb-3 border-b border-slate-700/50">
                                <div className="flex items-center gap-2"><span className="text-slate-400 font-medium text-sm">POAS</span></div>
                                <div className="text-right"><div className="text-lg md:text-xl font-bold text-emerald-400">{stats.adMetrics.poas}</div></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="text-slate-400 font-medium text-sm">Blended ROAS</span></div>
                                <div className="text-right"><div className="text-lg md:text-xl font-bold text-blue-400">{stats.adMetrics.blendedROAS}</div></div>
                            </div>
                            <div className="mt-2 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg flex gap-3 items-start">
                                <Zap className="text-blue-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-[10px] md:text-xs text-blue-200 leading-relaxed">Don't miss out on your best converting channels!</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                            <h2 className="text-base md:text-lg font-bold">Orders vs Ad Spend</h2>
                            <div className="flex flex-wrap gap-4 text-[10px] md:text-xs font-medium">
                                <div className="flex items-center gap-1.5 text-slate-400"><div className="w-2 h-2 md:w-3 md:h-3 bg-slate-600 rounded-sm"></div> Orders</div>
                                <div className="flex items-center gap-1.5 text-orange-500"><div className="w-2 h-0.5 md:w-3 md:h-0.5 bg-orange-500"></div> Ad Spend/Order</div>
                            </div>
                        </div>
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={stats.graphData} margin={{ top: 20, right: 0, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} tick={{fontSize: 12}} tickFormatter={(str) => str.substring(5)} />
                                    <YAxis yAxisId="left" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} tick={{fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip content={<OrderTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                                    <Bar yAxisId="left" dataKey="orders" barSize={12} md:barSize={30} fill="#475569" radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="adSpendPerOrder" stroke="#f97316" strokeWidth={3} dot={false} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                        <h2 className="text-base md:text-lg font-bold mb-6">Order Summary</h2>
                        <div className="space-y-1">
                            <SummaryRow label="Avg. Order Value" value={formatCurrency(stats.orderMetrics.avgOrderValue)} />
                            <SummaryRow label="Ad Spend Per Order" value={formatCurrency(stats.orderMetrics.adSpendPerOrder)} />
                            <SummaryRow label="Avg. Order Profit" value={formatCurrency(stats.orderMetrics.avgOrderProfit)} color={stats.orderMetrics.avgOrderProfit >= 0 ? "text-emerald-400" : "text-red-400"} />
                            <SummaryRow label="Avg. Order Cost" value={formatCurrency(stats.orderMetrics.avgOrderCost)} />
                            <SummaryRow label="Purchase Frequency" value={stats.orderMetrics.purchaseFrequency} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-base md:text-lg font-bold">Customer Summary</h2>
                             <button className="text-xs text-blue-400 hover:text-blue-300">View report</button>
                        </div>
                        <div className="space-y-1">
                            <SummaryRow label="Total Customers" value={stats.customerSummary.totalCustomers} />
                            <SummaryRow label="New Customers" value={stats.customerSummary.newCustomers} />
                            <SummaryRow label="Repurchase Rate" value={`${stats.customerSummary.repurchaseRate}%`} />
                            <SummaryRow label="CAC" value={formatCurrency(stats.customerSummary.cac)} color="text-emerald-400" />
                        </div>
                    </div>

                    <div className="bg-card-bg p-4 md:p-6 rounded-xl border border-slate-700/50">
                        <h2 className="text-base md:text-lg font-bold mb-6">Others</h2>
                        <div className="space-y-1">
                            <SummaryRow label="Shipping Charged" value={formatCurrency(stats.others.shippingCharged)} />
                            <SummaryRow label="Taxes Collected" value={formatCurrency(stats.others.taxesCollected)} />
                            <SummaryRow label="Tips" value={formatCurrency(stats.others.tips)} />
                            <SummaryRow label="Gift Card Sales" value={formatCurrency(stats.others.giftCardSales)} />
                            <SummaryRow label="Returns" value={formatCurrency(stats.others.returns)} />
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 md:p-8 rounded-xl border border-slate-700/50 flex flex-col items-center text-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <p className="text-xs md:text-sm font-medium text-slate-300 mb-6">Scan to install the ProfitPulse mobile app for real-time insights on the go.</p>
                        <div className="bg-white p-2 rounded-xl mb-6 shadow-lg shadow-white/5">
                            <QrCode size={100} className="text-slate-900 md:w-[120px] md:h-[120px]" />
                        </div>
                        <div className="flex gap-2 w-full">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg border border-slate-700 transition-colors text-[10px] md:text-xs font-medium"><Smartphone size={14} /> Android</button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg border border-slate-700 transition-colors text-[10px] md:text-xs font-medium"><Apple size={14} /> iOS</button>
                        </div>
                    </div>
                </div>
            </>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;