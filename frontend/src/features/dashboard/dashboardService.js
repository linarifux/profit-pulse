import api from '../../utils/axios';

const getDashboardStats = async (timeframe = 'daily') => {
  const response = await api.get(`/dashboard/stats?timeframe=${timeframe}`);
  return response.data;
};

const dashboardService = {
  getDashboardStats,
};

export default dashboardService;