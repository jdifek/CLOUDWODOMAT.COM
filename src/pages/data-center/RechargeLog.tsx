import { useState } from "react";
import { Search, X, Download } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function RechargeLog() {
  const { t } = useLanguage();
  const [activeYear, setActiveYear] = useState("2025");
  const [filters, setFilters] = useState({
    cardNumber: "",
    channel: "all",
    payment: "all",
    operator: "",
    orderNumber: "",
    amountFrom: "",
    amountTo: "",
    address: "",
    deviceId: "",
    region: "all",
    status: "all",
    dateFrom: "",
    dateTo: "",
    package: "",
    note: "",
  });

  const years = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    `2019 ${t("rechargeLog.orEarlier")}`,
  ];

  const handleSearch = () => {
    console.log("Searching...", filters);
  };

  const handleClear = () => {
    setFilters({
      cardNumber: "",
      channel: "all",
      payment: "all",
      operator: "",
      orderNumber: "",
      amountFrom: "",
      amountTo: "",
      address: "",
      deviceId: "",
      region: "all",
      status: "all",
      dateFrom: "",
      dateTo: "",
      package: "",
      note: "",
    });
  };

  const sampleData = [
    {
      id: 1,
      number: "60651281939",
      holder: t("rechargeLog.notFilled"),
      phone: "",
      channel: t("rechargeLog.backoffice"),
      payment: t("rechargeLog.miniProgram"),
      operator: "18625799572",
      place: "",
      deviceId: "",
      income: "1.00",
      recharge: "5000",
      balanceAfter: "5000",
      status: "paid",
      time: "2025-12-18 09:47:27",
    },
    {
      id: 2,
      number: "60650898006",
      holder: "",
      phone: "15137386333",
      channel: t("rechargeLog.miniProgram"),
      payment: "",
      operator: "",
      place: "Sun Bo",
      deviceId: "869966070605599",
      income: "0",
      recharge: "5000",
      balanceAfter: "6661.75",
      status: "paid",
      time: "2025-12-18 08:30:15",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("rechargeLog.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeYear === year
                    ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("rechargeLog.channel")}
              </label>
              <select
                value={filters.channel}
                onChange={(e) =>
                  setFilters({ ...filters, channel: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("common.all")}</option>
                <option value="backoffice">
                  {t("rechargeLog.backoffice")}
                </option>
                <option value="miniprogram">
                  {t("rechargeLog.miniProgram")}
                </option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("rechargeLog.payment")}
              </label>
              <select
                value={filters.payment}
                onChange={(e) =>
                  setFilters({ ...filters, payment: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("common.all")}</option>
                <option value="yes">{t("rechargeLog.yes")}</option>
                <option value="no">{t("rechargeLog.no")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
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
                {t("rechargeLog.orderNumber")}
              </label>
              <input
                type="text"
                value={filters.orderNumber}
                onChange={(e) =>
                  setFilters({ ...filters, orderNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.amountFrom")}
                </label>
                <input
                  type="number"
                  value={filters.amountFrom}
                  onChange={(e) =>
                    setFilters({ ...filters, amountFrom: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("userManagement.amountTo")}
                </label>
                <input
                  type="number"
                  value={filters.amountTo}
                  onChange={(e) =>
                    setFilters({ ...filters, amountTo: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("rechargeLog.address")}
              </label>
              <input
                type="text"
                value={filters.address}
                onChange={(e) =>
                  setFilters({ ...filters, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("userManagement.region")}
              </label>
              <select
                value={filters.region}
                onChange={(e) =>
                  setFilters({ ...filters, region: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("common.all")}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("common.status")}
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">{t("common.all")}</option>
                <option value="paid">{t("rechargeLog.paid")}</option>
                <option value="pending">{t("rechargeLog.pending")}</option>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("userManagement.package")}
              </label>
              <select
                value={filters.package}
                onChange={(e) =>
                  setFilters({ ...filters, package: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("common.select")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recharge.note")}
              </label>
              <input
                type="text"
                value={filters.note}
                onChange={(e) =>
                  setFilters({ ...filters, note: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
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
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <div className="text-sm">
                {t("rechargeLog.recharge")}:{" "}
                <span className="text-[#FFD700] font-bold text-lg">
                  60499.6
                </span>
              </div>
              <div className="text-sm">
                {t("consumptionLog.income")}:{" "}
                <span className="text-[#FFD700] font-bold text-lg">25001</span>
              </div>
              <div className="text-sm">
                {t("rechargeLog.refund")}:{" "}
                <span className="text-[#FFD700] font-bold text-lg">0</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              {t("common.export")}
            </button>
          </div>

          <div className="text-sm text-gray-600 mb-2">
            1-20 {t("common.from")} 21
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
                  {t("userManagement.number")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("rechargeLog.holder")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.phone")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("rechargeLog.channel")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("rechargeLog.payment")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.operator")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("consumptionLog.place")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.deviceId")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("consumptionLog.income")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("rechargeLog.recharge")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("consumptionLog.balanceAfter")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.status")}
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
              {sampleData.map((row, idx) => (
                <tr
                  key={row.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href="#" className="text-[#4A90E2] hover:underline">
                      {row.number}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.holder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.channel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.payment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.operator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.place}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.deviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.income}₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.recharge}₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.balanceAfter}₽
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-[#5CB85C] text-white rounded text-xs">
                      {t(`rechargeLog.${row.status}`)}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
