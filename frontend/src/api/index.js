import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8085/api',
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
  githubLogin: (code) => api.post('/auth/github', { code }),
};


export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  updateProfile: (id, data) => api.put(`/users/${id}`, data),
  toggleFollow: (id) => api.post(`/users/${id}/follow`),
};

export const postsApi = {
  create: (data) => api.post('/posts', data),
  getFeed: () => api.get('/posts/feed'),
  react: (id, type) => api.post(`/posts/${id}/react?type=${type}`),
  addComment: (id, data) => api.post(`/posts/${id}/comments`, data),
  getComments: (id) => api.get(`/posts/${id}/comments`),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const sessionRequestsApi = {
  create: (data) => api.post('/session-requests', data),
  getSent: () => api.get('/session-requests/sent'),
  getIncoming: () => api.get('/session-requests/incoming'),
  accept: (id, data) => api.patch(`/session-requests/${id}/accept`, data),
  reject: (id, data) => api.patch(`/session-requests/${id}/reject`, data),
  getForMe: () => api.get('/session-requests'),
  updateStatus: (id, status) => api.patch(`/session-requests/${id}/status?status=${status}`)
};

export const notificationsApi = {
  getUnread: () => api.get('/notifications'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`)
};

export const messagesApi = {
  send: (data) => api.post('/messages', data),
  getHistory: (userId) => api.get(`/messages/${userId}`),
  getConversations: () => api.get('/messages/conversations')
};

export const aiApi = {
  enhance: (text) => api.post('/ai/enhance', { text }),
  getMatches: () => api.get('/ai/matches'),
};

export const githubApi = {
  connect: (userId, code) => api.post(`/users/${userId}/github/connect`, { code }),
  sync: (userId) => api.post(`/users/${userId}/github/sync`),
  getSkills: (userId) => api.get(`/users/${userId}/skills`),
};
