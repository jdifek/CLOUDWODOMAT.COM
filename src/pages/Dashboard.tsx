/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetricCard } from "../components/MetricCard";
import { DataTable } from "../components/DataTable";
import { useLanguage } from "../contexts/LanguageContext";
import { TrendingUp, Users, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { HappyTiService } from "../services/happyTiService";

const COLORS = ["#4A90E2", "#5CB85C", "#F0AD4E", "#D9534F"];

interface DashboardStats {
  todaySales: number;
  currentSales: number;
  todayRevenue: number;
  currentRevenue: number;
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
}

export function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"profit" | "sales" | "exchange">(
    "profit"
  );
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    currentSales: 0,
    todayRevenue: 0,
    currentRevenue: 0,
    activeDevices: 0,
  });

  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    online: 0,
    offline: 0,
    total: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadDevices(), loadConsumeRecords()]);
    } catch (error) {
      console.error("Ошибка загрузки данных:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const response = await HappyTiService.deviceList({
        type: "shop",
        page: 1,
      });

      if (response.data.code === 0) {
        const deviceList = response.data.data;
        setDevices(deviceList);

        const online = deviceList.filter(
          (d) => d.is_online === "online" || d.is_onlie === "online"
        ).length;
        const offline = deviceList.length - online;

        setDeviceStats({
          online,
          offline,
          total: deviceList.length,
        });

        setStats((prev) => ({
          ...prev,
          activeDevices: online,
        }));
      }
    } catch (error) {
      console.error("Ошибка загрузки устройств:", error);
    }
  };

  const loadConsumeRecords = async () => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

      const response = await HappyTiService.recordList({
        page: 1,
        beginTime: formatDate(sevenDaysAgo),
        endTime: formatDate(today),
      });

      if (response.data.code === 0) {
        const records = response.data.data;

        const todayStr = formatDate(today).split(" ")[0];
        const todayRecords = records.filter((r) => r.time.startsWith(todayStr));

        const todaySalesCount = todayRecords.length;
        const todayRevenue = todayRecords.reduce(
          (sum, r) => sum + parseFloat(r.value || "0"),
          0
        );

        const totalSalesCount = records.length;
        const totalRevenue = records.reduce(
          (sum, r) => sum + parseFloat(r.value || "0"),
          0
        );

        setStats((prev) => ({
          ...prev,
          todaySales: todaySalesCount,
          currentSales: totalSalesCount,
          todayRevenue: Math.round(todayRevenue * 100) / 100,
          currentRevenue: Math.round(totalRevenue * 100) / 100,
        }));

        prepareChartData(records);
      }
    } catch (error) {
      console.error("Ошибка загрузки записей потребления:", error);
    }
  };

  const prepareChartData = (records: any[]) => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = formatDate(date).split(" ")[0];

      const dayRecords = records.filter((r) => r.time.startsWith(dateStr));

      const sales = dayRecords.length;
      const revenue = dayRecords.reduce(
        (sum, r) => sum + parseFloat(r.value || "0"),
        0
      );

      last7Days.push({
        date: `${date.getDate()}/${date.getMonth() + 1}`,
        sales,
        revenue: Math.round(revenue * 100) / 100,
      });
    }

    setChartData(last7Days);
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const deviceStatusPieData = [
    { name: t("dashboard.online") || "Online", value: deviceStats.online },
    { name: t("dashboard.offline") || "Offline", value: deviceStats.offline },
  ];

  const deviceTypePieData = [
    {
      name: "Shop",
      value: devices.filter((d) => d.id.startsWith("86")).length,
    },
    {
      name: "Water",
      value: devices.filter((d) => !d.id.startsWith("86")).length,
    },
  ];

  const topDevicesByLocation = devices.slice(0, 5).map((d, idx) => ({
    id: idx + 1,
    channel: d.location || "N/A",
    type:
      d.is_online === "online" || d.is_onlie === "online"
        ? "Online"
        : "Offline",
  }));

  const equipmentColumns = [
    { key: "id", label: "№" },
    { key: "channel", label: t("dashboard.channel") },
    { key: "type", label: t("dashboard.type") },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Карточки метрик */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title={t("dashboard.todaySales")}
          value={stats.todaySales.toString()}
          icon={ShoppingCart}
        />
        <MetricCard
          title={t("dashboard.currentSales")}
          value={stats.currentSales.toString()}
          icon={TrendingUp}
        />
        <MetricCard
          title={t("dashboard.todayRevenue")}
          value={stats.todayRevenue.toFixed(2)}
          icon={ShoppingCart}
          prefix="zł"
        />
        <MetricCard
          title={t("dashboard.currentRevenue")}
          value={stats.currentRevenue.toFixed(2)}
          icon={TrendingUp}
          prefix="zł"
        />
        <MetricCard
          title={t("dashboard.activeUsers")}
          value={stats.activeDevices.toString()}
          icon={Users}
        />
      </div>

      {/* График */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("dashboard.subscriptionData")}
          </h2>
          <select className="px-4 py-2 bg-white border border-gray-300 rounded hover:border-[#4A90E2] transition-colors cursor-pointer">
            <option>{t("dashboard.last7Days")}</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#5CB85C"
              name={t("dashboard.sales")}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#F0AD4E"
              name={t("dashboard.revenue")}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Круговые диаграммы */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("dashboard.loadingStats")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deviceStatusPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {deviceStatusPieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("dashboard.equipmentSettings")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={deviceTypePieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {deviceTypePieData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("dashboard.equipmentSequence")}
        </h3>
        <DataTable columns={equipmentColumns} data={topDevicesByLocation} />
      </div>

      {/* Вкладки */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab("profit")}
            className={`px-6 py-3 font-medium ${
              activeTab === "profit"
                ? "border-b-2 border-[#4A90E2] text-[#4A90E2]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("dashboard.totalProfit")}
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`px-6 py-3 font-medium ${
              activeTab === "sales"
                ? "border-b-2 border-[#4A90E2] text-[#4A90E2]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("dashboard.salesEfficiency")}
          </button>
          <button
            onClick={() => setActiveTab("exchange")}
            className={`px-6 py-3 font-medium ${
              activeTab === "exchange"
                ? "border-b-2 border-[#4A90E2] text-[#4A90E2]"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t("dashboard.exchangeEfficiency")}
          </button>
        </div>
        <div className="text-gray-600">
          {activeTab === "profit" && (
            <div>
              <p className="mb-2">
                <strong>Общая прибыль:</strong> zł{" "}
                {stats.currentRevenue.toFixed(2)}
              </p>
              <p className="mb-2">
                <strong>Прибыль за сегодня:</strong> zł{" "}
                {stats.todayRevenue.toFixed(2)}
              </p>
            </div>
          )}
          {activeTab === "sales" && (
            <div>
              <p className="mb-2">
                <strong>Всего продаж:</strong> {stats.currentSales}
              </p>
              <p className="mb-2">
                <strong>Продаж за сегодня:</strong> {stats.todaySales}
              </p>
            </div>
          )}
          {activeTab === "exchange" && (
            <div>
              <p className="mb-2">
                <strong>Активных устройств:</strong> {deviceStats.online} /{" "}
                {deviceStats.total}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}