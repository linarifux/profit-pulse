import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import IntegrationCard from '../components/integrations/IntegrationCard';
import integrationService from '../features/integrations/integrationService'; // Import service
import { ShoppingBag, Facebook, Video, BarChart, Loader2 } from 'lucide-react'; // Added Loader2

const IntegrationsPage = () => {
  const [connectedApps, setConnectedApps] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch initial status from DB
  useEffect(() => {
    const fetchIntegrations = async () => {
        try {
            const response = await integrationService.getIntegrations();
            setConnectedApps(response.data); // data is { shopify: true, ... }
        } catch (error) {
            console.error("Failed to fetch integrations", error);
        } finally {
            setLoading(false);
        }
    };
    
    fetchIntegrations();
  }, []);

  const handleToggle = async (key) => {
      try {
          // Optimistic UI Update (makes it feel instant)
          const previousState = connectedApps[key];
          setConnectedApps(prev => ({ ...prev, [key]: !previousState }));

          // Call API
          await integrationService.toggleIntegration(key);
      } catch (error) {
          console.error("Failed to toggle connection", error);
          // Revert on error
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

  return (
    <div className="flex min-h-screen bg-dark-bg text-white">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Integrations</h1>
            <p className="text-slate-400 text-sm">Manage your data sources and connections.</p>
        </header>

        {/* Loading State */}
        {loading ? (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" size={40} />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((app) => (
                    <IntegrationCard 
                        key={app.key}
                        name={app.name}
                        description={app.description}
                        icon={app.icon}
                        color={app.color}
                        isConnected={!!connectedApps[app.key]} // Ensure boolean
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