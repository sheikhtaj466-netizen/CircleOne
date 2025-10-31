import axios from 'axios';

// Naya axios instance banao
const api = axios.create({
  // Vercel par VITE_API_URL istemaal karo, Termux me localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

// Har request ke saath token bhejne ka logic
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
