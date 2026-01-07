import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import transactionService from '../features/finances/transactionService';
import { 
  Search, ChevronLeft, ChevronRight, Loader2, Download, Menu, 
  Filter, Calendar, DollarSign, TrendingUp, CreditCard, Eye, X, Package, User, Receipt
} from 'lucide-react';

const FinancesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Stats (Derived)
  const [summary, setSummary] = useState({ revenue: 0, orders: 0, avgValue: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const fetchTransactions = async (pageNum) => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await transactionService.getTransactions(pageNum);
      const { docs, totalPages: total } = response.data; 
      
      setTransactions(docs);
      setTotalPages(total);
      setPage(pageNum);

      const totalRev = docs.reduce((acc, curr) => acc + curr.totalSales, 0);
      setSummary({
          revenue: totalRev,
          orders: docs.length,
          avgValue: docs.length > 0 ? totalRev / docs.length : 0
      });

    } catch (error) {
      console.error("Failed to fetch transactions", error);
      if (error.response && error.response.status === 401) {
          navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions(1);
    }
  }, [user]);

  if (!user) return null;

  const formatMoney = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const StatusBadge = ({ status }) => {
    const styles = status === 'paid' 
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles} capitalize flex items-center gap-1.5 w-fit`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'paid' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
        {status}
      </span>
    );
  };

  const SummaryCard = ({ title, value, icon: Icon, colorClass }) => (
      <div className="bg-card-bg p-5 rounded-xl border border-slate-700/50 flex items-start justify-between hover:border-slate-600 transition-all group">
          <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
              <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
          </div>
          <div className={`p-3 rounded-lg ${colorClass} group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
          </div>
      </div>
  );

  // --- ORDER MODAL COMPONENT ---
  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
        
        {/* Modal Content */}
        <div className="relative bg-card-bg border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Order {order.orderName}
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Processed on {new Date(order.processedAt).toLocaleDateString()}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto space-y-6">
            
            {/* Status & Customer Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                  <Package size={14} /> Status
                </div>
                <StatusBadge status={order.financialStatus} />
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-2">
                  <User size={14} /> Customer
                </div>
                <p className="text-white font-medium">Guest Customer</p>
                <p className="text-xs text-slate-500">guest@example.com</p>
              </div>
            </div>

            {/* Financial Breakdown */}
            <div>
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Receipt size={16} className="text-blue-400"/> Financial Breakdown
              </h3>
              <div className="bg-slate-900/50 rounded-xl border border-slate-700/30 divide-y divide-slate-700/30">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Net Sales</span>
                  <span className="text-white font-medium">{formatMoney(order.netSales)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Shipping</span>
                  <span className="text-white font-medium">{formatMoney(order.shippingCost)}</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Transaction Fees</span>
                  <span className="text-red-400 font-medium">-{formatMoney(order.paymentGatewayFee)}</span>
                </div>
                <div className="p-4 flex justify-between items-center bg-slate-800/30">
                  <span className="text-slate-200 font-bold">Total Sales</span>
                  <span className="text-green-400 font-bold text-lg">{formatMoney(order.totalSales)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 bg-slate-800/30 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-dark-bg text-white relative">
      
      {/* 1. Sidebar Logic (Optimized for Desktop & Mobile) */}
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Desktop Fixed Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* Mobile Slide-out Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* 2. Main Content Area */}
      {/* md:ml-64 ensures no overlapping with fixed sidebar on desktop */}
      <main className="flex-1 w-full md:ml-64 p-4 md:p-8 overflow-x-hidden">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
                <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors">
                    <Menu size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Financial Overview</h1>
                    <p className="text-slate-400 text-sm">Track your revenue streams and transaction history.</p>
                </div>
            </div>
            
            <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-blue-500/20">
                    <Download size={16} />
                    <span>Export Report</span>
                </button>
            </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <SummaryCard title="Total Revenue" value={formatMoney(summary.revenue)} icon={DollarSign} colorClass="bg-blue-500/10 text-blue-400" />
            <SummaryCard title="Transactions" value={summary.orders} icon={CreditCard} colorClass="bg-purple-500/10 text-purple-400" />
            <SummaryCard title="Avg. Order Value" value={formatMoney(summary.avgValue)} icon={TrendingUp} colorClass="bg-emerald-500/10 text-emerald-400" />
        </div>

        {/* Control Bar */}
        <div className="bg-card-bg rounded-t-xl border border-slate-700/50 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input type="text" placeholder="Search by order ID..." className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"/>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"><Filter size={16} /><span>Filter</span></button>
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"><Calendar size={16} /><span>Date</span></button>
            </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-card-bg rounded-b-xl border-x border-b border-slate-700/50 overflow-hidden shadow-xl shadow-black/20">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800/50 text-slate-200 uppercase text-xs tracking-wider font-semibold border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4 text-right">Net Amount</th>
                            <th className="px-6 py-4 text-right">Total</th>
                            <th className="px-6 py-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {loading ? (
                             <tr><td colSpan="7" className="px-6 py-20 text-center"><div className="flex flex-col items-center justify-center gap-3"><Loader2 className="animate-spin text-blue-500" size={32}/><span className="text-slate-500">Loading...</span></div></td></tr>
                        ) : transactions.length === 0 ? (
                            <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-500">No transactions found.</td></tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr 
                                    key={tx._id} 
                                    onClick={() => setSelectedOrder(tx)} // Click handler
                                    className="hover:bg-blue-500/5 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{tx.orderName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-slate-400">{new Date(tx.processedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={tx.financialStatus} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="text-slate-300">Guest User</span></td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-400 whitespace-nowrap">{formatMoney(tx.netSales)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-white whitespace-nowrap">{formatMoney(tx.totalSales)}</td>
                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                        <div className="flex items-center justify-center gap-2 text-blue-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Eye size={16} />
                                            <span className="text-xs font-medium">View</span>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 bg-slate-800/30 border-t border-slate-700 flex items-center justify-between">
                <div className="text-sm text-slate-500">Page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span></div>
                <div className="flex gap-2">
                    <button onClick={() => fetchTransactions(page - 1)} disabled={page === 1 || loading} className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-all text-slate-400"><ChevronLeft size={18} /></button>
                    <button onClick={() => fetchTransactions(page + 1)} disabled={page === totalPages || loading} className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white disabled:opacity-50 transition-all text-slate-400"><ChevronRight size={18} /></button>
                </div>
            </div>
        </div>

      </main>

      {/* 3. Render Modal if order selected */}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}

    </div>
  );
};

export default FinancesPage;