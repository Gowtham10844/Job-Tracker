// src/services/api.js
import axios from 'axios';

// Base API URL: In development with Vite proxy, '/api' is proxied to http://localhost:5000/api
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor: Attach JWT token if present
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jobtrack_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: Global error handler
api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';

    // If unauthorized or token expired, trigger clean logout event
    if (error.response?.status === 401) {
      if (localStorage.getItem('jobtrack_token')) {
        localStorage.removeItem('jobtrack_token');
        localStorage.removeItem('jobtrack_user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }

    return Promise.reject(new Error(message));
  }
);

// Auth Services
export const authService = {
  register: async userData => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async credentials => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async profileData => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

// Application Services
export const applicationService = {
  getAll: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },
  getById: async id => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
  create: async appData => {
    const response = await api.post('/applications', appData);
    return response.data;
  },
  update: async (id, appData) => {
    const response = await api.put(`/applications/${id}`, appData);
    return response.data;
  },
  delete: async id => {
    const response = await api.delete(`/applications/${id}`);
    return response.data;
  },
};

// Dashboard Services
export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};

// Interviews Services
export const interviewService = {
  getAll: async () => {
    const response = await api.get('/interviews');
    return response.data;
  },
};

export default api;
