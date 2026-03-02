import axios from 'axios';
import { credentialsService } from './credentialsService';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiHappy = axios.create({
  baseURL: import.meta.env.VITE_API_HAPPY_URL,
});

apiHappy.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const credentials = credentialsService.get();

  if (config.method === 'get') {
    config.params = { ...credentials, ...config.params };
  } else if (config.method === 'post') {
    config.data = { ...credentials, ...config.data };
  }

  return config;
});

apiHappy.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);