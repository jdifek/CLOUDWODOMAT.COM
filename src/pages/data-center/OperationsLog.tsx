import { useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function OperationsLog() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("system");
  const [filters, setFilters] = useState({
    content: "",
    source: "all",
    operator: "",
    type: "all",
    year: "2025",
    dateFrom: "",
    dateTo: "",
    cardNumber: "",
    deviceId: "",
  });

  const tabs = [
    { key: "system", label: t("operationsLog.system") },
    { key: "cards", label: t("operationsLog.cards") },
    { key: "devices", label: t("operationsLog.devices") },
    { key: "users", label: t("operationsLog.users") },
    { key: "recharges", label: t("operationsLog.recharges") },
    { key: "partners", label: t("operationsLog.partners") },
    { key: "earlier", label: t("operationsLog.earlier") },
  ];

  const handleSearch = () => {
    console.log("Searching...", filters);
  };

  const handleClear = () => {
    setFilters({
      content: "",
      source: "all",
      operator: "",
      type: "all",
      year: "2025",
      dateFrom: "",
      dateTo: "",
      cardNumber: "",
      deviceId: "",
    });
  };

  const sampleData = [
    {
      id: 1,
      type: t("operationsLog.login"),
      content: t("operationsLog.loginToBackoffice"),
      operator: "15137386333",
      source: t("operationsLog.pc"),
      time: "2025-12-19 19:29:55",
    },
    {
      id: 2,
      type: t("operationsLog.login"),
      content: t("operationsLog.loginToMiniProgram"),
      operator: "18625799572",
      source: t("rechargeLog.miniProgram"),
      time: "2025-12-19 08:32:12",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("operationsLog.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.key
                    ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("operationsLog.content")}
              </label>
              <input
                type="text"
                value={filters.content}
                onChange={(e) =>
                  setFilters({ ...filters, content: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("operationsLog.source")}
              </label>
              <select
                value={filters.source}
                onChange={(e) =>
                  setFilters({ ...filters, source: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("common.all")}</option>
                <option value="pc">{t("operationsLog.pc")}</option>
                <option value="miniprogram">
                  {t("rechargeLog.miniProgram")}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("cardTransfer.operator")}
              </label>
              <input
                type="text"
                value={filters.operator}
                onChange={(e) =>
                  setFilters({ ...filters, operator: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("operationsLog.type")}
              </label>
              <select
                value={filters.type}
                onChange={(e) =>
                  setFilters({ ...filters, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("common.all")}</option>
                <option value="login">{t("operationsLog.login")}</option>
                <option value="operation">
                  {t("operationsLog.operation")}
                </option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("consumptionLog.year")}
              </label>
              <select
                value={filters.year}
                onChange={(e) =>
                  setFilters({ ...filters, year: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("consumptionLog.dateFrom")}
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, dateFrom: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("common.to")}
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) =>
                    setFilters({ ...filters, dateTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {activeTab === "cards" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.cardNumber")}
                </label>
                <input
                  type="text"
                  value={filters.cardNumber}
                  onChange={(e) =>
                    setFilters({ ...filters, cardNumber: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            {activeTab === "devices" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.deviceId")}
                </label>
                <input
                  type="text"
                  value={filters.deviceId}
                  onChange={(e) =>
                    setFilters({ ...filters, deviceId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              {t("common.search")}
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              {t("common.clear")}
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            1-20 {t("common.from")} 1,233
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  №
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("operationsLog.type")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("operationsLog.content")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.operator")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("operationsLog.source")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.time")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeTab === "system" ? (
                sampleData.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.type}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {row.content}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.operator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.source}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {row.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-[#4A90E2] hover:underline text-xs">
                        {t("common.details")}
                      </button>
                    </td>
                  </tr>
                ))
              ) : activeTab === "recharges" || activeTab === "partners" ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {t("common.noData")}
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {tabs.find((tab) => tab.key === activeTab)?.label} -{" "}
                    {t("operationsLog.tabContent")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
