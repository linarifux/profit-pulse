import React from 'react';
import { LayoutDashboard, BarChart3, Settings, Wallet, Link2, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset } from '../../features/auth/authSlice'; // Import auth actions
import clsx from 'clsx';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
  { name: 'Integrations', icon: Link2, path: '/integrations' },
  { name: 'Finances', icon: Wallet, path: '/finances' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/login');
  };

  return (
    <div className="h-screen w-64 bg-card-bg border-r border-slate-700 flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
          {/* Fixed: changed bg-linear-to-br to bg-gradient-to-br */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            P
          </div>
          ProfitPulse
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
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
      </nav>

      {/* User / Logout Area */}
      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;