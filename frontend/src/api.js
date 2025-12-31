import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
// Handles global errors like Session Expiry (401)
api.interceptors.response.use(
  (response) => {
    // If the request succeeds, just return the data
    return response;
  },
  (error) => {
    // If the Backend says "Unauthorized" (401), the token is invalid/expired
    if (error.response && error.response.status === 401) {
      // 1. Clear the invalid token
      localStorage.removeItem('token');
      
      // 2. Redirect to Login page immediately
      // Using window.location ensures a full refresh to clear state
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;