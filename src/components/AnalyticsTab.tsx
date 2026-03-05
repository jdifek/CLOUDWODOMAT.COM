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
} from "lucide-react";
import { HappyTiService } from "../services/happyTiService";
import { useLanguage } from "../contexts/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type Period = "day" | "week" | "month" | "3months";

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPeriodStart(period: Period): Date {
  const now = new Date();
  switch (period) {
    case "day":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "week":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case "3months":
      return new Date(now.getFullYear(), now.getMonth() - 3, 1);
  }
}

function parseDate(str: string): Date {
  return new Date(str.replace(" ", "T"));
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate().toString().padStart(2, "0")}.${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}`;
}

function groupByDay(
  records: { time: string; value: number }[]
): { label: string; value: number }[] {
  const map: Record<string, number> = {};
  records.forEach(({ time, value }) => {
    const day = time.split("T")[0].split(" ")[0];
    map[day] = (map[day] || 0) + value;
  });
  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, value]) => ({ label: formatDayLabel(day), value }));
}

function groupByHour(
  records: { time: string; value: number }[]
): { label: string; value: number }[] {
  const map: Record<string, number> = {};
  records.forEach(({ time, value }) => {
    const d = parseDate(time);
    const key = `${d.getHours().toString().padStart(2, "0")}`;
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

// ─── MAX pages per period ─────────────────────────────────────────────────────

const MAX_PAGES: Record<Period, number> = {
  day: 5,
  week: 10,
  month: 20,
  "3months": 30,
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({
  data,
  color = "#4A90E2",
  height = 100,
  valueUnit = "",
  noDataLabel = "No data",
}: {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  valueUnit?: string;
  noDataLabel?: string;
}) {
  if (!data.length)
    return (
      <div
        className="flex items-center justify-center text-gray-300 text-xs"
        style={{ height }}
      >
        {noDataLabel}
      </div>
    );

  const max = Math.max(...data.map((d) => d.value), 0.01);

  return (
    <div style={{ height }} className="flex flex-col">
      <div className="flex items-end gap-1 flex-1 min-h-0">
        {data.map(({ label, value }, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-0.5 group relative h-full justify-end"
            style={{ minWidth: 0 }}
          >
            <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
              <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                {label}: {value.toFixed(2)}{valueUnit}
              </div>
              <div className="w-2 h-2 bg-gray-800 rotate-45" style={{ marginTop: -4 }} />
            </div>
            <div
              className="w-full rounded-t transition-all min-h-[3px]"
              style={{
                height: `${Math.max((value / max) * 100, 3)}%`,
                backgroundColor: color,
                opacity: 0.85,
              }}
            />
          </div>
        ))}
      </div>
      {data.length <= 24 && (
        <div className="flex mt-1">
          {data.map(({ label }, i) => (
            <div
              key={i}
              className="flex-1 text-center text-gray-400 overflow-hidden"
              style={{ fontSize: data.length > 10 ? 8 : 10 }}
            >
              {data.length <= 7 ? label : i % Math.ceil(data.length / 7) === 0 ? label : ""}
            </div>
          ))}
        </div>
      )}
      {data.length > 24 && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{data[0].label}</span>
          <span className="text-xs text-gray-400">{data[data.length - 1].label}</span>
        </div>
      )}
    </div>
  );
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

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
          return <path key={i} d={arcPath(cx, cy, radius, startAngle, endAngle)} fill={d.color} opacity={0.9} />;
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

// ─── Small components ─────────────────────────────────────────────────────────

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

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

function LoadingState({
  pagesLoaded,
  maxPages,
  loadingLabel,
  noteLabel,
  pagesLabel,
}: {
  pagesLoaded: number;
  maxPages: number;
  loadingLabel: string;
  noteLabel: string;
  pagesLabel: string;
}) {
  const progress = maxPages > 0 ? Math.round((pagesLoaded / maxPages) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{loadingLabel}</span>
          <span className="text-xs text-gray-400">{pagesLoaded} / {maxPages} {pagesLabel}</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#4A90E2] rounded-full transition-all duration-300"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
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
      <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-32 mb-4" />
        <div className="h-24 bg-gray-100 rounded" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AnalyticsTab({ deviceId }: AnalyticsTabProps) {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>("day");

  const [isLoading, setIsLoading] = useState(true);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const maxPages = MAX_PAGES[period];

  const [consumes, setConsumes] = useState<ConsumeRecord[]>([]);
  const [checkups, setCheckups] = useState<CheckupRecord[]>([]);

  const abortRef = useRef<AbortController | null>(null);

  const periods: { value: Period; label: string }[] = [
    { value: "day", label: t("vendingMachines.analyticsPeriodDay") },
    { value: "week", label: t("vendingMachines.analyticsPeriodWeek") },
    { value: "month", label: t("vendingMachines.analyticsPeriodMonth") },
    { value: "3months", label: t("vendingMachines.analyticsPeriod3Months") },
  ];

  const load = async (targetPeriod: Period) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setPagesLoaded(0);
    setConsumes([]);
    setCheckups([]);

    try {
      const [fetchedConsumes, checkupRes] = await Promise.all([
        fetchAllConsumesForPeriodWithProgress(
          deviceId,
          targetPeriod,
          controller.signal,
          (page) => setPagesLoaded(page)
        ),
        HappyTiService.deviceCheckup({ deviceId, page: 1 }).catch(() => null),
      ]);

      if (controller.signal.aborted) return;

      setConsumes(fetchedConsumes);

      if (checkupRes) {
        const code = checkupRes.data.code ?? checkupRes.data.error;
        if (String(code) === "0") {
          setCheckups(checkupRes.data.data ?? []);
        }
      }
    } catch {
      // ignore
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    load(period);
    return () => abortRef.current?.abort();
  }, [deviceId, period]);

  // ── Filter & aggregate ──────────────────────────────────────────────────────

  const periodStart = useMemo(() => getPeriodStart(period), [period]);

  const filteredConsumes = useMemo(
    () => consumes.filter((r) => parseDate(r.time) >= periodStart),
    [consumes, periodStart]
  );

  const stats = useMemo(() => {
    const totalRevenue = filteredConsumes.reduce(
      (s, r) => s + parseFloat(r.cost_value || r.value || "0"), 0
    );
    const txCount = filteredConsumes.length;
    const avgTx = txCount > 0 ? totalRevenue / txCount : 0;

    const water1 = filteredConsumes.reduce((s, r) => s + parseFloat(String(r.water1 ?? "0")), 0);
    const water2 = filteredConsumes.reduce((s, r) => s + parseFloat(String(r.water2 ?? "0")), 0);
    const totalWater = water1 + water2;

    const payTypes: Record<string, number> = {};
    filteredConsumes.forEach((r) => {
      const type = getPaymentType(r, t);
      payTypes[type] = (payTypes[type] || 0) + 1;
    });

    const groupFn = period === "day" ? groupByHour : groupByDay;

    const revenueChart = groupFn(filteredConsumes.map((r) => ({
      time: r.time, value: parseFloat(r.cost_value || r.value || "0"),
    })));
    const waterChart = groupFn(filteredConsumes.map((r) => ({
      time: r.time,
      value: parseFloat(String(r.water1 ?? "0")) + parseFloat(String(r.water2 ?? "0")),
    })));

    return {
      totalRevenue, txCount, avgTx,
      water1, water2, totalWater,
      payTypes,
      revenueChart, waterChart,
      latestCheckup: checkups[0] || null,
    };
  }, [filteredConsumes, checkups, period, t]);

  // Dynamic colors keyed by translated label
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

  const chartSuffix = period === "day"
    ? t("vendingMachines.analyticsPerHour")
    : t("vendingMachines.analyticsPerDay");

  const noDataLabel = t("vendingMachines.analyticsNoData");

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Period selector + refresh */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              disabled={isLoading}
              className={`px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                period === p.value
                  ? "bg-[#4A90E2] text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => load(period)}
          disabled={isLoading}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          title={t("common.search")}
        >
          <RefreshCw className={`w-4 h-4 text-gray-400 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <LoadingState
          pagesLoaded={pagesLoaded}
          maxPages={maxPages}
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
              {period === "day"
                ? t("vendingMachines.analyticsNoTransactions")
                : t("vendingMachines.analyticsNoTransactionsPeriod")}
            </div>
          )}

          {/* Summary bar */}
          <div className="bg-gray-50 rounded-lg px-4 py-2 flex items-center gap-3 text-xs text-gray-500 border border-gray-100">
            <span>
              {t("vendingMachines.analyticsLoadedRecords")}:{" "}
              <strong className="text-gray-700">{consumes.length}</strong>
            </span>
            <span className="text-gray-300">|</span>
            <span>
              {t("vendingMachines.analyticsPeriodRecords")}:{" "}
              <strong className="text-gray-700">{stats.txCount}</strong>
            </span>
          </div>

          {/* KPI Cards */}
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
            title={`${t("vendingMachines.analyticsRevenueChart")} ${chartSuffix}`}
            icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
          >
            <BarChart
              data={stats.revenueChart}
              color="#4A90E2"
              height={110}
              valueUnit=" zł"
              noDataLabel={noDataLabel}
            />
          </SectionCard>

          {/* Water Chart */}
          <SectionCard
            title={`${t("vendingMachines.analyticsWaterChart")} ${chartSuffix} (л)`}
            icon={<Droplets className="w-4 h-4 text-cyan-500" />}
          >
            <BarChart
              data={stats.waterChart}
              color="#06B6D4"
              height={90}
              valueUnit=" л"
              noDataLabel={noDataLabel}
            />
            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-400">{t("vendingMachines.analyticsPort1")}</p>
                <p className="text-sm font-bold text-gray-800">{stats.water1.toFixed(1)} л</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-400">{t("vendingMachines.analyticsPort2")}</p>
                <p className="text-sm font-bold text-gray-800">{stats.water2.toFixed(1)} л</p>
              </div>
              <div className="w-px bg-gray-100" />
              <div className="flex-1 text-center">
                <p className="text-xs text-gray-400">{t("vendingMachines.analyticsTotal")}</p>
                <p className="text-sm font-bold text-cyan-600">{stats.totalWater.toFixed(1)} л</p>
              </div>
            </div>
          </SectionCard>

          {/* Payment types */}
          <SectionCard
            title={t("vendingMachines.analyticsPaymentTypes")}
            icon={<CreditCard className="w-4 h-4 text-purple-500" />}
          >
            {donutData.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">{noDataLabel}</p>
            ) : (
              <DonutChart data={donutData} noDataLabel={noDataLabel} />
            )}
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

          {/* Inspection */}
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
              <p className="text-xs text-gray-300 mt-2 text-right">
                {stats.latestCheckup.create_time}
              </p>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}

// ─── Fetch helper with progress callback ─────────────────────────────────────

async function fetchAllConsumesForPeriodWithProgress(
  deviceId: string,
  period: Period,
  signal: AbortSignal,
  onPageLoaded: (page: number) => void
): Promise<ConsumeRecord[]> {
  const periodStart = getPeriodStart(period);
  const maxPages = MAX_PAGES[period];
  const collected: ConsumeRecord[] = [];

  for (let page = 1; page <= maxPages; page++) {
    if (signal.aborted) break;

    try {
      const res = await HappyTiService.recordList({ page });
      if (signal.aborted) break;

      onPageLoaded(page);

      const code = res.data.code ?? res.data.error;
      if (String(code) !== "0") break;

      const batch: ConsumeRecord[] = res.data.data ?? [];
      if (batch.length === 0) break;

      const forDevice = batch.filter((r) => r.shop_num === deviceId);
      collected.push(...forDevice);

      const oldestInBatch = parseDate(batch[batch.length - 1].time);
      if (oldestInBatch < periodStart) break;

      if (batch.length < PAGE_SIZE) break;
    } catch {
      if (signal.aborted) break;
      break;
    }
  }

  return collected;
}