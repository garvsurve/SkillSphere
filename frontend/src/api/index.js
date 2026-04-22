import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8085/api',
});

// Interceptor to add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/users', userData),
};

export const skillsApi = {
  getAll: (page = 0, size = 10) => api.get(`/skills/paged?page=${page}&size=${size}`),
  search: (query) => api.get(`/skills/search?query=${query}`),
  create: (ownerId, skillData) => api.post(`/skills?ownerId=${ownerId}`, skillData),
};

export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
};
