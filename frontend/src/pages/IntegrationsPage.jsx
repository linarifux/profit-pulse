import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import IntegrationCard from '../components/integrations/IntegrationCard';
import integrationService from '../features/integrations/integrationService';
import { ShoppingBag, Facebook, Video, BarChart, Loader2, Menu } from 'lucide-react';

const IntegrationsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [connectedApps, setConnectedApps] = useState({});
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 1. Protect Route
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // 2. Fetch Data
  useEffect(() => {
    if (!user) return;
    const fetchIntegrations = async () => {
        try {
            const response = await integrationService.getIntegrations();
            setConnectedApps(response.data); 
        } catch (error) {
            console.error("Failed to fetch integrations", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchIntegrations();
  }, [user]);

  const handleToggle = async (key) => {
      try {
          const previousState = connectedApps[key];
          setConnectedApps(prev => ({ ...prev, [key]: !previousState }));
          await integrationService.toggleIntegration(key);
      } catch (error) {
          console.error("Failed to toggle connection", error);
          setConnectedApps(prev => ({ ...prev, [key]: !prev[key] }));
      }
  };

  const integrations = [
    {
      key: 'shopify',
      name: 'Shopify Store',
      description: 'Connect your store to sync orders, revenue, and product data in real-time.',
      icon: ShoppingBag,
      color: 'green' 
    },
    {
      key: 'meta',
      name: 'Meta Ads',
      description: 'Track ad spend, impressions, and ROAS from Facebook and Instagram campaigns.',
      icon: Facebook,
      color: 'blue'
    },
    {
      key: 'tiktok',
      name: 'TikTok Ads',
      description: 'Sync your TikTok campaign data to visualize true creative performance.',
      icon: Video,
      color: 'pink'
    },
    {
      key: 'google',
      name: 'Google Analytics 4',
      description: 'Deep dive into user behavior and traffic sources alongside your profit data.',
      icon: BarChart,
      color: 'yellow'
    }
  ];

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-dark-bg text-white relative">
      
      {/* 1. Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* 2. Desktop Fixed Sidebar */}
      <div className="hidden md:block fixed inset-y-0 left-0 z-50 w-64">
        <Sidebar />
      </div>

      {/* 3. Mobile Slide-out Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* 4. Main Content */}
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
                <h1 className="text-xl md:text-2xl font-bold mb-1">Integrations</h1>
                <p className="text-slate-400 text-xs md:text-sm">Manage your data sources and connections.</p>
            </div>
        </header>

        {/* Loading State */}
        {loading ? (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {integrations.map((app) => (
                    <IntegrationCard 
                        key={app.key}
                        name={app.name}
                        description={app.description}
                        icon={app.icon}
                        color={app.color}
                        isConnected={!!connectedApps[app.key]} 
                        onConnect={() => handleToggle(app.key)}
                    />
                ))}
            </div>
        )}
      </main>
    </div>
  );
};

export default IntegrationsPage;