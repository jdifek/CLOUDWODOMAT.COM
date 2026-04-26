/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetricCard } from "../components/MetricCard";
import { DataTable } from "../components/DataTable";
import { useLanguage } from "../contexts/LanguageContext";
import { TrendingUp, ShoppingCart, Calendar, ChevronLeft, ChevronRight, RefreshCw, Droplets } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useState, useEffect, useCallback, useRef } from "react";
import { HappyTiService } from "../services/happyTiService";

// ─── Types ─────────────────────────────────────────────────────────────────

interface DashboardStats {
  todaySales: number;
  periodSales: number;
  todayRevenue: number;
  periodRevenue: number;
  activeDevices: number;
  todayLiters: number;
}

interface DeviceStats {
  online: number;
  offline: number;
  total: number;
}

interface DeviceItem {
  id: string;
  location: string;
  is_online?: string;
  is_onlie?: string;
  create_time: string;
}

type ChartMode = "hourly" | "daily";

const MAX_DAYS = 3;

// ─── Date/Time Utilities ────────────────────────────────────────────────────

function todayWarsaw(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
}

function getWarsawOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const warsawMs = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
  return warsawMs - date.getTime();
}

function dayStartWarsaw(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const offset = getWarsawOffsetMs(approx);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - offset);
}

function dayEndWarsaw(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const offset = getWarsawOffsetMs(approx);
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59) - offset);
}

function toApiDate(d: Date): string {
  const utc8Ms = d.getTime() + 8 * 60 * 60 * 1000;
  const u = new Date(utc8Ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${u.getUTCFullYear()}-${pad(u.getUTCMonth() + 1)}-${pad(u.getUTCDate())} ${pad(u.getUTCHours())}:${pad(u.getUTCMinutes())}:${pad(u.getUTCSeconds())}`;
}

function apiTimeToWarsawDate(apiTime: string): string {
  const parts = apiTime.split(" ");
  if (parts.length < 2) return apiTime.slice(0, 10);
  const [datePart, timePart] = parts;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date(utcMs));
}

/** Returns "YYYY-MM-DD HH" from API time string for hourly+date bucketing */
function apiTimeToWarsawDayHour(apiTime: string): { date: string; hour: number } {
  const parts = apiTime.split(" ");
  if (parts.length < 2) return { date: apiTime.slice(0, 10), hour: 0 };
  const [datePart, timePart] = parts;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date(utcMs));
  const h = parseInt(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Warsaw", hour: "2-digit", hour12: false }).format(new Date(utcMs)),
    10
  );
  return { date, hour: h };
}

/** Clamp date range to MAX_DAYS, keeping `to` fixed */
function clampFrom(from: string, to: string): string {
  const [ty, tm, td] = to.split("-").map(Number);
  const toMs = Date.UTC(ty, tm - 1, td);
  const [fy, fm, fd] = from.split("-").map(Number);
  const fromMs = Date.UTC(fy, fm - 1, fd);
  const diffDays = Math.round((toMs - fromMs) / 86_400_000);
  if (diffDays >= MAX_DAYS) {
    const clamped = new Date(toMs - (MAX_DAYS - 1) * 86_400_000);
    return clamped.toISOString().slice(0, 10);
  }
  return from;
}

function daysBetween(from: string, to: string): number {
  const [fy, fm, fd] = from.split("-").map(Number);
  const [ty, tm, td] = to.split("-").map(Number);
  return Math.round((Date.UTC(ty, tm - 1, td) - Date.UTC(fy, fm - 1, fd)) / 86_400_000) + 1;
}

// ─── Fetch with abort ──────────────────────────────────────────────────────

async function fetchAllRecords(beginTime: string, endTime: string, signal?: AbortSignal): Promise<any[]> {
  const all: any[] = [];
  for (let page = 1; ; page++) {
    if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
    const res = await HappyTiService.recordList({ page, beginTime, endTime });
    if (res.data.code !== 0) break;
    const batch: any[] = res.data.data ?? [];
    all.push(...batch);
    if (batch.length < 20) break;
  }
  return all;
}

// ─── Mini Calendar ─────────────────────────────────────────────────────────

function MiniCalendar({ selected, onSelect, onClose, language, maxDate, minDate }: {
  selected: string;
  onSelect: (date: string) => void;
  onClose: () => void;
  language: string;
  maxDate?: string;
  minDate?: string;
}) {
  const today = todayWarsaw();
  const [viewYear, setViewYear] = useState(() => parseInt(selected.split("-")[0]));
  const [viewMonth, setViewMonth] = useState(() => parseInt(selected.split("-")[1]) - 1);
  const locale = language === "pl" ? "pl-PL" : language === "ru" ? "ru-RU" : "en-GB";
  const monthNames = Array.from({ length: 12 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, i, 1)));
  const dayNames = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2000, 0, 3 + i)));
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDow + 6) % 7;
  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const cells: (number | null)[] = [...Array(startOffset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3 w-64" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
        <span className="text-sm font-semibold text-gray-700 capitalize">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronRight className="w-4 h-4 text-gray-500" /></button>
      </div>
      <div className="grid grid-cols-7 mb-1">{dayNames.map(d => <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>)}</div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (day === null) return <div key={i} />;
          const dateStr = `${viewYear}-${pad2(viewMonth + 1)}-${pad2(day)}`;
          const isSelected = dateStr === selected;
          const isToday = dateStr === today;
          const isFuture = dateStr > today;
          const isTooEarly = minDate ? dateStr < minDate : false;
          const isTooLate = maxDate ? dateStr > maxDate : false;
          const disabled = isFuture || isTooEarly || isTooLate;
          return (
            <button key={i} disabled={disabled} onClick={() => { onSelect(dateStr); onClose(); }}
              className={["text-xs rounded-lg py-1.5 transition-colors font-medium w-full",
                isSelected ? "bg-[#4A90E2] text-white" : "",
                isToday && !isSelected ? "border border-[#4A90E2] text-[#4A90E2]" : "",
                !isSelected && !isToday && !disabled ? "text-gray-700 hover:bg-gray-100" : "",
                disabled ? "text-gray-300 cursor-not-allowed" : ""].join(" ")}>
              {day}
            </button>
          );
        })}
      </div>
      <p className="text-center text-[10px] text-gray-400 mt-2">
        Max {MAX_DAYS} days
      </p>
    </div>
  );
}

// ─── Date Range Picker ─────────────────────────────────────────────────────

function DateRangePicker({ from, to, onChange, language }: {
  from: string; to: string; onChange: (from: string, to: string) => void; language: string;
}) {
  const [openCal, setOpenCal] = useState<"from" | "to" | null>(null);
  const locale = language === "pl" ? "pl-PL" : language === "ru" ? "ru-RU" : "en-GB";
  const fmt = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric" })
      .format(new Date(Number(y), Number(m) - 1, Number(d)));
  };

  useEffect(() => {
    if (!openCal) return;
    const handler = () => setOpenCal(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openCal]);

  // Quick presets — all capped at MAX_DAYS
  const presets = [
    { label: "1d", days: 1 },
    { label: "2d", days: 2 },
    { label: "3d", days: 3 },
  ];
  const applyPreset = (days: number) => {
    const today = todayWarsaw();
    const [y, m, d] = today.split("-").map(Number);
    const newFrom = new Date(Date.UTC(y, m - 1, d - days + 1)).toISOString().slice(0, 10);
    onChange(newFrom, today);
  };

  // When picking "from", max date = to, min date = to - (MAX_DAYS-1)
  const [ty, tm, td] = to.split("-").map(Number);
  const minFrom = new Date(Date.UTC(ty, tm - 1, td - (MAX_DAYS - 1))).toISOString().slice(0, 10);

  // When picking "to", min date = from, max date = from + (MAX_DAYS-1)
  const [fy, fm, fd] = from.split("-").map(Number);
  const maxTo = new Date(Date.UTC(fy, fm - 1, fd + (MAX_DAYS - 1))).toISOString().slice(0, 10);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Preset buttons */}
      <div className="flex gap-1">
        {presets.map(({ label, days }) => (
          <button key={label} onClick={() => applyPreset(days)}
            className="px-2 py-1 text-xs font-medium rounded-lg border border-gray-200 text-gray-600 hover:border-[#4A90E2] hover:text-[#4A90E2] transition-colors">
            {label}
          </button>
        ))}
      </div>

      {/* "From" picker */}
      <div className="relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpenCal(openCal === "from" ? null : "from")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#4A90E2] transition-colors shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-[#4A90E2]" />{fmt(from)}
        </button>
        {openCal === "from" && (
          <MiniCalendar
            selected={from}
            minDate={minFrom}
            maxDate={to}
            onSelect={d => { onChange(d, to < d ? d : to); }}
            onClose={() => setOpenCal(null)}
            language={language}
          />
        )}
      </div>

      <span className="text-gray-400 text-sm">—</span>

      {/* "To" picker */}
      <div className="relative" onClick={e => e.stopPropagation()}>
        <button onClick={() => setOpenCal(openCal === "to" ? null : "to")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#4A90E2] transition-colors shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-[#4A90E2]" />{fmt(to)}
        </button>
        {openCal === "to" && (
          <MiniCalendar
            selected={to}
            minDate={from}
            maxDate={maxTo < todayWarsaw() ? maxTo : todayWarsaw()}
            onSelect={d => { onChange(from > d ? d : from, d); }}
            onClose={() => setOpenCal(null)}
            language={language}
          />
        )}
      </div>

      {/* Day count badge */}
      <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
        {daysBetween(from, to)}d
      </span>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function Dashboard() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"profit" | "sales" | "exchange">("profit");
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>("hourly");

  const initTo = todayWarsaw();
  const initFrom = initTo;

  const [dateFrom, setDateFrom] = useState(initFrom);
  const [dateTo, setDateTo] = useState(initTo);

  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0, periodSales: 0, todayRevenue: 0,
    periodRevenue: 0, activeDevices: 0, todayLiters: 0,
  });
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({ online: 0, offline: 0, total: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recordCount, setRecordCount] = useState(0);

  // Abort controller ref to cancel in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  const loadDevices = async () => {
    try {
      const allDevices: DeviceItem[] = [];
      for (let page = 1; ; page++) {
        const res = await HappyTiService.deviceList({ type: "shop", page });
        if (res.data.code !== 0) break;
        const batch: DeviceItem[] = res.data.data ?? [];
        allDevices.push(...batch);
        if (batch.length < 20) break;
      }
      setDevices(allDevices);
      const online = allDevices.filter(d => d.is_online === "online" || d.is_onlie === "online").length;
      setDeviceStats({ online, offline: allDevices.length - online, total: allDevices.length });
      setStats(prev => ({ ...prev, activeDevices: online }));
    } catch (err) { console.error(err); }
  };

  const prepareChartData = (records: any[], from: string, to: string, mode: ChartMode) => {
    const days: string[] = [];
    const [fy, fm, fd] = from.split("-").map(Number);
    const [ty, tm, td] = to.split("-").map(Number);
    const start = new Date(Date.UTC(fy, fm - 1, fd));
    const end = new Date(Date.UTC(ty, tm - 1, td));
    for (let cur = new Date(start); cur <= end; cur.setUTCDate(cur.getUTCDate() + 1))
      days.push(cur.toISOString().slice(0, 10));

    if (mode === "hourly") {
      // One entry per hour per day — label: "DD.MM HH:00"
      const buckets: Record<string, { sales: number; revenue: number; liters: number }> = {};

      // Pre-fill all hours for all days
      for (const day of days) {
        for (let h = 0; h < 24; h++) {
          const key = `${day}|${h}`;
          buckets[key] = { sales: 0, revenue: 0, liters: 0 };
        }
      }

      for (const r of records) {
        const { date, hour } = apiTimeToWarsawDayHour(r.time);
        const key = `${date}|${hour}`;
        if (buckets[key]) {
          buckets[key].sales++;
          buckets[key].revenue += parseFloat(r.cost_value || r.value || "0");
          buckets[key].liters += parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0");
        }
      }

      const multiDay = days.length > 1;
      setChartData(
        Object.entries(buckets).map(([key, v]) => {
          const [date, hourStr] = key.split("|");
          const [, mm, dd] = date.split("-");
          const label = multiDay ? `${dd}.${mm} ${hourStr.padStart(2, "0")}:00` : `${hourStr.padStart(2, "0")}:00`;
          return {
            date: label,
            sales: v.sales,
            revenue: Math.round(v.revenue * 100) / 100,
            liters: Math.round(v.liters * 10) / 10,
          };
        })
      );
    } else {
      // Daily mode
      setChartData(days.map(day => {
        const dayRecs = records.filter(r => apiTimeToWarsawDate(r.time) === day);
        const [, mm, dd] = day.split("-");
        return {
          date: `${dd}.${mm}`,
          sales: dayRecs.length,
          revenue: Math.round(dayRecs.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0) * 100) / 100,
          liters: Math.round(dayRecs.reduce((s, r) => s + parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0"), 0) * 10) / 10,
        };
      }));
    }
  };

  const loadRecords = useCallback(async (from: string, to: string, mode: ChartMode) => {
    // Cancel previous request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setRecordsLoading(true);
    try {
      const beginTime = toApiDate(dayStartWarsaw(from));
      const endTime = toApiDate(dayEndWarsaw(to));
      const allRecords = await fetchAllRecords(beginTime, endTime, controller.signal);

      setRecordCount(allRecords.length);

      const todayStr = todayWarsaw();
      const todayRecords = allRecords.filter(r => apiTimeToWarsawDate(r.time) === todayStr);
      const todaySales = todayRecords.length;
      const todayRevenue = todayRecords.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0);
      const periodSales = allRecords.length;
      const periodRevenue = allRecords.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0);
      const todayLiters = todayRecords.reduce((s, r) => s + parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0"), 0);

      setStats(prev => ({
        ...prev, todaySales, periodSales,
        todayRevenue: Math.round(todayRevenue * 100) / 100,
        periodRevenue: Math.round(periodRevenue * 100) / 100,
        todayLiters: Math.round(todayLiters * 10) / 10,
      }));

      prepareChartData(allRecords, from, to, mode);
    } catch (err: any) {
      if (err?.name === "AbortError") return; // silently ignore cancelled
      console.error(err);
    } finally {
      setRecordsLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadDevices(), loadRecords(dateFrom, dateTo, chartMode)]);
      setLoading(false);
    };
    init();
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleDateChange = (from: string, to: string) => {
    const clamped = clampFrom(from, to);
    setDateFrom(clamped);
    setDateTo(to);
    loadRecords(clamped, to, chartMode);
  };

  const handleChartModeChange = (mode: ChartMode) => {
    setChartMode(mode);
    prepareChartData([], dateFrom, dateTo, mode); // will re-derive from already-fetched; but we need stored records
    // Re-fetch to re-derive chart (or store records in state — see note below)
    loadRecords(dateFrom, dateTo, mode);
  };

  // ── Better approach: store raw records so we can re-derive chart without re-fetching
  // (refactor if you want; this keeps the existing architecture simple)

  const tableData = devices.map((d, idx) => ({
    id: idx + 1,
    channel: d.location || "N/A",
    type: d.is_online === "online" || d.is_onlie === "online" ? t("common.online") : t("common.offline"),
  }));

  const equipmentColumns = [
    { key: "id", label: "№" },
    { key: "channel", label: t("dashboard.channel") },
    { key: "type", label: t("dashboard.type") },
  ];

  const tabs = [
    { key: "profit" as const, label: t("dashboard.totalProfit") },
    { key: "sales" as const, label: t("dashboard.salesEfficiency") },
    { key: "exchange" as const, label: t("dashboard.exchangeEfficiency") },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const numDays = daysBetween(dateFrom, dateTo);

  return (
    <div className="space-y-4 md:space-y-6">

      {/* ── Chart block ── */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">

        {/* Header */}
        <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {t("dashboard.subscriptionData")}
            </h2>
            {/* Max-days warning */}
            <p className="text-xs text-gray-400 mt-0.5">
              Max {MAX_DAYS} {t("common.days") ?? "days"} — {recordCount} {t("common.records") ?? "records"}
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:flex-wrap">
            <DateRangePicker from={dateFrom} to={dateTo} onChange={handleDateChange} language={language} />
            <button
              onClick={() => loadRecords(dateFrom, dateTo, chartMode)}
              disabled={recordsLoading}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${recordsLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Chart mode toggle */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
            {(["hourly", "daily"] as ChartMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => handleChartModeChange(mode)}
                disabled={mode === "daily" && numDays < 2}
                className={[
                  "px-3 py-1.5 font-medium transition-colors",
                  chartMode === mode
                    ? "bg-[#4A90E2] text-white"
                    : "text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed",
                ].join(" ")}
              >
                {mode === "hourly" ? (t("dashboard.hourly") ?? "Hourly") : (t("dashboard.daily") ?? "Daily")}
              </button>
            ))}
          </div>
          {recordsLoading && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 border-2 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
              {t("vendingMachines.analyticsLoadingData") ?? "Loading…"}
            </div>
          )}
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={260}>
          {chartMode === "hourly" ? (
            <BarChart data={chartData} barGap={1} barCategoryGap={numDays > 1 ? "5%" : "15%"}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 9 }}
                interval={numDays === 1 ? 2 : Math.ceil(chartData.length / 24) * 3 - 1}
                angle={numDays > 1 ? -30 : 0}
                textAnchor={numDays > 1 ? "end" : "middle"}
                height={numDays > 1 ? 40 : 20}
              />
              <YAxis tick={{ fontSize: 10 }} width={35} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sales" fill="#5CB85C" name={t("dashboard.sales")} radius={[2, 2, 0, 0]} />
              <Bar dataKey="revenue" fill="#F0AD4E" name={t("dashboard.revenue")} radius={[2, 2, 0, 0]} />
              <Bar dataKey="liters" fill="#4A90E2" name={t("common.liter") ?? "L"} radius={[2, 2, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="sales" stroke="#5CB85C" name={t("dashboard.sales")} dot />
              <Line type="monotone" dataKey="revenue" stroke="#F0AD4E" name={t("dashboard.revenue")} dot />
              <Line type="monotone" dataKey="liters" stroke="#4A90E2" name={t("common.liter") ?? "L"} dot />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* ── Metric cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
        <MetricCard title={t("dashboard.todaySales")} value={stats.todaySales.toString()} icon={ShoppingCart} />
        <MetricCard title={t("dashboard.todayRevenue")} value={stats.todayRevenue.toFixed(2)} icon={ShoppingCart} prefix="zł" />
        <MetricCard title={t("dashboard.todayLiters") ?? "Litry dziś"} value={stats.todayLiters.toFixed(1)} icon={Droplets} suffix={t("common.liter")} />
        <MetricCard title={t("dashboard.currentSales")} value={stats.periodSales.toString()} icon={TrendingUp} />
        <MetricCard title={t("dashboard.currentRevenue")} value={stats.periodRevenue.toFixed(2)} icon={TrendingUp} prefix="zł" />
      </div>

      {/* ── Devices table ── */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
          {t("dashboard.equipmentSequence")}
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          {t("common.total")}: {devices.length} {t("common.records")}
        </p>
        <DataTable columns={equipmentColumns} data={tableData} />
      </div>

      {/* ── Summary tabs ── */}
      <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
        <div className="flex overflow-x-auto border-b border-gray-200 mb-4 -mx-1 px-1 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-shrink-0 px-3 md:px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? "border-b-2 border-[#4A90E2] text-[#4A90E2]"
                  : "text-gray-600 hover:text-gray-900"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-gray-700 space-y-2">
          {activeTab === "profit" && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{t("dashboard.currentRevenue")}</span>
                <span className="font-semibold text-sm">zł {stats.periodRevenue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 text-sm">{t("dashboard.todayRevenue")}</span>
                <span className="font-semibold text-sm">zł {stats.todayRevenue.toFixed(2)}</span>
              </div>
            </>
          )}
          {activeTab === "sales" && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{t("dashboard.currentSales")}</span>
                <span className="font-semibold text-sm">{stats.periodSales}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 text-sm">{t("dashboard.todaySales")}</span>
                <span className="font-semibold text-sm">{stats.todaySales}</span>
              </div>
            </>
          )}
          {activeTab === "exchange" && (
            <>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{t("common.online")}</span>
                <span className="font-semibold text-sm text-green-600">{deviceStats.online}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">{t("common.offline")}</span>
                <span className="font-semibold text-sm text-red-500">{deviceStats.offline}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500 text-sm">{t("common.total")}</span>
                <span className="font-semibold text-sm">{deviceStats.total}</span>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
}