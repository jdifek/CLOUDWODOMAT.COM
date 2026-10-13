/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/statsService.ts — статистика из НАШЕЙ БД (вместо выгрузки из китайского API)
import { api } from "./api";

export interface StatsTotals {
  liters: number;
  amount: number;
  txCount: number;
  noDispenseCount: number;
  cardCount: number;
  cashCount: number;
  qrCount: number;
  terminalCount: number;
}

export interface StatsCoverage {
  loadedFrom: string | null; // история загружена начиная с этого момента
  loadedTo: string | null; // данные загружены до этого момента (null = сбор ещё не стартовал)
  lastRunAt: string | null;
  lastError: string | null;
}

export interface StatsDay extends StatsTotals {
  day: string; // YYYY-MM-DD (Europe/Warsaw)
}

export interface StatsDeviceRow extends StatsTotals {
  deviceId: string;
  location: string | null;
}

export interface StatsOverview {
  range: { from: string; to: string };
  coverage: StatsCoverage;
  total: StatsTotals;
  byDay: StatsDay[];
  byDevice: StatsDeviceRow[];
}

export interface HourBucket {
  day: string;
  hour: number;
  sales: number;
  revenue: number;
  liters: number;
}

export interface StatsRecentTx {
  payId: string;
  paidAt: string;
  liters: number;
  amount: number;
  noDispense: boolean;
}

export interface StatsDeviceDetail {
  range: { from: string; to: string };
  coverage: StatsCoverage;
  device: { deviceId: string; location: string | null };
  ports: { water1: number; water2: number };
  total: StatsTotals;
  byDay: StatsDay[];
  recent: StatsRecentTx[];
}

export interface StatsTransactionsPage {
  items: any[]; // исходные записи API (тот же формат, что ConsumeRecord)
  nextCursor: string | null; // null = больше записей нет
  coverage: StatsCoverage;
}

// ВАЖНО: пути даны относительно VITE_API_URL. Если у вас VITE_API_URL
// заканчивается на "/api" — оставьте как есть, если нет — замените "/stats" на "/api/stats".
const BASE = "/stats";

export const StatsService = {
  /** Вкладка "Все автоматы" */
  overview(from: string, to: string, signal?: AbortSignal) {
    return api.get<StatsOverview>(`${BASE}/overview`, { params: { from, to }, signal });
  },

  /** Почасовая разбивка (все автоматы или один) */
  hourly(from: string, to: string, deviceId?: string, signal?: AbortSignal) {
    return api.get<HourBucket[]>(`${BASE}/hourly`, {
      params: { from, to, ...(deviceId ? { deviceId } : {}) },
      signal,
    });
  },

  /** Список транзакций автомата (вкладка "Потребление"), постранично по курсору */
  transactions(deviceId: string, cursor?: string | null, limit = 30, signal?: AbortSignal) {
    return api.get<StatsTransactionsPage>(
      `${BASE}/devices/${encodeURIComponent(deviceId)}/transactions`,
      { params: { ...(cursor ? { cursor } : {}), limit }, signal }
    );
  },

  /** Вкладка "Один автомат" */
  device(deviceId: string, from: string, to: string, signal?: AbortSignal) {
    return api.get<StatsDeviceDetail>(`${BASE}/devices/${encodeURIComponent(deviceId)}`, {
      params: { from, to },
      signal,
    });
  },
};