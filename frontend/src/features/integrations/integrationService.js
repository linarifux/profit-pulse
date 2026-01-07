import api from '../../utils/axios';

const getIntegrations = async () => {
  const response = await api.get('/integrations');
  return response.data; // Returns { data: { shopify: true, ... } }
};

const toggleIntegration = async (provider) => {
  const response = await api.post('/integrations/toggle', { provider });
  return response.data;
};

// New: Fetch the Shopify OAuth URL from the backend
const getShopifyAuthUrl = async (shopName) => {
  // Calls GET /api/v1/integrations/shopify/auth?shop=my-store.myshopify.com
  const response = await api.get(`/integrations/shopify/auth?shop=${shopName}`);
  return response.data;
};

const integrationService = {
  getIntegrations,
  toggleIntegration,
  getShopifyAuthUrl, // Added to exports
};

export default integrationService;