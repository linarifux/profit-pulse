import api from '../../utils/axios';

const getIntegrations = async () => {
  const response = await api.get('/integrations');
  return response.data; // Returns { data: { shopify: true, ... } }
};

const toggleIntegration = async (provider) => {
  const response = await api.post('/integrations/toggle', { provider });
  return response.data;
};

const integrationService = {
  getIntegrations,
  toggleIntegration,
};

export default integrationService;