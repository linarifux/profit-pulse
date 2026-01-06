import api from '../../utils/axios';

const getTransactions = async (page = 1, limit = 10) => {
  const response = await api.get(`/transactions?page=${page}&limit=${limit}`);
  return response.data; // This returns the { docs, totalPages, ... } object
};

const transactionService = {
  getTransactions,
};

export default transactionService;