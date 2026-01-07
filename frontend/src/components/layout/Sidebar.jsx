import React from 'react';
import { LayoutDashboard, BarChart3, Settings, Wallet, Link2, LogOut, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice';
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Integrations', icon: Link2, path: '/integrations' },
  { name: 'Finances', icon: Wallet, path: '/finances' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
    if (onClose) onClose();
  };

  return (
    // Updated: Uses 'sticky top-0' instead of 'fixed'.
    // This makes it stick to the top while scrolling, but keeps it in the layout flow.
    <div className="sticky top-0 z-50 h-screen w-64 bg-card-bg border-r border-slate-700 flex flex-col transition-transform duration-300 shrink-0">
      
      {/* Logo Area */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700 shrink-0">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            P
          </div>
          ProfitPulse
        </div>
        
        {/* Mobile Close Button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="md:hidden p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation & Logout Area */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              )}
            >
              <item.icon size={20} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
              {item.name}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="my-2 border-t border-slate-700/50 mx-2"></div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;