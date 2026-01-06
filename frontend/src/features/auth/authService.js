import api from '../../utils/axios';

const register = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/users/login', userData);
  
  if (response.data.data) {
    // Store user data in localStorage to persist login across refreshes
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
    localStorage.setItem('accessToken', response.data.data.accessToken);
  }
  return response.data;
};

const logout = async () => {
  await api.post('/users/logout');
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
};

const updateProfile = async (userData) => {
  const response = await api.patch('/users/update-account', userData);
  // Update local storage so the name changes in the UI immediately
  if (response.data.data) {
     const currentUser = JSON.parse(localStorage.getItem('user'));
     const updatedUser = { ...currentUser, ...response.data.data };
     localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return response.data;
};

const changePassword = async (passwordData) => {
  const response = await api.post('/users/change-password', passwordData);
  return response.data;
};

const authService = {
  register,
  logout,
  login,updateProfile, // Add
  changePassword,
};

export default authService;