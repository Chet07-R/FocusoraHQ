import axios from 'axios';

const resolveApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    // Always use Vite proxy in development for stable local connectivity.
    return '/api';
  }

  const envBaseUrl = String(import.meta.env.VITE_API_URL || '').trim();
  if (envBaseUrl) {
    return envBaseUrl;
  }

  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
