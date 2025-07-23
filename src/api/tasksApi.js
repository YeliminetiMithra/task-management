import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';
const TOKEN_KEY = 'authToken';  // LocalStorage key for JWT

// Axios instance with interceptor
const api = axios.create({
  baseURL: API_BASE,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = (user_id, password) =>
  axios.post(`${API_BASE}/login/`, { user_id, password });

export const registerUser = (data) =>
  axios.post(`${API_BASE}/register/`, data);

// Task Main APIs
export const getTasks = () => api.get('/task-main/');
export const getTask = (id) => api.get(`/task-main/${id}/`);
export const createTask = (taskData) => api.post('/task-main/', taskData);
export const updateTask = (id, taskData) => api.put(`/task-main/${id}/`, taskData);
export const deleteTask = (id) => api.delete(`/task-main/${id}/`);

// Task Attachments APIs
export const getAttachments = () => api.get('/task-attachment/');
export const uploadAttachment = (taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('task_main', taskId);

  return api.post('/task-attachment/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deleteAttachment = (id) => api.delete(`/task-attachment/${id}/`);

// Task Updates APIs
export const getTaskUpdates = () => api.get('/task-update/');
export const createTaskUpdate = (updateData) => api.post('/task-update/', updateData);

// Task Status Tracking APIs
export const getStatusTracks = () => api.get('/task-status-track/');
export const createStatusTrack = (statusData) => api.post('/task-status-track/', statusData);

// Task Assignment APIs
export const getAssignments = () => api.get('/task-assignment/');
export const createAssignment = (assignData) => api.post('/task-assignment/', assignData);
export const deleteAssignment = (id) => api.delete(`/task-assignment/${id}/`);

// Helper for Full Task Info
export const getAllTaskData = async (taskId) => {
  const [task, attachments, updates, statusTracks, assignments] = await Promise.all([
    getTask(taskId),
    getAttachments(),
    getTaskUpdates(),
    getStatusTracks(),
    getAssignments(),
  ]);
  return {
    task: task.data,
    attachments: attachments.data.filter((a) => a.task_main === taskId),
    updates: updates.data.filter((u) => u.task_main === taskId),
    statusTracks: statusTracks.data.filter((s) => s.task_main === taskId),
    assignments: assignments.data.filter((a) => a.task_main === taskId),
  };
};

// Utility
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
