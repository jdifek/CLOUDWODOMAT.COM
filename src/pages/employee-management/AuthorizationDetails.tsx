import { useState } from "react";
import { Search, X } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function AuthorizationDetails() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    employee: "",
    operator: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleSearch = () => {
    console.log("Searching...", filters);
  };

  const handleClear = () => {
    setFilters({
      employee: "",
      operator: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const records = [
    {
      id: 1,
      employee: "13289967016",
      operator: "15137386333",
      rechargeAmount: "20000",
      balanceAfter: "20000",
      note: `(${t("employeeManagement.notSet")})`,
      time: "2025-12-18 08:27:02",
    },
    {
      id: 2,
      employee: "13698895725",
      operator: "15137386333",
      rechargeAmount: "20000",
      balanceAfter: "20000",
      note: `(${t("employeeManagement.notSet")})`,
      time: "2025-10-30 08:25:41",
    },
    {
      id: 3,
      employee: "18625799572",
      operator: "15137386333",
      rechargeAmount: "50000",
      balanceAfter: "50000",
      note: `(${t("employeeManagement.notSet")})`,
      time: "2025-05-13 09:54:21",
    },
    {
      id: 4,
      employee: "13698895725",
      operator: "15137386333",
      rechargeAmount: "20000",
      balanceAfter: "20000",
      note: t("authorizationDetails.savedFromWorkLogin"),
      time: "2025-05-13 09:54:11",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("authorizationDetails.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("authorizationDetails.employee")}
            </label>
            <input
              type="text"
              value={filters.employee}
              onChange={(e) =>
                setFilters({ ...filters, employee: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("authorizationDetails.enterEmployee")}
            />
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
              placeholder={t("authorizationDetails.enterOperator")}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employeeManagement.dateFrom")}
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
              {t("employeeManagement.dateTo")}
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

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">
          1-4 {t("common.from")} 4 {t("common.records")}
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
                  {t("authorizationDetails.employee")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.operator")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("authorizationDetails.rechargeAmount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("authorizationDetails.amountAfterRecharge")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("recharge.note")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.time")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, idx) => (
                <tr
                  key={record.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.employee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.operator}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.rechargeAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.balanceAfter}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        record.note.includes(t("employeeManagement.notSet"))
                          ? "text-[#D9534F]"
                          : "text-gray-900"
                      }
                    >
                      {record.note}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.time}
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
