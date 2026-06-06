/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLanguage } from "../contexts/LanguageContext";
import {
  TrendingUp,
  ShoppingCart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Droplets,
  CreditCard,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect, useCallback, useRef } from "react";
import { HappyTiService } from "../services/happyTiService";

// ─── Types ─────────────────────────────────────────────────────────────────

interface DashboardStats {
  periodSales: number;
  periodRevenue: number;
  periodLiters: number;
  periodCard: number;
  periodCash: number;
  periodQr: number;
  activeDevices: number;
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
  lastconnect?: string;     // ← Добавь эту строку
}

type ChartMode = "hourly" | "daily";

const MAX_DAYS = 90;
// ─── Date/Time Utilities ────────────────────────────────────────────────────

function todayWarsaw(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
}

function getWarsawOffsetMs(date: Date): number {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Warsaw",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  const warsawMs = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second")
  );
  return warsawMs - date.getTime();
}
function getOfflineMinutes(lastconnect?: string): number {
  if (!lastconnect) return 999;
  const chinaTime = new Date(lastconnect.replace(" ", "T") + "+08:00");
  const ms = Date.now() - chinaTime.getTime();
  return Math.max(0, ms / 1000 / 60);
}

function isDeviceOnline(device: DeviceItem): boolean {
  if (!device.lastconnect) return false;
  const minutesOffline = getOfflineMinutes(device.lastconnect);
  return minutesOffline <= 30;
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
  return `${u.getUTCFullYear()}-${pad(u.getUTCMonth() + 1)}-${pad(u.getUTCDate())} ${pad(
    u.getUTCHours()
  )}:${pad(u.getUTCMinutes())}:${pad(u.getUTCSeconds())}`;
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

function apiTimeToWarsawDayHour(apiTime: string): { date: string; hour: number } {
  const parts = apiTime.split(" ");
  if (parts.length < 2) return { date: apiTime.slice(0, 10), hour: 0 };
  const [datePart, timePart] = parts;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(
    new Date(utcMs)
  );
  const h = parseInt(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Warsaw",
      hour: "2-digit",
      hour12: false,
    }).format(new Date(utcMs)),
    10
  );
  return { date, hour: h };
}

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

// ─── Fetch helpers ──────────────────────────────────────────────────────────

async function fetchAllRecords(
  beginTime: string,
  endTime: string,
  signal?: AbortSignal
): Promise<any[]> {
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

function classifyPath(path: string): "card" | "cash" | "qr" {
  if (!path) return "qr";
  const p = path.toLowerCase();
  if (p.includes("card") || p.includes("卡")) return "card";
  if (p.includes("cash") || p.includes("coin") || p.includes("现金") || p.includes("投币"))
    return "cash";
  return "qr";
}

// ─── KPI Card ──────────────────────────────────────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  sub,
  color,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  trend?: "up" | "flat";
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-2 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>{icon}</div>
        {trend === "up" && <ArrowUpRight className="w-4 h-4 text-green-500" />}
        {trend === "flat" && <Minus className="w-4 h-4 text-gray-400" />}
      </div>
      <div>
        <p className="text-xs text-gray-400 leading-none mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────

function DonutChart({
  data,
  noDataLabel = "No data",
}: {
  data: { label: string; value: number; color: string }[];
  noDataLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0)
    return (
      <div className="flex items-center justify-center text-gray-300 text-xs py-4">
        {noDataLabel}
      </div>
    );

  let cumulative = 0;
  const radius = 40, cx = 60, cy = 60;

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arcPath(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} L ${cx} ${cy} Z`;
  }

  return (
    <div className="flex items-center gap-4">
      <svg width={120} height={120} viewBox="0 0 120 120">
        {data.map((d, i) => {
          const startAngle = (cumulative / total) * 360;
          cumulative += d.value;
          const endAngle = (cumulative / total) * 360;
          return (
            <path key={i} d={arcPath(cx, cy, radius, startAngle, endAngle)} fill={d.color} opacity={0.9} />
          );
        })}
        <circle cx={cx} cy={cy} r={24} fill="white" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="600" fill="#374151">
          {total}
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs min-w-0">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-500 truncate">{d.label}</span>
            <span className="ml-auto font-semibold text-gray-700 shrink-0">
              {d.value} ({((d.value / total) * 100).toFixed(0)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Card ──────────────────────────────────────────────────────────

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      </div>
      {children}
    </div>
  );
}

// ─── Mini Calendar ─────────────────────────────────────────────────────────

function MiniCalendar({
  selected,
  onSelect,
  onClose,
  language,
  maxDate,
  minDate,
}: {
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
    new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, i, 1))
  );
  const dayNames = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2000, 0, 3 + i))
  );
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDow + 6) % 7;
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };
  const pad2 = (n: number) => String(n).padStart(2, "0");
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3 w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-gray-700 capitalize">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronRight className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
      </div>
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
            <button
              key={i}
              disabled={disabled}
              onClick={() => { onSelect(dateStr); onClose(); }}
              className={[
                "text-xs rounded-lg py-1.5 transition-colors font-medium w-full",
                isSelected ? "bg-[#4A90E2] text-white" : "",
                isToday && !isSelected ? "border border-[#4A90E2] text-[#4A90E2]" : "",
                !isSelected && !isToday && !disabled ? "text-gray-700 hover:bg-gray-100" : "",
                disabled ? "text-gray-300 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Date Range Picker ─────────────────────────────────────────────────────

function DateRangePicker({
  from,
  to,
  onChange,
  language,
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  language: string;
}) {
  const [openCal, setOpenCal] = useState<"from" | "to" | null>(null);
  const locale = language === "pl" ? "pl-PL" : language === "ru" ? "ru-RU" : "en-GB";
  const fmt = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-");
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(Number(y), Number(m) - 1, Number(d)));
  };

  useEffect(() => {
    if (!openCal) return;
    const handler = () => setOpenCal(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openCal]);

  const presets = [
    { label: "1d", days: 1 },
    { label: "3d", days: 3 },
    { label: "7d", days: 7 },
    { label: "14d", days: 14 },
    { label: "30d", days: 30 },
    { label: "90d", days: 90 },
  ];

  const applyPreset = (days: number) => {
    const today = todayWarsaw();
    const [y, m, d] = today.split("-").map(Number);
    const newFrom = new Date(Date.UTC(y, m - 1, d - days + 1)).toISOString().slice(0, 10);
    onChange(newFrom, today);
  };

  const activeDays = daysBetween(from, to);

  const [ty, tm, td] = to.split("-").map(Number);
  const minFrom = new Date(Date.UTC(ty, tm - 1, td - (MAX_DAYS - 1))).toISOString().slice(0, 10);
  const [fy, fm, fd] = from.split("-").map(Number);
  const maxTo = new Date(Date.UTC(fy, fm - 1, fd + (MAX_DAYS - 1))).toISOString().slice(0, 10);

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-1.5">
        {presets.map(({ label, days }) => (
          <button
            key={label}
            onClick={() => applyPreset(days)}
            className={[
              "flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors",
              activeDays === days
                ? "bg-[#4A90E2] border-[#4A90E2] text-white"
                : "border-gray-200 text-gray-600 hover:border-[#4A90E2] hover:text-[#4A90E2]",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 whitespace-nowrap">
          {activeDays}d
        </span>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenCal(openCal === "from" ? null : "from")}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#4A90E2] transition-colors shadow-sm"
          >
            <Calendar className="w-3 h-3 text-[#4A90E2] flex-shrink-0" />
            {fmt(from)}
          </button>
          {openCal === "from" && (
            <MiniCalendar
              selected={from}
              minDate={minFrom}
              maxDate={to}
              onSelect={(d) => { onChange(d, to < d ? d : to); }}
              onClose={() => setOpenCal(null)}
              language={language}
            />
          )}
        </div>

        <span className="text-gray-400 text-sm flex-shrink-0">—</span>

        <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenCal(openCal === "to" ? null : "to")}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 hover:border-[#4A90E2] transition-colors shadow-sm"
          >
            <Calendar className="w-3 h-3 text-[#4A90E2] flex-shrink-0" />
            {fmt(to)}
          </button>
          {openCal === "to" && (
            <MiniCalendar
              selected={to}
              minDate={from}
              maxDate={maxTo < todayWarsaw() ? maxTo : todayWarsaw()}
              onSelect={(d) => { onChange(from > d ? d : from, d); }}
              onClose={() => setOpenCal(null)}
              language={language}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────

export function Dashboard() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [chartMode, setChartMode] = useState<ChartMode>("hourly");

  const initTo = todayWarsaw();
  const initFrom = initTo;

  const [dateFrom, setDateFrom] = useState(initFrom);
  const [dateTo, setDateTo] = useState(initTo);

  const [stats, setStats] = useState<DashboardStats>({
    periodSales: 0,
    periodRevenue: 0,
    periodLiters: 0,
    periodCard: 0,
    periodCash: 0,
    periodQr: 0,
    activeDevices: 0,
  });
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    online: 0,
    offline: 0,
    total: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recordCount, setRecordCount] = useState(0);

  const rawRecordsRef = useRef<any[]>([]);
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
      const online = allDevices.filter(isDeviceOnline).length;
      setDeviceStats({ online, offline: allDevices.length - online, total: allDevices.length });
      setStats((prev) => ({ ...prev, activeDevices: online }));
    } catch (err) {
      console.error(err);
    }
  };

  const prepareChartData = (records: any[], from: string, to: string, mode: ChartMode) => {
    const days: string[] = [];
    const [fy, fm, fd] = from.split("-").map(Number);
    const [ty2, tm2, td2] = to.split("-").map(Number);
    const start = new Date(Date.UTC(fy, fm - 1, fd));
    const end = new Date(Date.UTC(ty2, tm2 - 1, td2));
    for (let cur = new Date(start); cur <= end; cur.setUTCDate(cur.getUTCDate() + 1))
      days.push(cur.toISOString().slice(0, 10));

    if (mode === "hourly") {
      const buckets: Record<string, { sales: number; revenue: number; liters: number }> = {};
      for (const day of days) {
        for (let h = 0; h < 24; h++) {
          buckets[`${day}|${h}`] = { sales: 0, revenue: 0, liters: 0 };
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
          const label = multiDay
            ? `${dd}.${mm} ${hourStr.padStart(2, "0")}:00`
            : `${hourStr.padStart(2, "0")}:00`;
          return {
            date: label,
            sales: v.sales,
            revenue: Math.round(v.revenue * 100) / 100,
            liters: Math.round(v.liters * 10) / 10,
          };
        })
      );
    } else {
      setChartData(
        days.map((day) => {
          const dayRecs = records.filter((r) => apiTimeToWarsawDate(r.time) === day);
          const [, mm, dd] = day.split("-");
          return {
            date: `${dd}.${mm}`,
            sales: dayRecs.length,
            revenue:
              Math.round(
                dayRecs.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0) * 100
              ) / 100,
            liters:
              Math.round(
                dayRecs.reduce(
                  (s, r) => s + parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0"),
                  0
                ) * 10
              ) / 10,
          };
        })
      );
    }
  };

  const computeStats = (allRecords: any[]) => {
    const periodSales = allRecords.length;
    const periodRevenue = allRecords.reduce(
      (s, r) => s + parseFloat(r.cost_value || r.value || "0"),
      0
    );
    const periodLiters = allRecords.reduce(
      (s, r) => s + parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0"),
      0
    );

    let periodCard = 0, periodCash = 0, periodQr = 0;
    for (const r of allRecords) {
      const type = classifyPath(r.path || "");
      if (type === "card") periodCard++;
      else if (type === "cash") periodCash++;
      else periodQr++;
    }

    setStats((prev) => ({
      ...prev,
      periodSales,
      periodRevenue: Math.round(periodRevenue * 100) / 100,
      periodLiters: Math.round(periodLiters * 10) / 10,
      periodCard,
      periodCash,
      periodQr,
    }));
  };

  const loadRecords = useCallback(
    async (from: string, to: string, mode: ChartMode) => {
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setRecordsLoading(true);
      try {
        const beginTime = toApiDate(dayStartWarsaw(from));
        const endTime = toApiDate(dayEndWarsaw(to));
        const allRecords = await fetchAllRecords(beginTime, endTime, controller.signal);

        rawRecordsRef.current = allRecords;
        setRecordCount(allRecords.length);
        computeStats(allRecords);
        prepareChartData(allRecords, from, to, mode);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error(err);
      } finally {
        setRecordsLoading(false);
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadDevices(), loadRecords(initFrom, initTo, chartMode)]);
      setLoading(false);
    };
    init();
    return () => { abortRef.current?.abort(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (from: string, to: string) => {
    const clamped = clampFrom(from, to);
    setDateFrom(clamped);
    setDateTo(to);
    loadRecords(clamped, to, chartMode);
  };

  const handleChartModeChange = (mode: ChartMode) => {
    setChartMode(mode);
    prepareChartData(rawRecordsRef.current, dateFrom, dateTo, mode);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  const numDays = daysBetween(dateFrom, dateTo);
  const L = t("common.liter") ?? "L";

  // Payment donut data
  const donutData = [
    { label: t("dashboard.periodCard") ?? "IC Card", value: stats.periodCard, color: "#9B59B6" },
    { label: t("dashboard.periodCash") ?? "Cash", value: stats.periodCash, color: "#F5A623" },
    { label: t("dashboard.periodQr") ?? "QR", value: stats.periodQr, color: "#7ED321" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-4 md:space-y-6">

      {/* ── Chart block ── */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-6">

        {/* Header row */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base md:text-xl font-semibold text-gray-900">
                {t("dashboard.subscriptionData")}
              </h2>
          
            </div>
            <button
              onClick={() => loadRecords(dateFrom, dateTo, chartMode)}
              disabled={recordsLoading}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex-shrink-0 mt-0.5"
            >
              <RefreshCw
                className={`w-4 h-4 text-gray-400 ${recordsLoading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onChange={handleDateChange}
            language={language}
          />
        </div>

        {/* Chart mode toggle */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs">
            {(["hourly", "daily"] as ChartMode[]).map((mode) => (
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
                {mode === "hourly"
                  ? t("dashboard.hourly") ?? "По часам"
                  : t("dashboard.daily") ?? "По дням"}
              </button>
            ))}
          </div>
          {recordsLoading && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-3 h-3 border-2 border-gray-200 border-t-blue-400 rounded-full animate-spin" />
              <span className="hidden sm:inline">
                {t("vendingMachines.analyticsLoadingData") ?? "Loading…"}
              </span>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="h-[200px] sm:h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === "hourly" ? (
              <BarChart
                data={chartData}
                barGap={1}
                barCategoryGap={numDays > 1 ? "5%" : "15%"}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 9 }}
                  interval={numDays === 1 ? 2 : Math.ceil(chartData.length / 24) * 3 - 1}
                  angle={numDays > 1 ? -30 : 0}
                  textAnchor={numDays > 1 ? "end" : "middle"}
                  height={numDays > 1 ? 40 : 20}
                />
                <YAxis tick={{ fontSize: 10 }} width={30} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="sales" fill="#5CB85C" name={t("dashboard.sales")} radius={[2, 2, 0, 0]} />
                <Bar dataKey="revenue" fill="#F0AD4E" name={t("dashboard.revenue")} radius={[2, 2, 0, 0]} />
                <Bar dataKey="liters" fill="#4A90E2" name={L} radius={[2, 2, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} width={30} />
                <Tooltip contentStyle={{ fontSize: 11 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="sales" stroke="#5CB85C" name={t("dashboard.sales")} dot />
                <Line type="monotone" dataKey="revenue" stroke="#F0AD4E" name={t("dashboard.revenue")} dot />
                <Line type="monotone" dataKey="liters" stroke="#4A90E2" name={L} dot />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── PERIOD KPI metrics ── */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-0.5">
          {t("dashboard.periodStats")} ({numDays}d)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <KpiCard
            icon={<ShoppingCart className="w-4 h-4 text-green-600" />}
            label={t("dashboard.currentSales") ?? "Продажи"}
            value={stats.periodSales.toString()}
            color="bg-green-50"
            trend={stats.periodSales > 0 ? "up" : "flat"}
          />
          <KpiCard
            icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
            label={t("dashboard.currentRevenue") ?? "Выручка"}
            value={`${stats.periodRevenue.toFixed(2)} zł`}
            color="bg-blue-50"
            trend={stats.periodRevenue > 0 ? "up" : "flat"}
          />
          <KpiCard
            icon={<Droplets className="w-4 h-4 text-cyan-600" />}
            label={t("dashboard.periodLiters") ?? "Литры"}
            value={`${stats.periodLiters.toFixed(1)} ${L}`}
            color="bg-cyan-50"
          />
        </div>
      </div>

      {/* ── Payment breakdown donut ── */}
      <SectionCard
        title={t("dashboard.periodPayments") ?? t("vendingMachines.analyticsPaymentTypes") ?? "Типы оплат за период"}
        icon={<CreditCard className="w-4 h-4 text-purple-500" />}
      >
        <DonutChart
          data={donutData}
          noDataLabel={t("vendingMachines.analyticsNoData") ?? "Нет данных"}
        />
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
          {[
            { label: t("dashboard.periodCard") ?? "IC Card", desc: t("vendingMachines.analyticsCardDesc") ?? "path = shop / card" },
            { label: t("dashboard.periodCash") ?? "Cash", desc: t("vendingMachines.analyticsCashDesc") ?? "coins / other" },
            { label: t("dashboard.periodQr") ?? "QR", desc: t("vendingMachines.analyticsQrDesc") ?? "path contains «qr»" },
          ].map(({ label, desc }) => (
            <p key={label} className="text-xs text-gray-400">
              <span className="font-medium text-gray-600">{label}</span> — {desc}
            </p>
          ))}
        </div>
      </SectionCard>

      {/* ── Devices summary ── */}
      <SectionCard
        title={t("dashboard.devicesOnline") ?? "Устройства онлайн"}
        icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
      >
        <div className="flex gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{deviceStats.online}</p>
            <p className="text-xs text-gray-400">{t("common.online") ?? "Online"}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-400">{deviceStats.offline}</p>
            <p className="text-xs text-gray-400">{t("common.offline") ?? "Offline"}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-700">{deviceStats.total}</p>
            <p className="text-xs text-gray-400">{t("common.total") ?? "Total"}</p>
          </div>
        </div>
      </SectionCard>

    </div>
  );
}