import React, { useEffect, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import transactionService from '../features/finances/transactionService';
import { Search, ChevronLeft, ChevronRight, Loader2, Download } from 'lucide-react';

const FinancesPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (pageNum) => {
    try {
      setLoading(true);
      const response = await transactionService.getTransactions(pageNum);
      // Access the data from our ApiResponse structure
      const { docs, totalPages: total } = response.data; 
      
      setTransactions(docs);
      setTotalPages(total);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  // Helper to format currency
  const formatMoney = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Helper for Status Badge
  const StatusBadge = ({ status }) => {
    const styles = status === 'paid' 
      ? 'bg-green-500/10 text-green-400 border-green-500/20'
      : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles} capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-dark-bg text-white">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Finances</h1>
            <p className="text-slate-400 text-sm">View and manage your transaction history.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-white transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </header>

        {/* Table Card */}
        <div className="bg-card-bg rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Table Header / Filter */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-800/50 text-slate-200 uppercase text-xs">
                        <tr>
                            <th className="px-6 py-3">Order</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Customer</th>
                            <th className="px-6 py-3 text-right">Net Sales</th>
                            <th className="px-6 py-3 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {loading ? (
                             <tr>
                                <td colSpan="6" className="px-6 py-12 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <Loader2 className="animate-spin text-blue-500" size={20}/>
                                        <span>Loading transactions...</span>
                                    </div>
                                </td>
                             </tr>
                        ) : transactions.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            transactions.map((tx) => (
                                <tr key={tx._id} className="hover:bg-slate-700/20 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white">{tx.orderName}</td>
                                    <td className="px-6 py-4">
                                        {new Date(tx.processedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={tx.financialStatus} />
                                    </td>
                                    <td className="px-6 py-4">
                                        Guest Customer {/* We didn't seed customer names, using placeholder */}
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-300">
                                        {formatMoney(tx.netSales)}
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-white">
                                        {formatMoney(tx.totalSales)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-700 flex items-center justify-between">
                <div className="text-xs text-slate-500">
                    Showing page <span className="text-white font-medium">{page}</span> of <span className="text-white font-medium">{totalPages}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => fetchTransactions(page - 1)}
                        disabled={page === 1 || loading}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button 
                        onClick={() => fetchTransactions(page + 1)}
                        disabled={page === totalPages || loading}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default FinancesPage;