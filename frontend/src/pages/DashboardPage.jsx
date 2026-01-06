import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import MetricCard from '../components/dashboard/MetricCard';
import dashboardService from '../features/dashboard/dashboardService';
import { DollarSign, ShoppingBag, CreditCard, Activity, RefreshCw, Facebook, Video, Globe, TrendingUp, Zap, Target, QrCode, Smartphone, Apple } from 'lucide-react';
import { 
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, ReferenceLine, PieChart, Pie, Cell, BarChart 
} from 'recharts';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('daily');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getDashboardStats(timeframe);
      setStats(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeframe]);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Helper for Channel Icons
  const ChannelIcon = ({ name }) => {
      const n = name.toUpperCase();
      if (n === 'META' || n === 'FACEBOOK') return <div className="p-1.5 bg-blue-600 rounded-md"><Facebook size={16} className="text-white"/></div>;
      if (n === 'TIKTOK') return <div className="p-1.5 bg-pink-600 rounded-md"><Video size={16} className="text-white"/></div>;
      if (n === 'GOOGLE') return <div className="p-1.5 bg-yellow-500 rounded-md"><Globe size={16} className="text-white"/></div>;
      return <div className="p-1.5 bg-slate-600 rounded-md"><Globe size={16} className="text-white"/></div>;
  };

  const CustomYAxisTick = ({ x, y, payload }) => {
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject x={-40} y={-15} width={30} height={30}>
            <div className="flex justify-end items-center h-full w-full">
                <ChannelIcon name={payload.value} />
            </div>
        </foreignObject>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
     if (active && payload && payload.length) {
      const revenue = payload.find(p => p.dataKey === "revenue")?.value || 0;
      const profit = payload.find(p => p.dataKey === "netProfit")?.value || 0;
      const margin = payload.find(p => p.dataKey === "margin")?.value || 0;
      return (
        <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-xl text-sm min-w-[200px]">
          <p className="text-slate-400 mb-2 border-b border-slate-700 pb-2">{label}</p>
          <div className="space-y-1">
             <div className="flex justify-between"><span className="text-emerald-400">Revenue:</span> <span className="font-bold text-white">{formatCurrency(revenue)}</span></div>
             <div className="flex justify-between"><span className="text-yellow-400">Profit:</span> <span className="font-bold text-white">{formatCurrency(profit)}</span></div>
             <div className="flex justify-between"><span className="text-orange-400">Margin:</span> <span className="font-bold text-white">{margin}%</span></div>
          </div>
        </div>
      );
     }
     return null;
  };

  const OrderTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-sm">
                <p className="text-slate-400 mb-2 border-b border-slate-700 pb-1">{label}</p>
                <div className="space-y-1">
                    <div className="flex justify-between gap-4"><span className="text-slate-300">Orders:</span> <span className="font-bold text-white">{payload[0].value}</span></div>
                    <div className="flex justify-between gap-4"><span className="text-orange-400">Ad Spend/Order:</span> <span className="font-bold text-white">{formatCurrency(payload[1].value)}</span></div>
                </div>
            </div>
        );
    }
    return null;
  };

  const SummaryRow = ({ label, value, color = "text-white" }) => (
      <div className="flex justify-between items-center py-3 border-b border-slate-700/50 last:border-0">
          <span className="text-slate-400 font-medium text-sm">{label}</span>
          <span className={`font-bold ${color}`}>{value}</span>
      </div>
  );

  return (
    <div className="flex min-h-screen bg-dark-bg text-white">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8 space-y-6">
        {/* HEADER */}
        <header className="flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-slate-400 text-sm">Real-time financial overview.</p>
            </div>
            <div className="flex gap-3">
             <div className="bg-card-bg rounded-lg border border-slate-700 p-1 flex">
                {['daily', 'weekly', 'monthly'].map((t) => (
                    <button key={t} onClick={() => setTimeframe(t)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${timeframe === t ? 'bg-slate-700 text-white' : 'text-slate-400'}`}>{t}</button>
                ))}
             </div>
             <button onClick={fetchStats} className="bg-slate-800 p-2 rounded-lg text-slate-300"><RefreshCw size={18} className={loading ? "animate-spin" : ""} /></button>
          </div>
        </header>

        {!loading && stats && (
            <>
                {/* 1. METRIC CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard title="Total Revenue" value={formatCurrency(stats.cards.totalRevenue)} change={0} isPositive={true} icon={DollarSign} />
                    <MetricCard title="Total Ad Spend" value={formatCurrency(stats.cards.totalAdSpend)} change={0} isPositive={false} icon={CreditCard} />
                    <MetricCard title="Net Profit" value={formatCurrency(stats.cards.netProfit)} change={stats.cards.profitMargin} isPositive={stats.cards.netProfit > 0} icon={Activity} />
                    <MetricCard title="Total Orders" value={stats.cards.totalOrders} change={0} isPositive={true} icon={ShoppingBag} />
                </div>

                {/* 2. MAIN PERFORMANCE CHART */}
                <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-lg font-bold mb-6">Performance Overview</h2>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={stats.graphData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} tickFormatter={(str) => str.substring(5)} />
                                <YAxis yAxisId="left" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                                <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                                <ReferenceLine y={0} yAxisId="left" stroke="#475569" />
                                <Bar yAxisId="left" dataKey="revenue" barSize={20} fill="#34d399" radius={[4, 4, 0, 0]} />
                                <Bar yAxisId="left" dataKey={(data) => -data.totalCosts} name="totalCosts" barSize={20} fill="#3b82f6" radius={[0, 0, 4, 4]} opacity={0.8} />
                                <Line yAxisId="left" type="monotone" dataKey="netProfit" stroke="#facc15" strokeWidth={2} dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="margin" stroke="#fb923c" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. COST BREAKDOWN */}
                <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50">
                    <h2 className="text-lg font-bold mb-6">Cost Breakdown</h2>
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
                        <div className="relative w-64 h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={stats.costBreakdown} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">
                                        {stats.costBreakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-slate-400 text-sm font-medium">Total Costs</span>
                                <span className="text-2xl font-bold text-white tracking-tight">{formatCurrency(stats.totalCosts)}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                            {stats.costBreakdown.map((item) => (
                                <div key={item.name} className="flex items-start gap-3">
                                    <div className="w-4 h-4 rounded-md mt-1 shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">{item.name}</p>
                                        <p className="text-white font-bold text-lg">{formatCurrency(item.value)}</p>
                                        <p className="text-slate-500 text-xs">{((item.value / stats.totalCosts) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 4. AD SPEND BY CHANNEL + SUMMARY */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     <div className="lg:col-span-2 bg-card-bg p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-lg font-bold">Ad Spend by Channel</h2>
                             <div className="flex items-center gap-2 text-xs">
                                 <span className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> Total Ad Spend</span>
                             </div>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={stats.channelData} margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                                    <XAxis type="number" hide />
                                    <YAxis type="category" dataKey="name" tick={<CustomYAxisTick />} width={10} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} formatter={(val) => formatCurrency(val)}/>
                                    <Bar dataKey="value" fill="#f97316" radius={[0, 4, 4, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                        <h2 className="text-lg font-bold mb-6">Ad Spend Summary</h2>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                                <span className="text-slate-400 font-medium">Total Ad Spend</span>
                                <div className="text-right"><div className="text-xl font-bold text-white">{formatCurrency(stats.adMetrics.totalAdSpend)}</div></div>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-slate-700/50">
                                <div className="flex items-center gap-2"><span className="text-slate-400 font-medium">POAS</span></div>
                                <div className="text-right"><div className="text-xl font-bold text-emerald-400">{stats.adMetrics.poas}</div></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2"><span className="text-slate-400 font-medium">Blended ROAS</span></div>
                                <div className="text-right"><div className="text-xl font-bold text-blue-400">{stats.adMetrics.blendedROAS}</div></div>
                            </div>
                            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg flex gap-3 items-start">
                                <Zap className="text-blue-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-blue-200 leading-relaxed">Don't miss out on your best converting channels!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ORDERS VS AD SPEND PER ORDER */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-card-bg p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold">Orders vs Ad Spend Per Order</h2>
                            <div className="flex gap-4 text-xs font-medium">
                                <div className="flex items-center gap-1.5 text-slate-400"><div className="w-3 h-3 bg-slate-600 rounded-sm"></div> Orders</div>
                                <div className="flex items-center gap-1.5 text-orange-500"><div className="w-3 h-0.5 bg-orange-500"></div> Ad Spend Per Order</div>
                            </div>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={stats.graphData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="date" stroke="#94a3b8" tickLine={false} axisLine={false} dy={10} tickFormatter={(str) => str.substring(5)} />
                                    <YAxis yAxisId="left" stroke="#94a3b8" tickLine={false} axisLine={false} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                    <Tooltip content={<OrderTooltip />} cursor={{ fill: '#334155', opacity: 0.2 }} />
                                    <Bar yAxisId="left" dataKey="orders" barSize={30} fill="#475569" radius={[4, 4, 0, 0]} />
                                    <Line yAxisId="right" type="monotone" dataKey="adSpendPerOrder" stroke="#f97316" strokeWidth={3} dot={false} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50 flex flex-col justify-center">
                        <h2 className="text-lg font-bold mb-6">Order Summary</h2>
                        <div className="space-y-1">
                            <SummaryRow label="Avg. Order Value" value={formatCurrency(stats.orderMetrics.avgOrderValue)} />
                            <SummaryRow label="Ad Spend Per Order" value={formatCurrency(stats.orderMetrics.adSpendPerOrder)} />
                            <SummaryRow label="Avg. Order Profit" value={formatCurrency(stats.orderMetrics.avgOrderProfit)} color={stats.orderMetrics.avgOrderProfit >= 0 ? "text-emerald-400" : "text-red-400"} />
                            <SummaryRow label="Avg. Order Cost" value={formatCurrency(stats.orderMetrics.avgOrderCost)} />
                            <SummaryRow label="Purchase Frequency" value={stats.orderMetrics.purchaseFrequency} />
                        </div>
                    </div>
                </div>

                {/* 6. NEW: CUSTOMER SUMMARY, OTHERS & PROMO */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Customer Summary */}
                    <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50">
                        <div className="flex justify-between items-center mb-6">
                             <h2 className="text-lg font-bold">Customer Summary</h2>
                             <button className="text-xs text-blue-400 hover:text-blue-300">View full report</button>
                        </div>
                        <div className="space-y-1">
                            <SummaryRow label="Total Customers" value={stats.customerSummary.totalCustomers} />
                            <SummaryRow label="New Customers" value={stats.customerSummary.newCustomers} />
                            <SummaryRow label="Repurchase Rate" value={`${stats.customerSummary.repurchaseRate}%`} />
                            <SummaryRow label="CAC" value={formatCurrency(stats.customerSummary.cac)} color="text-emerald-400" />
                        </div>
                    </div>

                    {/* Others */}
                    <div className="bg-card-bg p-6 rounded-xl border border-slate-700/50">
                        <h2 className="text-lg font-bold mb-6">Others</h2>
                        <div className="space-y-1">
                            <SummaryRow label="Shipping Charged" value={formatCurrency(stats.others.shippingCharged)} />
                            <SummaryRow label="Taxes Collected" value={formatCurrency(stats.others.taxesCollected)} />
                            <SummaryRow label="Tips" value={formatCurrency(stats.others.tips)} />
                            <SummaryRow label="Gift Card Sales" value={formatCurrency(stats.others.giftCardSales)} />
                            <SummaryRow label="Returns" value={formatCurrency(stats.others.returns)} />
                        </div>
                    </div>

                    {/* Mobile App Promo */}
                    <div className="bg-slate-900 p-8 rounded-xl border border-slate-700/50 flex flex-col items-center text-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        
                        <p className="text-sm font-medium text-slate-300 mb-6">
                            Scan to install the ProfitPulse mobile app for real-time insights on the go.
                        </p>
                        
                        <div className="bg-white p-2 rounded-xl mb-6 shadow-lg shadow-white/5">
                            <QrCode size={120} className="text-slate-900" />
                        </div>

                        <div className="flex gap-2 w-full">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg border border-slate-700 transition-colors text-xs font-medium">
                                <Smartphone size={14} /> Android
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 py-2 rounded-lg border border-slate-700 transition-colors text-xs font-medium">
                                <Apple size={14} /> iOS
                            </button>
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