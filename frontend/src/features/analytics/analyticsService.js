import api from '../../utils/axios';

const getPlatformStats = async () => {
  const response = await api.get('/analytics/platforms');
  return response.data;
};

const analyticsService = {
  getPlatformStats,
};

export default analyticsService;