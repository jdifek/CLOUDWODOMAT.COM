/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { DataTable } from "../../components/DataTable";
import { ActionButton } from "../../components/ActionButton";

import { useLanguage } from "../../contexts/LanguageContext";
import { translateStatusCn } from "../../utils/deviceStatus";
import { formatDate } from "../../utils/formatDate";
import {
  Signal,
  X,
  Thermometer,
  Droplets,
  Zap,
  ClipboardList,
  Receipt,
  BarChart2,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  WifiOff,
  CreditCard,
  RefreshCw,
  Lock,
  Unlock,
  TrendingUp,
  ShoppingCart,
  Banknote,
  QrCode,
  ArrowUpRight,
  Minus,
} from "lucide-react";
import { AnalyticsTab } from "../../components/AnalyticsTab";
import { HappyTiService } from "../../services/happyTiService";
import { credentialsService } from "../../services/credentialsService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DeviceListItem {
  id: string;
  location: string;
  create_time: string;
  is_online?: string;
  lastconnect: any;
  temp: any;
  is_onlie?: string;
}

interface DeviceExtra {
  support_dual_port: string;
  latitude: string;
  longitude: string;
  device_latitude: string;
  device_longitude: string;
}

interface DeviceDetail {
  id: string;
  saler: string;
  location: string;
  status_cn: string;
  pay_status: string;
  version: string | null;
  signal: string | number;
  temp: number;
  tds: string | number;
  lastconnect: string | null;
  limit: string | number;
  limit2: string | number;
  port_1_price: string | number;
  port_2_price: string | number;
  day_limit: string | number;
  flow_para: string | number;
  water_time: string | number;
  port2_waterlen: string | number;
  port2_water: string | number;
  price_time: string | number;
  price_1: string | number;
  water_1: string | number;
  price_2: string | number;
  water_2: string | number;
  temp_low: number;
  temp_high: number;
  temp_alert: number;
  light_on_time: string;
  light_off_time: string;
  O3ON_time: number;
  O3OFF_time: number;
  extra: DeviceExtra | string;
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
  water1: string;
  water2: string;
}

interface AddValueRecord {
  key_id: string;
  card_num: string;
  alipay_number: string;
  operater: string;
  value: string;
  value_afterdiscount: string;
  card_aftervalue: string;
  status: string;
  device: string;
  location: string;
  type: string;
  is_openapi: number;
  time: string;
}

interface CardRecord {
  index: string;
  number: string;
  value: string;
  cash: string;
  status: string;
  owner: string;
  owner_name: string;
  create_time: string;
  shopname: string | null;
  last_day: string;
  name: string;
}

interface TableRow {
  id: number;
  deviceId: string;
  lastconnect: any;
  temp: any;
  location: string;
  networkStatus: "online" | "offline";
  createdAt: string;
  raw: DeviceListItem;
}

// Order creation state
type OrderStatus = "idle" | "creating" | "polling" | "finished" | "failed" | "cancel" | "error";

interface OrderState {
  status: OrderStatus;
  orderId: string;
  message: string;
}

type ModalTab = "details" | "inspections" | "consumes" | "recharges" | "analytics" | "cards";
type DeviceType = "shop" | "shop_liquid" | "shop_happyfu" | "shop_water";

// ─── Date/Time Utilities ─────────────────────────────────────────────────────

function todayWarsaw(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
}

function subtractDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d - n)).toISOString().slice(0, 10);
}

function toWarsawDate(str: string): Date {
  const parts = str.split(" ");
  if (parts.length < 2) return new Date(str);
  const [datePart, timePart] = parts;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;
  return new Date(utcMs);
}

function apiTimeToWarsawDate(apiTime: string): string {
  const d = toWarsawDate(apiTime);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(d);
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
// Convert time string "HH:mm:ss" from UTC+8 to Warsaw
function timeUtc8ToWarsaw(timeStr: string): string {
  if (!timeStr) return timeStr;
  const [h, m, s] = timeStr.split(":").map(Number);
  const now = new Date();
  const utc8Date = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    h - 8, m, s ?? 0  // convert UTC+8 → UTC
  ));
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Warsaw",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(utc8Date);
  const get = (type: string) => parts.find(p => p.type === type)?.value ?? "00";
  return `${get("hour")}:${get("minute")}:${get("second")}`;
}

// Convert time string "HH:mm:ss" from Warsaw to UTC+8
function timeWarsawToUtc8(timeStr: string): string {
  if (!timeStr) return timeStr;
  const [h, m, s] = timeStr.split(":").map(Number);
  const now = new Date();
  // Approximate Warsaw offset
  const warsawOffset = getWarsawOffsetMs(now) / 3600000; // hours
  const utc8H = ((h - warsawOffset + 8) % 24 + 24) % 24;
  const pad = (n: number) => String(Math.round(n)).padStart(2, "0");
  return `${pad(utc8H)}:${pad(m)}:${pad(s ?? 0)}`;
}

function dayStart(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const offset = getWarsawOffsetMs(approx);
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0) - offset);
}

function dayEnd(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const approx = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const offset = getWarsawOffsetMs(approx);
  return new Date(Date.UTC(y, m - 1, d, 23, 59, 59) - offset);
}

function fmtApiDate(d: Date): string {
  const utc8Ms = d.getTime() + 8 * 60 * 60 * 1000;
  const d8 = new Date(utc8Ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d8.getUTCFullYear()}-${pad(d8.getUTCMonth() + 1)}-${pad(d8.getUTCDate())} ${pad(d8.getUTCHours())}:${pad(d8.getUTCMinutes())}:${pad(d8.getUTCSeconds())}`;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genOrderId(): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `manual_${ts}_${rand}`;
}

function getOfflineMinutes(lastconnect?: string): number {
  if (!lastconnect) return 0;
  const chinaTime = new Date(lastconnect.replace(" ", "T") + "+08:00");
  const ms = Date.now() - chinaTime.getTime();
  return Math.max(0, ms / 1000 / 60);
}

function getTempStatus(temp?: string): "hot" | "cold" | "normal" {
  const t = parseFloat(temp ?? "");
  if (isNaN(t)) return "normal";
  if (t >= 30) return "hot";
  if (t <= 5) return "cold";
  return "normal";
}

function classifyPath(path: string): "card" | "cash" | "qr" {
  if (!path) return "qr";
  const p = path.toLowerCase();
  if (p.includes("card") || p.includes("卡")) return "card";
  if (p.includes("cash") || p.includes("coin") || p.includes("现金") || p.includes("投币")) return "cash";
  return "qr";
}

// ─── Quick Metrics ────────────────────────────────────────────────────────────

interface QuickStats {
  todaySales: number;
  todayRevenue: number;
  todayLiters: number;
  todayCard: number;
  todayCash: number;
  todayQr: number;
  threeDayRevenue: number;
  threeDayLiters: number;
}

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
function isDeviceOnline(device: DeviceListItem): boolean {
  if (!device.lastconnect) return false;
  const minutesOffline = getOfflineMinutes(device.lastconnect);
  return minutesOffline <= 30;
}
function QuickMetrics({
  devices,
  t,
}: {
  devices: DeviceListItem[];
  t: (k: string) => string;
}) {
  const [stats, setStats] = useState<QuickStats | null>(null);
  const [loading, setLoading] = useState(true);
  const L = t("common.liter") ?? "L";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const today = todayWarsaw();
        const threeDayStart = subtractDays(today, 2);

        const beginToday = dayStart(today);
        const endToday = dayEnd(today);
        const beginThreeDay = dayStart(threeDayStart);

        const [todayRes, threeDayRes] = await Promise.all([
          fetchAllRecordsLocal(fmtApiDate(beginToday), fmtApiDate(endToday)),
          fetchAllRecordsLocal(fmtApiDate(beginThreeDay), fmtApiDate(endToday)),
        ]);

        const todaySales = todayRes.length;
        const todayRevenue = todayRes.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0);
        const todayLiters = todayRes.reduce((s, r) => s + parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0"), 0);

        let todayCard = 0, todayCash = 0, todayQr = 0, todayTerminal = 0;
        for (const r of todayRes) {
          if ((r.pay_id ?? "").endsWith("_pos")) { todayTerminal++; continue; }
          const type = classifyPath(r.path || "");
          if (type === "card") todayCard++;
          else if (type === "cash") todayCash++;
          else todayQr++;
        }

        const threeDayRevenue = threeDayRes.reduce((s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0);
        const threeDayLiters = threeDayRes.reduce((s, r) => s + parseFloat(r.water1 || "0") + parseFloat(r.water2 || "0"), 0);

        setStats({
          todaySales,
          todayRevenue: Math.round(todayRevenue * 100) / 100,
          todayLiters: Math.round(todayLiters * 10) / 10,
          todayCard,
          todayCash,
          todayQr,
          todayTerminal,
          threeDayRevenue: Math.round(threeDayRevenue * 100) / 100,
          threeDayLiters: Math.round(threeDayLiters * 10) / 10,
        });
      } catch (err) {
        console.error("QuickMetrics load failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const online = devices.filter(isDeviceOnline).length;
  return (
    <div className="space-y-3">
      {/* Device status row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">{t("common.online") ?? "Online"}</p>
          <p className="text-2xl font-bold text-green-600">{online}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">{t("common.offline") ?? "Offline"}</p>
          <p className="text-2xl font-bold text-gray-400">{devices.length - online}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">{t("common.total") ?? "Total"}</p>
          <p className="text-2xl font-bold text-gray-700">{devices.length}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="w-6 h-6 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : stats ? (
        <>
          {/* Today */}
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-0.5">
            {t("dashboard.today") ?? "Сегодня"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          
            <KpiCard
              icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
              label={t("dashboard.todayRevenue") ?? "Выручка (сег.)"}
              value={`${stats.todayRevenue.toFixed(2)} zł`}
              color="bg-blue-50"
              trend={stats.todayRevenue > 0 ? "up" : "flat"}
            />
            <KpiCard
              icon={<Droplets className="w-4 h-4 text-cyan-600" />}
              label={t("dashboard.todayLiters") ?? "Литры (сег.)"}
              value={`${stats.todayLiters.toFixed(1)} ${L}`}
              color="bg-cyan-50"
            />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 col-span-2 sm:col-span-3 lg:col-span-5">
  <p className="text-xs text-gray-400 mb-2">{t("dashboard.todayPayments") ?? "Типы оплат (сег.)"}</p>
  <div className="flex items-center gap-2 flex-wrap">
    {(() => {
      const total = stats.todayCard + stats.todayCash + stats.todayQr + stats.todayTerminal;
      const items = [
        { label: t("vendingMachines.analyticsCash"), value: stats.todayCash, color: "bg-yellow-500" },
        { label: t("vendingMachines.analyticsTerminal"), value: stats.todayTerminal, color: "bg-blue-500" },
        { label: t("vendingMachines.analyticsCard"), value: stats.todayCard, color: "bg-purple-500" },
        { label: t("vendingMachines.analyticsQr"), value: stats.todayQr, color: "bg-pink-500" },
      ];
      return items.map(({ label, value, color }) => (
        <div key={label} className="flex items-center gap-1.5 text-xs">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-gray-600 font-medium">{label}</span>
          <span className="text-gray-400">{value}</span>
          {total > 0 && (
            <span className="text-gray-300">({((value / total) * 100).toFixed(0)}%)</span>
          )}
        </div>
      ));
    })()}
  </div>
</div>
          </div>

          {/* Last 3 days */}
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-0.5">
            {t("dashboard.last3days") ?? "Последние 3 дня"}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard
              icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
              label={t("dashboard.threeDayRevenue") ?? "Выручка за 3 дня"}
              value={`${stats.threeDayRevenue.toFixed(2)} zł`}
              color="bg-blue-50"
              trend={stats.threeDayRevenue > 0 ? "up" : "flat"}
            />
            <KpiCard
              icon={<Droplets className="w-4 h-4 text-cyan-600" />}
              label={t("dashboard.threeDayLiters") ?? "Литры за 3 дня"}
              value={`${stats.threeDayLiters.toFixed(1)} ${L}`}
              color="bg-cyan-50"
            />
          </div>
        </>
      ) : null}
    </div>
  );
}

async function fetchAllRecordsLocal(beginTime: string, endTime: string): Promise<any[]> {
  const all: any[] = [];
  for (let page = 1; ; page++) {
    const res = await HappyTiService.recordList({ page, beginTime, endTime });
    if (res.data.code !== 0) break;
    const batch: any[] = res.data.data ?? [];
    all.push(...batch);
    if (batch.length < 20) break;
  }
  return all;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface VendingMachinesPageProps {
  deviceType: DeviceType;
  title: string;
}

// ─── Order Creation Form ──────────────────────────────────────────────────────

function CreateOrderForm({
  deviceId,
  deviceLocation,
  onSuccess,
  t,
}: {
  deviceId: string;
  deviceLocation: string;
  onSuccess: () => void;
  t: (key: string) => string;
}) {
  const [value, setValue] = useState("1.00");
  const [userId, setUserId] = useState("admin");
  const [orderState, setOrderState] = useState<OrderState>({
    status: "idle",
    orderId: "",
    message: "",
  });
  const [showForm, setShowForm] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  const stopPolling = () => {
    if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
  };

  const startPolling = (orderId: string) => {
    let attempts = 0;
    const maxAttempts = 20;
    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const res = await HappyTiService.tradeQuery({ deviceId, salerOrderId: orderId });
        const status = res.data?.data?.status;
        if (status === "finished") {
          stopPolling();
          setOrderState({ status: "finished", orderId, message: t("vendingMachines.createOrderStatusFinished") });
          onSuccess();
        } else if (status === "failed") {
          stopPolling();
          setOrderState({ status: "failed", orderId, message: t("vendingMachines.createOrderStatusFailed") });
        } else if (status === "cancel") {
          stopPolling();
          setOrderState({ status: "cancel", orderId, message: t("vendingMachines.createOrderStatusCancel") });
        } else if (attempts >= maxAttempts) {
          stopPolling();
          setOrderState({ status: "failed", orderId, message: t("vendingMachines.createOrderStatusFailed") });
        }
      } catch {
        if (attempts >= maxAttempts) {
          stopPolling();
          setOrderState({ status: "error", orderId, message: t("vendingMachines.createOrderError") });
        }
      }
    }, 3000);
  };

  const handleCreate = async () => {
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal < 0.1) return;
    const orderId = genOrderId();
    setOrderState({ status: "creating", orderId, message: "" });
    try {
      const res = await HappyTiService.qrCreate({ deviceId, value: numVal, userid: userId || "admin", location: deviceLocation, salerOrderId: orderId });
      const code = String(res.data?.code ?? "");
      if (code === "0") {
        setOrderState({ status: "polling", orderId, message: t("vendingMachines.createOrderSuccess") });
        startPolling(orderId);
      } else if (code === "1008") {
        const retryId = genOrderId();
        const retry = await HappyTiService.qrCreate({ deviceId, value: numVal, userid: userId || "admin", location: deviceLocation, salerOrderId: retryId });
        const retryCode = String(retry.data?.code ?? "");
        if (retryCode === "0") {
          setOrderState({ status: "polling", orderId: retryId, message: t("vendingMachines.createOrderSuccess") });
          startPolling(retryId);
        } else {
          setOrderState({ status: "error", orderId: retryId, message: t("vendingMachines.createOrderError") });
        }
      } else {
        setOrderState({ status: "error", orderId, message: `${t("vendingMachines.createOrderError")}: ${res.data?.msg || code}` });
      }
    } catch {
      setOrderState({ status: "error", orderId, message: t("vendingMachines.createOrderError") });
    }
  };

  const handleReset = () => {
    stopPolling();
    setOrderState({ status: "idle", orderId: "", message: "" });
  };

  return (
    <div className="mb-4">
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#3a7bc8] transition-colors mb-4"
        >
          <Plus className="w-4 h-4" />
          {t("vendingMachines.createOrder")}
        </button>
      )}
      {showForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-blue-800">{t("vendingMachines.createOrderTitle")}</h4>
            <button onClick={() => { setShowForm(false); handleReset(); }} className="text-blue-400 hover:text-blue-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          {(orderState.status === "idle" || orderState.status === "error") && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">{t("vendingMachines.createOrderValue")}</label>
                  <input type="number" min="0.1" step="0.1" value={value} onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="1.00" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-blue-700 mb-1">{t("vendingMachines.createOrderUserId")}</label>
                  <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" placeholder="admin" />
                </div>
              </div>
              {orderState.status === "error" && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <XCircle className="w-4 h-4 shrink-0" />{orderState.message}
                </div>
              )}
              <button onClick={handleCreate} className="w-full py-2 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#3a7bc8] transition-colors">
                {t("vendingMachines.createOrderSubmit")}
              </button>
            </div>
          )}
          {orderState.status === "creating" && (
            <div className="flex items-center gap-3 py-2">
              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
              <span className="text-sm text-blue-700">{t("vendingMachines.createOrderCreating")}</span>
            </div>
          )}
          {orderState.status === "polling" && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 py-1">
                <Clock className="w-5 h-5 text-blue-500 mt-0.5 shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm text-blue-700">{orderState.message}</p>
                  <p className="text-xs text-blue-400 mt-0.5">{t("vendingMachines.createOrderOrderId")}: {orderState.orderId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-blue-500">
                <Loader2 className="w-3 h-3 animate-spin" />{t("vendingMachines.createOrderStatusWaiting")}
              </div>
            </div>
          )}
          {orderState.status === "finished" && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 py-1">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-green-700 font-medium">{orderState.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t("vendingMachines.createOrderOrderId")}: {orderState.orderId}</p>
                </div>
              </div>
              <button onClick={handleReset} className="text-xs text-blue-500 hover:text-blue-700 underline">
                {t("vendingMachines.createOrder")} →
              </button>
            </div>
          )}
          {(orderState.status === "failed" || orderState.status === "cancel") && (
            <div className="space-y-2">
              <div className="flex items-start gap-3 py-1">
                <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-red-600 font-medium">{orderState.message}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t("vendingMachines.createOrderOrderId")}: {orderState.orderId}</p>
                </div>
              </div>
              <button onClick={handleReset} className="text-xs text-blue-500 hover:text-blue-700 underline">
                ← {t("vendingMachines.createOrder")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EditableRow({
  label, value, onChange, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-0.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-white" />
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function VendingMachinesPage({ deviceType, title }: VendingMachinesPageProps) {
  const { t, language } = useLanguage();

  const [devices, setDevices] = useState<DeviceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [consumesPage, setConsumesPage] = useState(1);
  const [editForm, setEditForm] = useState<Record<string, string>>({});
  const [editSaving, setEditSaving] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [consumesHasMore, setConsumesHasMore] = useState(false);
  const [consumesLoadingMore, setConsumesLoadingMore] = useState(false);

  const loadMoreConsumes = async (deviceId: string) => {
    setConsumesLoadingMore(true);
    const nextPage = consumesPage + 1;
    try {
      const res = await HappyTiService.recordList({ page: nextPage });
      if (res.data.code === 0) {
        const batch = res.data.data ?? [];
        const filtered = batch.filter((r) => r.shop_num === deviceId);
        setConsumes((prev) => [...prev, ...filtered]);
        setConsumesPage(nextPage);
        setConsumesHasMore(batch.length === 20);
      }
    } catch (err) {
      console.error("Load more consumes failed:", err);
    } finally {
      setConsumesLoadingMore(false);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("analytics");
  const [detailLoading, setDetailLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<DeviceDetail | null>(null);
  const [checkups, setCheckups] = useState<CheckupRecord[]>([]);
  const [checkupsLoading, setCheckupsLoading] = useState(false);
  const [consumes, setConsumes] = useState<ConsumeRecord[]>([]);
  const [consumesLoading, setConsumesLoading] = useState(false);
  const [recharges, setRecharges] = useState<AddValueRecord[]>([]);
  const [rechargesLoading, setRechargesLoading] = useState(false);
  const [cards, setCards] = useState<CardRecord[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [cardsPage, setCardsPage] = useState(1);
  const [cardsHasMore, setCardsHasMore] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState<CardRecord | null>(null);
  const [rechargeForm, setRechargeForm] = useState({ value: "", income: "" });
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [openCardForm, setOpenCardForm] = useState({ number: "", totalNumber: "1" });
  const [showOpenCardForm, setShowOpenCardForm] = useState(false);
  const [openCardLoading, setOpenCardLoading] = useState(false);

  // ─── Data Fetching ──────────────────────────────────────────────────────────

  const fetchDevices = useCallback(
    async (pageNum: number, append = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);
        const response = await HappyTiService.deviceList({ type: deviceType, page: pageNum });
        if (response.data.code === 0) {
          const list: DeviceListItem[] = response.data.data.map((item: any) => ({
            id: item.id,
            location: item.location,
            create_time: item.create_time,
            is_online: item.is_online,
            lastconnect: item.lastconnect || null,
            temp: item.temp || null,
            is_onlie: item.is_onlie,
          }));
          setDevices((prev) => (append ? [...prev, ...list] : list));
          setHasMore(list.length === 20);
        }
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [deviceType]
  );

  useEffect(() => {
    setDevices([]);
    setPage(1);
    setHasMore(true);
    fetchDevices(1, false);
  }, [fetchDevices]);

  const handleLoadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchDevices(next, true);
  };

  const openModal = async (device: DeviceListItem) => {
    setModalOpen(true);
    setActiveTab("analytics");
    setSelectedDetail(null);
    setCheckups([]);
    setConsumes([]);
    setRecharges([]);
    setDetailLoading(true);
    try {
      const res = await HappyTiService.deviceDetail({ deviceId: device.id });
      if (res.data.code === 0) {
        const d = res.data.data as any;
        setSelectedDetail(d);
        setEditForm({
          location: d.location ?? "",
          day_limit: String(d.day_limit ?? ""),
          limit: String(d.limit ?? ""),
          temp_low: String(d.temp_low ?? ""),
          temp_high: String(d.temp_high ?? ""),
          temp_alert: String(d.temp_alert ?? ""),
          light_on_time: timeUtc8ToWarsaw(d.light_on_time ?? ""),
          light_off_time: timeUtc8ToWarsaw(d.light_off_time ?? ""),
          O3ON_time: String(d.O3ON_time ?? ""),
          O3OFF_time: String(d.O3OFF_time ?? ""),
        });
      }
    } catch (err) {
      console.error("Detail fetch failed:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadCheckups = async (deviceId: string) => {
    if (checkups.length > 0) return;
    setCheckupsLoading(true);
    try {
      const res = await HappyTiService.deviceCheckup({ deviceId, page: 1 });
      if (res.data.code === 0) setCheckups(res.data.data);
    } catch (err) {
      console.error("Checkup fetch failed:", err);
    } finally {
      setCheckupsLoading(false);
    }
  };

  const loadConsumes = async (deviceId: string) => {
    if (consumes.length > 0) return;
    setConsumesLoading(true);
    setConsumesPage(1);
    try {
      const res = await HappyTiService.recordList({ page: 1 });
      if (res.data.code === 0) {
        const batch = res.data.data ?? [];
        const filtered = batch.filter((r) => r.shop_num === deviceId);
        setConsumes(filtered);
        setConsumesHasMore(batch.length === 20);
      }
    } catch (err) {
      console.error("Consumes fetch failed:", err);
    } finally {
      setConsumesLoading(false);
    }
  };

  const loadRecharges = async (deviceId: string) => {
    setRechargesLoading(true);
    try {
      const res = await HappyTiService.addValueList({ page: 1 });
      if (res.data.code === 0) {
        const filtered = res.data.data.filter((r) => r.device === deviceId);
        setRecharges(filtered.length > 0 ? filtered : res.data.data.slice(0, 20));
      }
    } catch (err) {
      console.error("Recharges fetch failed:", err);
    } finally {
      setRechargesLoading(false);
    }
  };

  const saveDeviceParams = async () => {
    if (!selectedDetail) return;
    setEditSaving(true);
    setEditSuccess(false);
    try {
      await HappyTiService.editShopParams({
        deviceId: selectedDetail.id,
        location: editForm.location ?? selectedDetail.location,
        light_on_time: timeWarsawToUtc8(editForm.light_on_time ?? selectedDetail.light_on_time),
        light_off_time: timeWarsawToUtc8(editForm.light_off_time ?? selectedDetail.light_off_time),
        O3_on_time: Number(editForm.O3ON_time ?? selectedDetail.O3ON_time),
        O3_off_time: Number(editForm.O3OFF_time ?? selectedDetail.O3OFF_time),
        temp_low: Number(editForm.temp_low ?? selectedDetail.temp_low),
        temp_high: Number(editForm.temp_high ?? selectedDetail.temp_high),
        day_limit: Number(editForm.day_limit ?? selectedDetail.day_limit),
        limit: Number(editForm.limit ?? selectedDetail.limit),
        temp_alert: Number(editForm.temp_alert ?? selectedDetail.temp_alert),
      });
      setEditSuccess(true);
      setSelectedDetail(prev => prev ? {
        ...prev,
        location: editForm.location ?? prev.location,
        light_on_time: editForm.light_on_time ?? prev.light_on_time,
        light_off_time: editForm.light_off_time ?? prev.light_off_time,
        O3ON_time: Number(editForm.O3ON_time ?? prev.O3ON_time),
        O3OFF_time: Number(editForm.O3OFF_time ?? prev.O3OFF_time),
        temp_low: Number(editForm.temp_low ?? prev.temp_low),
        temp_high: Number(editForm.temp_high ?? prev.temp_high),
        day_limit: Number(editForm.day_limit ?? prev.day_limit),
        limit: Number(editForm.limit ?? prev.limit),
        temp_alert: Number(editForm.temp_alert ?? prev.temp_alert),
      } : prev);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (err) {
      console.error("Save params failed:", err);
    } finally {
      setEditSaving(false);
    }
  };

  const loadCards = async (p = 1, append = false) => {
    if (!append) setCardsLoading(true);
    try {
      const res = await HappyTiService.cardList({ page: p });
      if (res.data.code === 0) {
        const batch: CardRecord[] = res.data.data ?? [];
        setCards(prev => append ? [...prev, ...batch] : batch);
        setCardsPage(p);
        setCardsHasMore(batch.length === 20);
      }
    } catch (err) {
      console.error("Cards fetch failed:", err);
    } finally {
      setCardsLoading(false);
    }
  };

  const handleCardRecharge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRechargeModal) return;
    setRechargeLoading(true);
    try {
      await HappyTiService.cardRecharge({
        card: showRechargeModal.number,
        value: parseFloat(rechargeForm.value),
        income: parseFloat(rechargeForm.income),
        trad_id: `recharge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      });
      setShowRechargeModal(null);
      setRechargeForm({ value: "", income: "" });
      setCards([]);
      loadCards(1);
    } catch (err) {
      console.error("Recharge failed:", err);
    } finally {
      setRechargeLoading(false);
    }
  };

  const handleLossReport = async (card: CardRecord, action: "normal" | "lost") => {
    try {
      await HappyTiService.cardLossReport({ card: card.number, action });
      setCards([]);
      loadCards(1);
    } catch (err) {
      console.error("Loss report failed:", err);
    }
  };

  const handleOpenCards = async (e: React.FormEvent) => {
    e.preventDefault();
    setOpenCardLoading(true);
    try {
      await HappyTiService.cardOpen({
        number: openCardForm.number,
        userid: credentialsService.get()?.saler ?? "",
        totalNumber: openCardForm.totalNumber ? Number(openCardForm.totalNumber) : undefined,
      });
      setShowOpenCardForm(false);
      setOpenCardForm({ number: "", totalNumber: "1" });
      setCards([]);
      loadCards(1);
    } catch (err) {
      console.error("Open cards failed:", err);
    } finally {
      setOpenCardLoading(false);
    }
  };

  const handleTabChange = (tab: ModalTab) => {
    setActiveTab(tab);
    if (!selectedDetail) return;
    if (tab === "inspections") loadCheckups(selectedDetail.id);
    if (tab === "consumes") loadConsumes(selectedDetail.id);
    if (tab === "recharges") {
      setRecharges([]);
      loadRecharges(selectedDetail.id);
    }
    if (tab === "cards") {
      setCards([]);
      loadCards(1);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDetail(null);
    setEditForm({});
    setEditSuccess(false);
    setCheckups([]);
    setConsumes([]);
    setRecharges([]);
    setCards([]);
    setCardsPage(1);
    setCardsHasMore(false);
    setConsumesPage(1);
    setConsumesHasMore(false);
    setShowRechargeModal(null);
    setShowOpenCardForm(false);
  };

  // ─── Table Data ─────────────────────────────────────────────────────────────

  const tableData: TableRow[] = devices.map((device, index) => {
    const isOnline = isDeviceOnline(device);
        return {
      id: index + 1,
      deviceId: device.id,
      location: device.location || "—",
      networkStatus: (isOnline ? "online" : "offline") as "online" | "offline",
      createdAt: device.create_time,
      lastconnect: device.lastconnect,
      temp: device.temp,
      raw: device,
    };
  });

  const columns = [
    { key: "id", label: "№" },
    { key: "location", label: t("equipment.territory") },
    {
      key: "operations",
      label: t("common.operations"),
      render: (_: any, row: TableRow) => (
        <ActionButton size="sm" variant="primary" onClick={() => openModal(row.raw)}>
          {t("common.details")}
        </ActionButton>
      ),
    },
    {
      key: "temp",
      label: t("equipment.temperature"),
      render: (_: any, row: TableRow) => {
        const status = getTempStatus(row.temp);
        const styles = {
          hot: "bg-red-100 text-red-700 border border-red-300",
          cold: "bg-blue-100 text-blue-700 border border-blue-200",
          normal: "text-gray-600",
        };
        return row.temp ? (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${styles[status]}`}>
            <Thermometer className="w-3 h-3" />
            {parseFloat(row.temp).toFixed(1)}°C
          </span>
        ) : <span className="text-gray-400">—</span>;
      },
    },
    {
      key: "lastconnect",
      label: t("equipment.lastConnection"),
      render: (_: any, row: TableRow) => {
        const minutes = getOfflineMinutes(row.lastconnect);
        const isStale = row.networkStatus === "offline" && minutes > 60;
        const timeStr = !row.lastconnect ? "—"
        : minutes < 60 ? `${Math.round(minutes)} ${t("common.minAgo")}`
: `${Math.floor(minutes / 60)} ${t("common.hAgo")} ${Math.round(minutes % 60)} ${t("common.minAgo")}`;
        return (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1 ${isStale ? "bg-orange-100 text-orange-700 border border-orange-300" : "text-gray-500"}`}>
            {isStale && <WifiOff className="w-3 h-3" />}
            {timeStr}
          </span>
        );
      },
    },
  ];

  // ─── Render ──────────────────────────────────────────────────────────────────

  const extra = selectedDetail?.extra && typeof selectedDetail.extra !== "string"
    ? (selectedDetail.extra as DeviceExtra)
    : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

      {/* ── Quick Metrics: today + 3 days ── */}
      <QuickMetrics devices={devices} t={t} />

      {/* ── Device Table ── */}
      {loading ? (
        <div className="flex justify-center items-center p-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <DataTable
            rowClassName={(row: TableRow) => {
              const minutes = getOfflineMinutes(row.lastconnect);
              const stale = row.networkStatus === "offline" && minutes > 60;
              const tempStatus = getTempStatus(row.temp);
              if (stale) return "bg-orange-50 border-l-4 border-l-orange-400";
              if (tempStatus === "hot") return "bg-red-50 border-l-4 border-l-red-400";
              if (tempStatus === "cold") return "bg-blue-50 border-l-4 border-l-blue-300";
              return "";
            }}
            columns={columns}
            data={tableData}
            currentPage={1}
            totalPages={1}
            totalRecords={tableData.length}
          />
          {hasMore && (
            <div className="flex justify-center pt-2">
              <ActionButton variant="secondary" onClick={handleLoadMore} disabled={loadingMore}>
                {loadingMore ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                ) : t("vendingMachines.loadMore")}
              </ActionButton>
            </div>
          )}
        </>
      )}

      {/* ─── Detail Modal ──────────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={closeModal}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 flex flex-col overflow-hidden"
            style={{ maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {t("common.details")}
                  {selectedDetail && (
                    <span className="ml-2 text-sm font-normal text-gray-500">{selectedDetail.id}</span>
                  )}
                </h2>
                {selectedDetail && (
                  <p className="text-sm text-gray-500 mt-0.5">{selectedDetail.location}</p>
                )}
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 shrink-0 overflow-x-auto">
              <TabBtn active={activeTab === "analytics"} onClick={() => handleTabChange("analytics")}
                icon={<BarChart2 className="w-4 h-4" />} label={t("vendingMachines.analytics")} />
              <TabBtn active={activeTab === "consumes"} onClick={() => handleTabChange("consumes")}
                icon={<Droplets className="w-4 h-4" />} label={t("vendingMachines.consumption")} />
              <TabBtn active={activeTab === "details"} onClick={() => handleTabChange("details")}
                icon={<Signal className="w-4 h-4" />} label={t("vendingMachines.detail")} />
              <TabBtn active={activeTab === "recharges"} onClick={() => handleTabChange("recharges")}
                icon={<Receipt className="w-4 h-4" />} label={t("vendingMachines.recharges")} />
              {/* <TabBtn active={activeTab === "inspections"} onClick={() => handleTabChange("inspections")}
                icon={<ClipboardList className="w-4 h-4" />} label={t("vendingMachines.inspections")} /> */}
              <TabBtn active={activeTab === "cards"} onClick={() => handleTabChange("cards")}
                icon={<CreditCard className="w-4 h-4" />} label={t("vendingMachines.cards")} />
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {detailLoading ? (
                <LoaderSpinner />
              ) : !selectedDetail ? (
                <div className="flex justify-center items-center py-12 text-red-500">
                  {t("vendingMachines.createOrderError")}
                </div>
              ) : activeTab === "details" ? (
                <div className="space-y-6">
                  <Section title={t("vendingMachines.statusSection")} icon={<Signal className="w-4 h-4 text-blue-500" />}>
                    <DetailRow label={t("common.status")} value={translateStatusCn(selectedDetail.status_cn, language)} />
                    <DetailRow label={t("vendingMachines.paymentStatus")} value={selectedDetail.pay_status} />
                    <DetailRow label={t("equipment.versionNumber")} value={selectedDetail.version ?? "—"} />
                    <DetailRow label={t("vendingMachines.seller")} value={selectedDetail.saler} />
                    <DetailRow label={t("equipment.lastConnection")} value={formatDate(selectedDetail.lastconnect, language)} />
                  </Section>

                  <Section title={t("vendingMachines.sensors")} icon={<Thermometer className="w-4 h-4 text-orange-500" />}>
                    <DetailRow label={t("equipment.temperature")} value={selectedDetail.temp != null ? (
                      <span className="flex items-center gap-1"><Thermometer className="w-4 h-4 text-blue-500" />{selectedDetail.temp}°C</span>
                    ) : "—"} />
                    <DetailRow label={t("equipment.signalStrength")} value={selectedDetail.signal ? (
                      <span className="flex items-center gap-1"><Signal className="w-4 h-4 text-green-500" />{selectedDetail.signal}</span>
                    ) : "—"} />
                    <DetailRow label={t("vendingMachines.tds")} value={selectedDetail.tds || "—"} />
                  </Section>

                  <Section title={t("vendingMachines.flowParams")} icon={<Zap className="w-4 h-4 text-yellow-500" />}>
                    <DetailRow label={t("vendingMachines.flowMeter")} value={selectedDetail.flow_para || "—"} />
                    <DetailRow label={t("vendingMachines.waterTimePort1")} value={selectedDetail.water_time != null ? `${selectedDetail.water_time}` : "—"} />
                    <DetailRow label={t("vendingMachines.waterTimeLiterPort2")} value={selectedDetail.port2_waterlen != null ? `${selectedDetail.port2_waterlen}` : "—"} />
                    <DetailRow label="price_time" value={selectedDetail.price_time || "—"} />
                    <DetailRow label={t("vendingMachines.port1Price")} value={selectedDetail.port_1_price ? `${selectedDetail.port_1_price} zł` : "—"} />
                    <DetailRow label={t("vendingMachines.port2Price")} value={selectedDetail.port_2_price ? `${selectedDetail.port_2_price} zł` : "—"} />
                    <DetailRow label="price_1 / water_1" value={`${selectedDetail.price_1 ?? "—"} / ${selectedDetail.water_1 ?? "—"}`} />
                    <DetailRow label="price_2 / water_2" value={`${selectedDetail.price_2 ?? "—"} / ${selectedDetail.water_2 ?? "—"}`} />
                  </Section>

                  <Section title={t("vendingMachines.pricesAndLimits")} icon={<Droplets className="w-4 h-4 text-cyan-500" />}>
                    <div className="py-2 space-y-3">
                      <EditableRow label={t("equipment.territory")} value={editForm.location ?? ""} onChange={v => setEditForm(f => ({ ...f, location: v }))} />
                      <div className="grid grid-cols-2 gap-3">
                        <EditableRow label={t("vendingMachines.dayLimit")} value={editForm.day_limit ?? ""} onChange={v => setEditForm(f => ({ ...f, day_limit: v }))} type="number" />
                        <EditableRow label={t("vendingMachines.txLimitPort1")} value={editForm.limit ?? ""} onChange={v => setEditForm(f => ({ ...f, limit: v }))} type="number" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <EditableRow label="Temp min (°C)" value={editForm.temp_low ?? ""} onChange={v => setEditForm(f => ({ ...f, temp_low: v }))} type="number" />
                        <EditableRow label="Temp max (°C)" value={editForm.temp_high ?? ""} onChange={v => setEditForm(f => ({ ...f, temp_high: v }))} type="number" />
                        <EditableRow label="Temp alert" value={editForm.temp_alert ?? ""} onChange={v => setEditForm(f => ({ ...f, temp_alert: v }))} type="number" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <EditableRow label="Light ON" value={editForm.light_on_time ?? ""} onChange={v => setEditForm(f => ({ ...f, light_on_time: v }))} placeholder="11:00:00" />
                        <EditableRow label="Light OFF" value={editForm.light_off_time ?? ""} onChange={v => setEditForm(f => ({ ...f, light_off_time: v }))} placeholder="07:00:00" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <EditableRow label="O3 ON (сек)" value={editForm.O3ON_time ?? ""} onChange={v => setEditForm(f => ({ ...f, O3ON_time: v }))} type="number" />
                        <EditableRow label="O3 OFF (сек)" value={editForm.O3OFF_time ?? ""} onChange={v => setEditForm(f => ({ ...f, O3OFF_time: v }))} type="number" />
                      </div>
                      <div className="flex items-center gap-3 pt-1">
                        <button onClick={saveDeviceParams} disabled={editSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#3a7bc8] transition-colors disabled:opacity-50">
                          {editSaving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> {t("vendingMachines.saving")}</>
                          ) : (t("common.edit") + " / " + t("common.confirm"))}
                        </button>
                        {editSuccess && (
                          <span className="text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> {t("common.confirm")}
                          </span>
                        )}
                      </div>
                    </div>
                  </Section>

                  {extra && (extra.latitude || extra.longitude) && (
                    <Section title={t("vendingMachines.geolocation")} icon={<Signal className="w-4 h-4 text-purple-500" />}>
                      <DetailRow label={t("vendingMachines.latGcj02")} value={extra.latitude || "—"} />
                      <DetailRow label={t("vendingMachines.lngGcj02")} value={extra.longitude || "—"} />
                      <DetailRow label={t("vendingMachines.latDevice")} value={extra.device_latitude || "—"} />
                      <DetailRow label={t("vendingMachines.lngDevice")} value={extra.device_longitude || "—"} />
                      <DetailRow label={t("vendingMachines.dualPort")} value={extra.support_dual_port === "1" ? t("vendingMachines.yes") : t("vendingMachines.no")} />
                    </Section>
                  )}
                </div>

              ) : activeTab === "inspections" ? (
                <div>
                  {checkupsLoading ? <LoaderSpinner /> : checkups.length === 0 ? (
                    <Empty text={t("vendingMachines.noInspections")} />
                  ) : (
                    <div className="space-y-4">
                      {checkups.map((rec, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-semibold text-gray-700">
                              {t("vendingMachines.inspectionNo")}{checkups.length - idx}
                            </span>
                            <span className="text-xs text-gray-400">{formatDate(rec.create_time, language)}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <MiniRow label={t("vendingMachines.waterMeter")} value={rec.water_meter} />
                            <MiniRow label={t("vendingMachines.rawWater")} value={rec.raw_water} />
                            <MiniRow label={t("vendingMachines.purifiedWater")} value={rec.sale_water} />
                            <MiniRow label={t("vendingMachines.recoveryRate")} value={rec.recovery_rate} />
                            <MiniRow label={t("vendingMachines.eleMeter")} value={rec.ele_meter} />
                            <MiniRow label={t("vendingMachines.eleUsed")} value={rec.use_ele} />
                            <MiniRow label={t("vendingMachines.intervalDays")} value={rec.days} />
                            <MiniRow label={t("vendingMachines.dayEleUsed")} value={rec.day_use_ele} />
                            {rec.operator && <MiniRow label={t("vendingMachines.inspector")} value={rec.operator} />}
                            {rec.remark && <MiniRow label={t("vendingMachines.note")} value={rec.remark} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              ) : activeTab === "consumes" ? (
                <div>
                  {consumesLoading ? <LoaderSpinner /> : consumes.length === 0 ? (
                    <Empty text={t("vendingMachines.noConsumption")} />
                  ) : (
                    <>
                      <div className="space-y-3">
                        {consumes.map((rec, idx) => {
                          const isTerminal = rec.pay_id?.endsWith("_pos");
                          const isCoin = rec.card_num === "coin";
                          const paymentType = isTerminal
                            ? t("vendingMachines.terminal")
                            : isCoin ? t("vendingMachines.cash")
                            : rec.card_num || "—";
                          return (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">#{rec.key_id}</span>
                                <span className="text-xs text-gray-400">{formatDate(rec.time, language)}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                <MiniRow label={t("vendingMachines.paymentType")} value={paymentType} />
                                <MiniRow label={t("vendingMachines.paymentId")} value={rec.pay_id?.replace("_pos", "") || "—"} />
                                <MiniRow label={t("vendingMachines.amount")} value={rec.value ? `${rec.value} zł` : "—"} />
                                <MiniRow label={t("vendingMachines.charged")} value={rec.cost_value ? `${rec.cost_value} zł` : "—"} />
                                <MiniRow label={t("vendingMachines.balanceAfter")} value={rec.after_value ? `${rec.after_value} zł` : "—"} />
                                <MiniRow label={t("vendingMachines.method")} value={rec.path || "—"} />
                                <MiniRow label={t("vendingMachines.waterPort1")} value={rec.water1 || "—"} />
                                <MiniRow label={t("vendingMachines.waterPort2")} value={rec.water2 || "—"} />
                                <MiniRow label={t("vendingMachines.address")} value={rec.location || "—"} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {consumesHasMore && selectedDetail && (
                        <div className="flex justify-center pt-4">
                          <button onClick={() => loadMoreConsumes(selectedDetail.id)} disabled={consumesLoadingMore}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A90E2] border border-[#4A90E2] rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50">
                            {consumesLoadingMore ? (
                              <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
                            ) : t("vendingMachines.loadMore")}
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

              ) : activeTab === "recharges" ? (
                <div>
                  <CreateOrderForm
                    deviceId={selectedDetail.id}
                    deviceLocation={selectedDetail.location}
                    t={t}
                    onSuccess={() => { setRecharges([]); loadRecharges(selectedDetail.id); }}
                  />
                  {rechargesLoading ? <LoaderSpinner /> : recharges.length === 0 ? (
                    <Empty text={t("vendingMachines.noRecharges")} />
                  ) : (
                    <div className="space-y-3">
                      {recharges.map((rec, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">#{rec.key_id}</span>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                rec.status === "success" || rec.status === "finished" ? "bg-green-100 text-green-700"
                                : rec.status === "refund" || rec.status === "refunding" ? "bg-yellow-100 text-yellow-700"
                                : rec.status === "failed" || rec.status === "cancel" ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-600"}`}>
                                {rec.status}
                              </span>
                              <span className="text-xs text-gray-400">{formatDate(rec.time, language)}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                            <MiniRow label={t("vendingMachines.cardNumber")} value={rec.card_num || "—"} />
                            <MiniRow label={t("vendingMachines.operator")} value={rec.operater || "—"} />
                            <MiniRow label={t("vendingMachines.amount")} value={rec.value ? `${rec.value} zł` : "—"} />
                            <MiniRow label={t("vendingMachines.credited")} value={rec.value_afterdiscount ? `${rec.value_afterdiscount} zł` : "—"} />
                            <MiniRow label={t("vendingMachines.balanceAfter")} value={rec.card_aftervalue ? `${rec.card_aftervalue} zł` : "—"} />
                            <MiniRow label={t("vendingMachines.type")} value={rec.type || "—"} />
                            <MiniRow label={t("vendingMachines.viaOpenApi")} value={rec.is_openapi === 1 ? t("vendingMachines.yes") : t("vendingMachines.no")} />
                            <MiniRow label={t("vendingMachines.paymentNumber")} value={rec.alipay_number || "—"} />
                            <MiniRow label={t("vendingMachines.address")} value={rec.location || "—"} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              ) : activeTab === "cards" ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#4A90E2]" />
                      {t("vendingMachines.cards")}
                    </span>
                    <button onClick={() => setShowOpenCardForm(v => !v)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#4A90E2] text-white text-xs font-medium rounded-lg hover:bg-[#3a7bc8] transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      {t("vendingMachines.openCards")}
                    </button>
                  </div>

                  {showOpenCardForm && (
                    <form onSubmit={handleOpenCards} className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">{t("vendingMachines.cardStartNumber")}</label>
                          <input type="text" required value={openCardForm.number} onChange={e => setOpenCardForm({ ...openCardForm, number: e.target.value })}
                            placeholder="10400040002" className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-blue-700 mb-1">{t("vendingMachines.cardCount")}</label>
                          <input type="number" min="1" value={openCardForm.totalNumber} onChange={e => setOpenCardForm({ ...openCardForm, totalNumber: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-300" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button type="submit" disabled={openCardLoading}
                          className="flex-1 py-2 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#3a7bc8] transition-colors disabled:opacity-50">
                          {openCardLoading ? t("vendingMachines.saving") : t("vendingMachines.openCardsSubmit")}
                        </button>
                        <button type="button" onClick={() => setShowOpenCardForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                          {t("common.cancel")}
                        </button>
                      </div>
                    </form>
                  )}

                  {cardsLoading ? <LoaderSpinner /> : cards.length === 0 ? (
                    <Empty text={t("vendingMachines.noCards")} />
                  ) : (
                    <>
                      <div className="space-y-2">
                        {cards.map((card, idx) => {
                          const statusMap: Record<string, { label: string; cls: string }> = {
                            normal: { label: t("vendingMachines.cardStatusNormal"), cls: "bg-green-100 text-green-700 border border-green-300" },
                            lost: { label: t("vendingMachines.cardStatusLost"), cls: "bg-orange-100 text-orange-700 border border-orange-300" },
                            cancel: { label: t("vendingMachines.cardStatusCancel"), cls: "bg-red-100 text-red-600 border border-red-300" },
                          };
                          const st = statusMap[card.status] ?? { label: card.status, cls: "bg-gray-100 text-gray-600" };
                          return (
                            <div key={idx} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-mono font-semibold text-gray-800">{card.number}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${st.cls}`}>{st.label}</span>
                                  <button onClick={() => { setShowRechargeModal(card); setRechargeForm({ value: "", income: "" }); }}
                                    className="p-1 text-green-600 hover:text-green-800 transition-colors" title={t("vendingMachines.recharge")}>
                                    <RefreshCw className="w-4 h-4" />
                                  </button>
                                  {card.status === "normal" ? (
                                    <button onClick={() => handleLossReport(card, "lost")} className="p-1 text-orange-500 hover:text-orange-700 transition-colors" title={t("vendingMachines.cardBlock")}>
                                      <Lock className="w-4 h-4" />
                                    </button>
                                  ) : (
                                    <button onClick={() => handleLossReport(card, "normal")} className="p-1 text-blue-500 hover:text-blue-700 transition-colors" title={t("vendingMachines.cardUnblock")}>
                                      <Unlock className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                <MiniRow label={t("vendingMachines.cardBalance")} value={parseFloat(card.value ?? "0").toFixed(2)} />
                                <MiniRow label={t("vendingMachines.cardCash")} value={`${parseFloat(card.cash ?? "0").toFixed(2)} zł`} />
                                <MiniRow label={t("vendingMachines.cardOwner")} value={card.owner_name || card.owner || "—"} />
                                <MiniRow label={t("vendingMachines.cardCreated")} value={card.create_time || "—"} />
                                {card.name && <MiniRow label={t("vendingMachines.cardPolicy")} value={card.name} />}
                                {card.last_day && <MiniRow label={t("vendingMachines.cardExpiry")} value={card.last_day} />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {cardsHasMore && (
                        <div className="flex justify-center pt-2">
                          <button onClick={() => loadCards(cardsPage + 1, true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#4A90E2] border border-[#4A90E2] rounded-lg hover:bg-blue-50 transition-colors">
                            {t("vendingMachines.loadMore")}
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {/* Card recharge modal */}
                  {showRechargeModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]" onClick={() => setShowRechargeModal(null)}>
                      <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-base font-semibold text-gray-900">{t("vendingMachines.rechargeCard")}: {showRechargeModal.number}</h3>
                          <button onClick={() => setShowRechargeModal(null)}><X className="w-4 h-4 text-gray-500" /></button>
                        </div>
                        <form onSubmit={handleCardRecharge} className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("vendingMachines.rechargeValue")}</label>
                            <input type="number" required min="0.01" step="0.01" value={rechargeForm.value}
                              onChange={e => setRechargeForm({ ...rechargeForm, value: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]" placeholder="10.00" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t("vendingMachines.rechargeIncome")}</label>
                            <input type="number" required min="0.01" step="0.01" value={rechargeForm.income}
                              onChange={e => setRechargeForm({ ...rechargeForm, income: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A90E2]" placeholder="10.00" />
                          </div>
                          <div className="flex gap-2 pt-1">
                            <button type="submit" disabled={rechargeLoading}
                              className="flex-1 py-2 bg-[#4A90E2] text-white text-sm font-medium rounded-lg hover:bg-[#3a7bc8] transition-colors disabled:opacity-50">
                              {rechargeLoading ? t("vendingMachines.saving") : t("vendingMachines.rechargeSubmit")}
                            </button>
                            <button type="button" onClick={() => setShowRechargeModal(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors">
                              {t("common.cancel")}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>

              ) : activeTab === "analytics" && selectedDetail ? (
                <AnalyticsTab deviceId={selectedDetail.id} deviceLocation={selectedDetail.location} />
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end shrink-0">
              <ActionButton variant="secondary" onClick={closeModal}>
                {t("common.cancel")}
              </ActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function LoaderSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex justify-center items-center py-12 text-gray-400">{text}</div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active ? "border-[#4A90E2] text-[#4A90E2]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
      {icon}{label}
    </button>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode; }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
      </div>
      <div className="bg-gray-50 rounded-lg px-4 py-1 divide-y divide-gray-100">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode; }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right ml-4">{value ?? "—"}</span>
    </div>
  );
}

function MiniRow({ label, value }: { label: string; value: string; }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-xs font-medium text-gray-800">{value || "—"}</span>
    </div>
  );
}