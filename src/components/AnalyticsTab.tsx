/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useMemo, useRef } from "react";
import {
  TrendingUp,
  Droplets,
  CreditCard,
  Zap,
  BarChart2,
  RefreshCw,
  ArrowUpRight,
  Minus,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { HappyTiService } from "../services/happyTiService";
import { useLanguage } from "../contexts/LanguageContext";
import { formatDate } from "../utils/formatDate";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ConsumeRecord {
  key_id: string;
  card_num: string;
  shop_num: string;
  value: string;
  path: string;
  time: string;
  pay_id: string;
  location: string;
  after_value: string;
  cost_value: string;
  water1: string | number;
  water2: string | number;
}

interface CheckupRecord {
  water_meter: string;
  raw_water: string;
  sale_water: string;
  recovery_rate: string;
  ele_meter: string;
  use_ele: string;
  days: string;
  day_use_ele: string;
  operator: string;
  remark: string;
  create_time: string;
}

interface AnalyticsTabProps {
  deviceId: string;
  deviceLocation: string;
}

const PAGE_SIZE = 20;

// ─── Timezone Helpers ─────────────────────────────────────────────────────────

/** Текущая дата в Warsaw timezone → "YYYY-MM-DD" */
function todayWarsaw(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
}

/** Конвертирует время API (UTC+8) → реальный UTC → объект Date */
function toWarsawDate(str: string): Date {
  const parts = str.split(" ");
  if (parts.length < 2) return new Date(str);
  const [datePart, timePart] = parts;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;
  return new Date(utcMs);
}

function fmtApiDate(d: Date): string {
  // API ожидает UTC+8, добавляем 8 часов к UTC
  const utc8Ms = d.getTime() + 8 * 60 * 60 * 1000;
  const d8 = new Date(utc8Ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d8.getUTCFullYear()}-${pad(d8.getUTCMonth()+1)}-${pad(d8.getUTCDate())} ${pad(d8.getUTCHours())}:${pad(d8.getUTCMinutes())}:${pad(d8.getUTCSeconds())}`;
}
/** "YYYY-MM-DD" → начало дня 00:00:00 по Warsaw в UTC */
function dayStart(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  // Создаём полночь Warsaw как UTC: берём UTC полночь и корректируем на смещение Warsaw
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0)); // полдень UTC как ref
  const warsawOffset = getWarsawOffsetMs(approx);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - warsawOffset);
}

/** "YYYY-MM-DD" → конец дня 23:59:59 по Warsaw в UTC */
function dayEnd(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const warsawOffset = getWarsawOffsetMs(approx);
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59) - warsawOffset);
}

/** Смещение Warsaw relative to UTC в миллисекундах для заданного момента */
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


function groupByHour(
  records: { time: string; value: number }[]
): { label: string; value: number }[] {
  const map: Record<string, number> = {};
  records.forEach(({ time, value }) => {
    const d = toWarsawDate(time);
    const hour = new Intl.DateTimeFormat("en", {
      timeZone: "Europe/Warsaw",
      hour: "2-digit",
      hour12: false,
    }).format(d);
    const key = hour === "24" ? "00" : hour;
    map[key] = (map[key] || 0) + value;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([h, value]) => ({ label: `${h}:00`, value }));
}

function getPaymentType(record: ConsumeRecord, t: (key: string) => string): string {
  const payId = record.pay_id ?? "";
  const path = (record.path ?? "").toLowerCase();
  if (payId.endsWith("_pos")) return t("vendingMachines.analyticsTerminal");
  if (path.includes("qr")) return t("vendingMachines.analyticsQr");
  return t("vendingMachines.analyticsCash");
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({
  selected,
  onSelect,
  onClose,
  language

}: {
  selected: string;
  language: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}) {
  const today = todayWarsaw();
  const [viewYear, setViewYear] = useState(() => parseInt(selected.split("-")[0]));
  const [viewMonth, setViewMonth] = useState(() => parseInt(selected.split("-")[1]) - 1);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const startOffset = (firstDow + 6) % 7; // Monday-first

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const pad2 = (n: number) => String(n).padStart(2, "0");
// Внутри MiniCalendar, получить язык через useLanguage() или передать пропсом
const locale = language === "pl" ? "pl-PL" : language === "ru" ? "ru-RU" : "en-GB";

const monthNames = Array.from({ length: 12 }, (_, i) =>
  new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2000, i, 1))
);
const dayNames = Array.from({ length: 7 }, (_, i) =>
  new Intl.DateTimeFormat(locale, { weekday: "short" }).format(new Date(2000, 0, 3 + i)) // 3 jan 2000 = понедельник
);
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3 w-64"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded transition-colors">
          <ChevronLeft className="w-4 h-4 text-gray-500" />
        </button>
        <span className="text-sm font-semibold text-gray-700">
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
          return (
            <button
              key={i}
              disabled={isFuture}
              onClick={() => { onSelect(dateStr); onClose(); }}
              className={[
                "text-xs rounded-lg py-1.5 transition-colors font-medium w-full",
                isSelected ? "bg-[#4A90E2] text-white" : "",
                isToday && !isSelected ? "border border-[#4A90E2] text-[#4A90E2]" : "",
                !isSelected && !isToday && !isFuture ? "text-gray-700 hover:bg-gray-100" : "",
                isFuture ? "text-gray-300 cursor-not-allowed" : "",
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

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({
  data, color = "#4A90E2", height = 100, valueUnit = "", noDataLabel = "No data",
}: {
  data: { label: string; value: number }[];
  color?: string; height?: number; valueUnit?: string; noDataLabel?: string;
}) {
  if (!data.length)
    return (
      <div className="flex items-center justify-center text-gray-300 text-xs" style={{ height }}>
        {noDataLabel}
      </div>
    );

  const max = Math.max(...data.map((d) => d.value), 0.01);

  return (
    <div style={{ height }} className="flex flex-col">
      <div className="flex items-end gap-1 flex-1 min-h-0">
        {data.map(({ label, value }, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative h-full justify-end" style={{ minWidth: 0 }}>
            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {label}: {value.toFixed(2)}{valueUnit}
              </div>
              <div className="w-2 h-2 bg-gray-800 rotate-45" style={{ marginTop: -4 }} />
            </div>
            <div
              className="w-full rounded-t transition-all min-h-[3px]"
              style={{ height: `${Math.max((value / max) * 100, 3)}%`, backgroundColor: color, opacity: 0.85 }}
            />
          </div>
        ))}
      </div>
      <div className="flex mt-1">
        {data.map(({ label }, i) => (
          <div key={i} className="flex-1 text-center text-gray-400 overflow-hidden" style={{ fontSize: data.length > 10 ? 8 : 10 }}>
            {data.length <= 7 ? label : i % Math.ceil(data.length / 7) === 0 ? label : ""}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ data, noDataLabel = "No data" }: {
  data: { label: string; value: number; color: string }[];
  noDataLabel?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0)
    return <div className="flex items-center justify-center text-gray-300 text-xs py-4">{noDataLabel}</div>;

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
          return <path key={i} d={arcPath(cx, cy, radius, startAngle, endAngle)} fill={d.color} opacity={0.9} />;
        })}
        <circle cx={cx} cy={cy} r={24} fill="white" />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fontSize={10} fontWeight="600" fill="#374151">{total}</text>
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

// ─── Small UI components ──────────────────────────────────────────────────────

function KpiCard({ icon, label, value, sub, color, trend }: {
  icon: React.ReactNode; label: string; value: string;
  sub?: string; color: string; trend?: "up" | "flat";
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

function SectionCard({ title, icon, children }: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) {
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

function LoadingState({ pagesLoaded, loadingLabel, noteLabel, pagesLabel }: {
  pagesLoaded: number; loadingLabel: string; noteLabel: string; pagesLabel: string;
}) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{loadingLabel}</span>
          <span className="text-xs text-gray-400">{pagesLoaded} {pagesLabel}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#4A90E2] rounded-full animate-pulse" style={{ width: "60%" }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">{noteLabel}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
            <div className="w-8 h-8 bg-gray-100 rounded-lg mb-3" />
            <div className="h-3 bg-gray-100 rounded w-16 mb-2" />
            <div className="h-6 bg-gray-100 rounded w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AnalyticsTab({ deviceId }: AnalyticsTabProps) {
  const { t, language } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<string>(todayWarsaw());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [consumes, setConsumes] = useState<ConsumeRecord[]>([]);
  const [checkups, setCheckups] = useState<CheckupRecord[]>([]);

  const abortRef = useRef<AbortController | null>(null);

  // Человекочитаемое название выбранной даты
  const displayDate = useMemo(() => {
    const today = todayWarsaw();
    if (selectedDate === today) return "Сегодня";
    const d = new Date(selectedDate + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    const yesterday = d.toISOString().slice(0, 10);
    if (selectedDate === yesterday) return "Вчера";
    const [y, m, day] = selectedDate.split("-");
    return `${day}.${m}.${y}`;
  }, [selectedDate]);

  const load = async (dateStr: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setPagesLoaded(0);
    setConsumes([]);
    setCheckups([]);

    try {
      const begin = dayStart(dateStr);
      const end = dayEnd(dateStr);

      const [fetchedConsumes, checkupRes] = await Promise.all([
        fetchAllConsumesForDay(deviceId, begin, end, controller.signal, setPagesLoaded),
        HappyTiService.deviceCheckup({ deviceId, page: 1 }).catch(() => null),
      ]);

      if (controller.signal.aborted) return;
      setConsumes(fetchedConsumes);

      if (checkupRes) {
        const code = checkupRes.data.code ?? checkupRes.data.error;
        if (String(code) === "0") setCheckups(checkupRes.data.data ?? []);
      }
    } catch {
      // ignore
    } finally {
      if (!controller.signal.aborted) setIsLoading(false);
    }
  };

  useEffect(() => {
    load(selectedDate);
    return () => abortRef.current?.abort();
  }, [deviceId, selectedDate]);

  // Закрываем календарь кликом вне
  useEffect(() => {
    if (!calendarOpen) return;
    const handler = () => setCalendarOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [calendarOpen]);

  const goDay = (delta: number) => {
    const d = new Date(selectedDate + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() + delta);
    const next = d.toISOString().slice(0, 10);
    if (next <= todayWarsaw()) setSelectedDate(next);
  };

  // ── Stats ──────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    const totalRevenue = consumes.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0);
    const txCount = consumes.length;
    const avgTx = txCount > 0 ? totalRevenue / txCount : 0;
    const water1 = consumes.reduce((s, r) => s + parseFloat(String(r.water1 ?? "0")), 0);
    const water2 = consumes.reduce((s, r) => s + parseFloat(String(r.water2 ?? "0")), 0);

    const payTypes: Record<string, number> = {};
    consumes.forEach((r) => {
      const type = getPaymentType(r, t);
      payTypes[type] = (payTypes[type] || 0) + 1;
    });

    const revenueChart = groupByHour(consumes.map((r) => ({
      time: r.time, value: parseFloat(r.cost_value || r.value || "0"),
    })));
    const waterChart = groupByHour(consumes.map((r) => ({
      time: r.time,
      value: parseFloat(String(r.water1 ?? "0")) + parseFloat(String(r.water2 ?? "0")),
    })));

    return {
      totalRevenue, txCount, avgTx, water1, water2,
      totalWater: water1 + water2,
      payTypes, revenueChart, waterChart,
      latestCheckup: checkups[0] || null,
    };
  }, [consumes, checkups, t]);

  const terminalLabel = t("vendingMachines.analyticsTerminal");
  const qrLabel = t("vendingMachines.analyticsQr");
  const cashLabel = t("vendingMachines.analyticsCash");
  const payTypeColors: Record<string, string> = {
    [terminalLabel]: "#4A90E2",
    [qrLabel]: "#7ED321",
    [cashLabel]: "#F5A623",
  };
  const donutData = Object.entries(stats.payTypes).map(([label, value]) => ({
    label, value, color: payTypeColors[label] || "#ccc",
  }));
  const noDataLabel = t("vendingMachines.analyticsNoData");

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Date picker row ── */}
      <div className="flex items-center justify-between">

        {/* Кнопка с датой + выпадающий календарь */}
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setCalendarOpen((v) => !v); }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#4A90E2]" />
            {displayDate}
            <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${calendarOpen ? "rotate-90" : ""}`} />
          </button>

          {calendarOpen && (
            <MiniCalendar
              selected={selectedDate}
              onSelect={setSelectedDate}
              onClose={() => setCalendarOpen(false)}
              language={language}  // добавить

            />
          )}
        </div>

        {/* Стрелки пред/след день + обновить */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => goDay(-1)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            title="Предыдущий день"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => goDay(1)}
            disabled={selectedDate >= todayWarsaw()}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
            title="Следующий день"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => load(selectedDate)}
            disabled={isLoading}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            title={t("common.search")}
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <LoadingState
          pagesLoaded={pagesLoaded}
          loadingLabel={t("vendingMachines.analyticsLoadingData")}
          noteLabel={t("vendingMachines.analyticsLoadingNote")}
          pagesLabel={t("vendingMachines.analyticsPages")}
        />
      )}

      {/* Data */}
      {!isLoading && (
        <>
          {stats.txCount === 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-700">
              {t("vendingMachines.analyticsNoTransactions")}
            </div>
          )}

          {/* Summary bar */}
          <div className="bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-3 text-xs text-gray-500 border border-gray-100">
            <span>
              {t("vendingMachines.analyticsLoadedRecords")}:{" "}
              <strong className="text-gray-700">{consumes.length}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span>{pagesLoaded} {t("vendingMachines.analyticsPages")}</span>
          </div>

          {/* KPI */}
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
              label={t("vendingMachines.analyticsRevenue")}
              value={`${stats.totalRevenue.toFixed(2)} zł`}
              sub={`${stats.txCount} ${t("vendingMachines.analyticsTransactions")}`}
              color="bg-blue-50"
              trend={stats.totalRevenue > 0 ? "up" : "flat"}
            />
            <KpiCard
              icon={<BarChart2 className="w-4 h-4 text-purple-600" />}
              label={t("vendingMachines.analyticsAvgTicket")}
              value={`${stats.avgTx.toFixed(2)} zł`}
              color="bg-purple-50"
            />
            <KpiCard
              icon={<Droplets className="w-4 h-4 text-cyan-600" />}
              label={t("vendingMachines.analyticsWaterVolume")}
              value={`${stats.totalWater.toFixed(1)} л`}
              sub={`${t("vendingMachines.analyticsPort1")}: ${stats.water1.toFixed(1)} / ${t("vendingMachines.analyticsPort2")}: ${stats.water2.toFixed(1)}`}
              color="bg-cyan-50"
            />
          </div>

          {/* Revenue Chart */}
          <SectionCard
            title={`${t("vendingMachines.analyticsRevenueChart")} ${t("vendingMachines.analyticsPerHour")}`}
            icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          >
            <BarChart data={stats.revenueChart} color="#4A90E2" height={110} valueUnit=" zł" noDataLabel={noDataLabel} />
          </SectionCard>

          {/* Water Chart */}
          <SectionCard
            title={`${t("vendingMachines.analyticsWaterChart")} ${t("vendingMachines.analyticsPerHour")} (л)`}
            icon={<Droplets className="w-4 h-4 text-cyan-500" />}
          >
            <BarChart data={stats.waterChart} color="#06B6D4" height={90} valueUnit=" л" noDataLabel={noDataLabel} />
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
              {[
                { label: t("vendingMachines.analyticsPort1"), val: stats.water1 },
                { label: t("vendingMachines.analyticsPort2"), val: stats.water2 },
                { label: t("vendingMachines.analyticsTotal"), val: stats.totalWater, cyan: true },
              ].map(({ label, val, cyan }, i, arr) => (
                <>
                  <div key={label} className="flex-1 text-center">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className={`text-sm font-bold ${cyan ? "text-cyan-600" : "text-gray-800"}`}>{val.toFixed(1)} л</p>
                  </div>
                  {i < arr.length - 1 && <div className="w-px bg-gray-100" />}
                </>
              ))}
            </div>
          </SectionCard>

          {/* Payment types */}
          <SectionCard
            title={t("vendingMachines.analyticsPaymentTypes")}
            icon={<CreditCard className="w-4 h-4 text-purple-500" />}
          >
            {donutData.length === 0
              ? <p className="text-xs text-gray-400 text-center py-4">{noDataLabel}</p>
              : <DonutChart data={donutData} noDataLabel={noDataLabel} />
            }
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
              {[
                { label: terminalLabel, desc: t("vendingMachines.analyticsTerminalDesc") },
                { label: qrLabel, desc: t("vendingMachines.analyticsQrDesc") },
                { label: cashLabel, desc: t("vendingMachines.analyticsCashDesc") },
              ].map(({ label, desc }) => (
                <p key={label} className="text-xs text-gray-400">
                  <span className="font-medium text-gray-600">{label}</span> — {desc}
                </p>
              ))}
            </div>
          </SectionCard>

          {/* Last Inspection */}
          {stats.latestCheckup && (
            <SectionCard
              title={t("vendingMachines.analyticsLastInspection")}
              icon={<Zap className="w-4 h-4 text-yellow-500" />}
            >
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { label: t("vendingMachines.analyticsWaterMeterLabel"), value: stats.latestCheckup.water_meter },
                  { label: t("vendingMachines.analyticsRecoveryRate"), value: stats.latestCheckup.recovery_rate },
                  { label: t("vendingMachines.analyticsRawWater"), value: `${stats.latestCheckup.raw_water} л` },
                  { label: t("vendingMachines.analyticsSaleWater"), value: `${stats.latestCheckup.sale_water} л` },
                  { label: t("vendingMachines.analyticsEleUsed"), value: `${stats.latestCheckup.use_ele} кВт·ч` },
                  { label: t("vendingMachines.analyticsDayEle"), value: `${stats.latestCheckup.day_use_ele} кВт·ч` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-1">
                    <span className="text-xs text-gray-400">{label}</span>
                    <span className="text-xs font-semibold text-gray-700">{value || "—"}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-right">
                {formatDate(stats.latestCheckup.create_time, language)}
              </p>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}

// ─── Fetch — все страницы без лимита ─────────────────────────────────────────

async function fetchAllConsumesForDay(
  deviceId: string,
  begin: Date,
  end: Date,
  signal: AbortSignal,
  onPageLoaded: (page: number) => void
): Promise<ConsumeRecord[]> {
  const collected: ConsumeRecord[] = [];

  for (let page = 1; ; page++) {
    if (signal.aborted) break;

    try {
      const res = await HappyTiService.recordList({
        page,
        beginTime: fmtApiDate(begin),
        endTime: fmtApiDate(end),
      });
      if (signal.aborted) break;

      onPageLoaded(page);

      const code = res.data.code ?? res.data.error;
      if (String(code) !== "0") break;

      const batch: ConsumeRecord[] = res.data.data ?? [];
      if (batch.length === 0) break; // данных больше нет

      collected.push(...batch.filter((r) => r.shop_num === deviceId));

      if (batch.length < PAGE_SIZE) break; // последняя страница
    } catch {
      if (signal.aborted) break;
      break;
    }
  }

  return collected;
}