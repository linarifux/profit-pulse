import axios from 'axios';

// Create an instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Your Backend URL
  withCredentials: true, // Crucial! Allows cookies (RefreshToken) to be sent/received
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Access Token if it exists
api.interceptors.request.use(
  (config) => {
    // If you store token in localStorage (optional, cookies are safer but this is a common backup)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expiration (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token (Backend must have a /refresh-token route)
        // For now, we will just redirect to login if it fails
        // window.location.href = '/login'; 
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;