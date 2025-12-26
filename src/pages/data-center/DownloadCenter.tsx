import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function DownloadCenter() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    module: "all",
    status: "all",
    operator: "",
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("downloadCenter.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("downloadCenter.module")}
            </label>
            <select
              value={filters.module}
              onChange={(e) =>
                setFilters({ ...filters, module: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("common.all")}</option>
              <option value="cards">{t("downloadCenter.cards")}</option>
              <option value="recharges">{t("downloadCenter.recharges")}</option>
              <option value="consumption">
                {t("downloadCenter.consumption")}
              </option>
            </select>
          </div>
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
              <option value="completed">{t("downloadCenter.completed")}</option>
              <option value="processing">
                {t("downloadCenter.processing")}
              </option>
              <option value="failed">{t("downloadCenter.failed")}</option>
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
              placeholder={t("cardTransfer.operator")}
            />
          </div>
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
                  {t("downloadCenter.module")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("downloadCenter.operation")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("downloadCenter.description")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("downloadCenter.progress")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("cardTransfer.operator")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("downloadCenter.created")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("downloadCenter.completed")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("downloadCenter.expiresAt")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td
                  colSpan={11}
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
