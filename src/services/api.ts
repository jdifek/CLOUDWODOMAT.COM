/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { credentialsService } from './credentialsService';

function buildHappyInterceptor(useUserParam = false) {
  return (config: any) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const credentials = credentialsService.get();
    if (!credentials) {
      throw new Error('Credentials are not available');
    }

    const creds = useUserParam
      ? { appid: credentials.appid, user: credentials.saler }
      : { appid: credentials.appid, saler: credentials.saler };

    if (config.method === 'get') {
      config.params = { ...creds, ...config.params };
    } else if (config.method === 'post') {
      config.data = { ...creds, ...config.data };
    }

    return config;
  };
}

function handle401(error: any) {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, handle401);

export const apiHappy = axios.create({
  baseURL: import.meta.env.VITE_API_HAPPY_URL,
});
apiHappy.interceptors.request.use(buildHappyInterceptor(false));
apiHappy.interceptors.response.use((r) => r, handle401);

export const apiHappyUser = axios.create({
  baseURL: import.meta.env.VITE_API_HAPPY_URL,
});
apiHappyUser.interceptors.request.use(buildHappyInterceptor(true));
apiHappyUser.interceptors.response.use((r) => r, handle401);