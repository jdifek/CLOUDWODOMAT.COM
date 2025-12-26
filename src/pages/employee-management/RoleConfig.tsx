import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function RoleConfig() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("roleConfig.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {t("roleConfig.searchTitle")}
        </h2>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("roleConfig.roleName")}
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("roleConfig.enterRoleName")}
            />
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
      </div>

      <div className="flex justify-end">
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("roleConfig.createNewRole")}
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
                  {t("roleConfig.roleName")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("packageManagement.createTime")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("roleConfig.description")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td
                  colSpan={6}
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
