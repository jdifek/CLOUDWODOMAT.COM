import { useState } from "react";
import { Search, X, Plus, Zap, Eye, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function EmployeeList() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    accountName: "",
    surname: "",
    minBalance: "",
    maxBalance: "",
    dateFrom: "",
    dateTo: "",
  });

  const handleSearch = () => {
    console.log("Searching...", filters);
  };

  const handleClear = () => {
    setFilters({
      accountName: "",
      surname: "",
      minBalance: "",
      maxBalance: "",
      dateFrom: "",
      dateTo: "",
    });
  };

  const employees = [
    {
      id: 1,
      account: "18303695886",
      password: "******",
      surname: "Testowy Wei",
      created: "2024-11-02 16:24:50",
      balance: "0.00",
      operationTime: `(${t("employeeManagement.notSet")})`,
    },
    {
      id: 2,
      account: "18625799572",
      password: "*******",
      surname: "Wang Jianxin",
      created: "2024-11-29 09:46:18",
      balance: "45000.00",
      operationTime: `(${t("employeeManagement.notSet")})`,
    },
    {
      id: 3,
      account: "13289967016",
      password: "*******",
      surname: "Ma Gong",
      created: "2025-12-18 08:26:36",
      balance: "20000.00",
      operationTime: `(${t("employeeManagement.notSet")})`,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("employeeManagement.employeeList")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employeeManagement.accountName")}
            </label>
            <input
              type="text"
              value={filters.accountName}
              onChange={(e) =>
                setFilters({ ...filters, accountName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("employeeManagement.enterAccountName")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("employeeManagement.surname")}
            </label>
            <input
              type="text"
              value={filters.surname}
              onChange={(e) =>
                setFilters({ ...filters, surname: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("employeeManagement.enterSurname")}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("employeeManagement.minBalance")}
              </label>
              <input
                type="number"
                value={filters.minBalance}
                onChange={(e) =>
                  setFilters({ ...filters, minBalance: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("employeeManagement.min")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("employeeManagement.maxBalance")}
              </label>
              <input
                type="number"
                value={filters.maxBalance}
                onChange={(e) =>
                  setFilters({ ...filters, maxBalance: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("employeeManagement.max")}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 grid grid-cols-2 gap-2">
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

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("employeeManagement.addEmployee")}
        </button>
        <button className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {t("employeeManagement.bulkRecharge")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600 mb-4">
          1-3 {t("common.from")} 3 {t("common.records")}
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
                  {t("employeeManagement.employeeAccountName")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("employeeManagement.password")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("employeeManagement.surname")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("employeeManagement.createTime")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("employeeManagement.balance")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("employeeManagement.operationTime")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee, idx) => (
                <tr
                  key={employee.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.account}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {employee.password}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.surname}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.created}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.balance}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9534F]">
                    {employee.operationTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {t("common.details")}
                      </button>
                      <button className="px-3 py-1 bg-[#F0AD4E] text-white rounded hover:bg-[#E09D3E] transition-colors text-xs">
                        {t("employeeManagement.result")}
                      </button>
                      <button className="px-3 py-1 bg-[#D9534F] text-white rounded hover:bg-[#C9433F] transition-colors text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        {t("common.delete")}
                      </button>
                    </div>
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
