import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== '/api' 
    ? import.meta.env.VITE_API_BASE_URL 
    : (import.meta.env.PROD ? 'https://sprintflow-ai.onrender.com/api' : '/api'),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization Token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('sprintflow_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  register: (data) => API.post('/auth/register', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data)
};

export const projectAPI = {
  getAll: () => API.get('/projects'),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  updateTask: (projectId, taskId, status) => API.patch(`/projects/${projectId}/tasks/${taskId}`, { status }),
  delete: (id) => API.delete(`/projects/${id}`)
};

export default API;
