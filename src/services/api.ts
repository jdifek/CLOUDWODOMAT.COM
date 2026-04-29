/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { credentialsService } from './credentialsService';

// ─── Вспомогательная функция: кодируем пробелы в строках ──────────────────
function encodeParams(params: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(params)) {
    // Кодируем пробелы в строках (beginTime, endTime и др.)
    result[key] = typeof val === 'string' ? val.replace(/ /g, '%20') : val;
  }
  return result;
}

// ─── Интерцептор для apiHappy ──────────────────────────────────────────────
function buildHappyInterceptor(useUserParam = false) {
  return (config: any) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;

    const credentials = credentialsService.get();
    // appid всегда нужен
    // saler нужен для большинства, user — для /addvalue, /getconsume, /cardinfo и др.
    if (!credentials) {
      throw new Error('Credentials are not available');
    }
    const creds = useUserParam
      ? { appid: credentials.appid, user: credentials.saler }
      : { appid: credentials.appid, saler: credentials.saler };

    if (config.method === 'get') {
      config.params = encodeParams({ ...creds, ...config.params });
    } else if (config.method === 'post') {
      // POST передаётся как form-data, пробелов в датах нет — не трогаем
      config.data = { ...creds, ...config.data };
    }

    return config;
  };
}

// ─── Общий обработчик 401 ─────────────────────────────────────────────────
function handle401(error: any) {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
}

// ─── Основной API (твой бэкенд) ───────────────────────────────────────────
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
api.interceptors.response.use((r) => r, handle401);

// ─── apiHappy с параметром saler (большинство эндпоинтов) ─────────────────
export const apiHappy = axios.create({
  baseURL: import.meta.env.VITE_API_HAPPY_URL,
});
apiHappy.interceptors.request.use(buildHappyInterceptor(false));
apiHappy.interceptors.response.use((r) => r, handle401);

// ─── apiHappyUser с параметром user (карточные эндпоинты) ─────────────────
// Используется для: /addvalue, /getconsume, /cardinfo, /getaddvalue,
//                   /notify, /getproducts
export const apiHappyUser = axios.create({
  baseURL: import.meta.env.VITE_API_HAPPY_URL,
});
apiHappyUser.interceptors.request.use(buildHappyInterceptor(true));
apiHappyUser.interceptors.response.use((r) => r, handle401);