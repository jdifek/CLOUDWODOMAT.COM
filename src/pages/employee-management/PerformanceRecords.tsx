import { useState } from "react";
import { Search, X, Download } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function PerformanceRecords() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    employeeAccount: "",
    operator: "",
    resultYear: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleSearch = () => {
    console.log("Searching...", filters);
  };

  const handleClear = () => {
    setFilters({
      employeeAccount: "",
      operator: "",
      resultYear: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("performanceRecords.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("performanceRecords.employeeAccountNumber")}
            </label>
            <input
              type="text"
              value={filters.employeeAccount}
              onChange={(e) =>
                setFilters({ ...filters, employeeAccount: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("performanceRecords.enterAccountNumber")}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("performanceRecords.resultYear")}
            </label>
            <input
              type="text"
              value={filters.resultYear}
              onChange={(e) =>
                setFilters({ ...filters, resultYear: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("performanceRecords.enterYear")}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
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

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {t("common.export")}
        </button>
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
                  {t("performanceRecords.employeeAccountNumber")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("performanceRecords.merchant")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("authorizationDetails.rechargeAmount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("performanceRecords.actualAmount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("performanceRecords.amountInResultTime")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("performanceRecords.rechargeCount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.operator")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("performanceRecords.resultPeriod")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("employeeManagement.operationTime")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("performanceRecords.resultYear")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td
                  colSpan={12}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {t("common.noData")}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
