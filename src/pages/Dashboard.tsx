import { MetricCard } from "../components/MetricCard";
import { DataTable } from "../components/DataTable";
import { useLanguage } from "../contexts/LanguageContext";
import { TrendingUp, Users, ShoppingCart, Gem } from "lucide-react";
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
import { useState } from "react";

const lineChartData = [
  { month: "Jan", subscriptions: 400, sales: 240, revenue: 2400 },
  { month: "Feb", subscriptions: 300, sales: 139, revenue: 2210 },
  { month: "Mar", subscriptions: 200, sales: 980, revenue: 2290 },
  { month: "Apr", subscriptions: 278, sales: 390, revenue: 2000 },
  { month: "May", subscriptions: 189, sales: 480, revenue: 2181 },
  { month: "Jun", subscriptions: 239, sales: 380, revenue: 2500 },
];

const pieData1 = [
  { name: "Category A", value: 400 },
  { name: "Category B", value: 300 },
  { name: "Category C", value: 300 },
  { name: "Category D", value: 200 },
];

const pieData2 = [
  { name: "Type 1", value: 500 },
  { name: "Type 2", value: 300 },
  { name: "Type 3", value: 200 },
];

const pieData3 = [
  { name: "Equipment 1", value: 350 },
  { name: "Equipment 2", value: 280 },
  { name: "Equipment 3", value: 220 },
  { name: "Equipment 4", value: 150 },
];

const COLORS = ["#4A90E2", "#5CB85C", "#F0AD4E", "#D9534F"];

const equipmentSequenceData = [
  { id: 1, channel: "Channel 1", quantity: 150, type: "Type A" },
  { id: 2, channel: "Channel 2", quantity: 200, type: "Type B" },
  { id: 3, channel: "Channel 3", quantity: 180, type: "Type C" },
  { id: 4, channel: "Channel 4", quantity: 220, type: "Type A" },
  { id: 5, channel: "Channel 5", quantity: 190, type: "Type D" },
];

export function Dashboard() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"profit" | "sales" | "exchange">(
    "profit"
  );

  const equipmentColumns = [
    { key: "id", label: "№" },
    { key: "channel", label: t("dashboard.channel") },
    { key: "quantity", label: t("dashboard.quantity") },
    { key: "type", label: t("dashboard.type") },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <MetricCard
          title={t("dashboard.todaySales")}
          value="1,234"
          change={12.5}
          icon={ShoppingCart}
        />
        <MetricCard
          title={t("dashboard.currentSales")}
          value="5,678"
          change={8.2}
          icon={TrendingUp}
        />
        <MetricCard
          title={t("dashboard.todayRevenue")}
          value="12,345"
          change={-3.1}
          icon={Gem}
          prefixIcon={Gem}
        />
        <MetricCard
          title={t("dashboard.currentRevenue")}
          value="15,00"
          change={100}
          icon={Gem}
          prefixIcon={Gem}
        />
        <MetricCard
          title={t("dashboard.activeUsers")}
          value="2,456"
          change={15.7}
          icon={Users}
        />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("dashboard.subscriptionData")}
          </h2>
          <select className="px-4 py-2 bg-white border border-gray-300 rounded hover:border-[#4A90E2] transition-colors cursor-pointer">
            <option>{t("dashboard.last7Days")}</option>
            <option>{t("dashboard.last7Weeks")}</option>
            <option>{t("dashboard.last7Months")}</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="subscriptions"
              stroke="#4A90E2"
              name={t("dashboard.subscriptions")}
            />
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("dashboard.loadingStats")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData1}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData1.map((entry, index) => (
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
                data={pieData2}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData2.map((entry, index) => (
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
            {t("dashboard.glasswareSettings")}
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData3}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {pieData3.map((entry, index) => (
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

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {t("dashboard.equipmentSequence")}
        </h3>
        <DataTable columns={equipmentColumns} data={equipmentSequenceData} />
      </div>

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
            <p>{t("dashboard.profitInDevelopment")}</p>
          )}
          {activeTab === "sales" && <p>{t("dashboard.salesInDevelopment")}</p>}
          {activeTab === "exchange" && (
            <p>{t("dashboard.exchangeInDevelopment")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
