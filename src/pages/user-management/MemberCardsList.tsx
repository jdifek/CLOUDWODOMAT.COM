import { useState } from "react";
import {
  Search,
  X,
  Download,
  Shield,
  PackageX,
  Upload,
  Trash2,
  List,
  Link2,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function MemberCardsList() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    cardNumber: "",
    package: "all",
    cardStatus: "all",
    binding: "all",
    phone: "",
    amountFrom: "",
    amountTo: "",
    userName: "",
    deviceName: "",
    deviceId: "",
    region: "all",
  });

  const handleSearch = () => {
    console.log("Searching...", filters);
  };

  const handleClear = () => {
    setFilters({
      cardNumber: "",
      package: "all",
      cardStatus: "all",
      binding: "all",
      phone: "",
      amountFrom: "",
      amountTo: "",
      userName: "",
      deviceName: "",
      deviceId: "",
      region: "all",
    });
  };

  const sampleData = [
    {
      id: 1,
      number: "10818207317",
      user: t("userManagement.notConnected"),
      phone: "-",
      device: "-",
      balance: "-61.58",
      gift: "-61.58",
      payment: "0.00",
      package: "-",
      expiry: "-",
      status: "normal",
    },
    {
      id: 2,
      number: "10818207318",
      user: t("userManagement.notConnected"),
      phone: "-",
      device: "-",
      balance: "-204.96",
      gift: "-204.96",
      payment: "0.00",
      package: "-",
      expiry: "-",
      status: "lost",
    },
    {
      id: 3,
      number: "60650654100",
      user: "Wang",
      phone: "16627710692",
      device: t("userManagement.device") + " A",
      balance: "384.31",
      gift: "105.00",
      payment: "279.31",
      package: t("userManagement.standard"),
      expiry: "2025-12-31",
      status: "normal",
    },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("userManagement.memberCardsList")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
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
              {t("userManagement.package")}
            </label>
            <select
              value={filters.package}
              onChange={(e) =>
                setFilters({ ...filters, package: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("common.all")}</option>
              <option value="basic">{t("userManagement.basic")}</option>
              <option value="standard">{t("userManagement.standard")}</option>
              <option value="premium">{t("userManagement.premium")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("userManagement.cardStatus")}
            </label>
            <select
              value={filters.cardStatus}
              onChange={(e) =>
                setFilters({ ...filters, cardStatus: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("common.all")}</option>
              <option value="normal">{t("userManagement.normal")}</option>
              <option value="lost">{t("userManagement.lost")}</option>
              <option value="blocked">{t("userManagement.blocked")}</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("userManagement.binding")}
            </label>
            <select
              value={filters.binding}
              onChange={(e) =>
                setFilters({ ...filters, binding: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{t("common.all")}</option>
              <option value="bound">{t("userManagement.bound")}</option>
              <option value="unbound">{t("userManagement.unbound")}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("userManagement.phone")}
            </label>
            <input
              type="text"
              value={filters.phone}
              onChange={(e) =>
                setFilters({ ...filters, phone: e.target.value })
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

        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("home.userName")}
            </label>
            <input
              type="text"
              value={filters.userName}
              onChange={(e) =>
                setFilters({ ...filters, userName: e.target.value })
              }
              placeholder={t("userManagement.fuzzySearch")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("userManagement.deviceName")}
            </label>
            <input
              type="text"
              value={filters.deviceName}
              onChange={(e) =>
                setFilters({ ...filters, deviceName: e.target.value })
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
              <option value="north">{t("userManagement.north")}</option>
              <option value="south">{t("userManagement.south")}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            {t("userManagement.unissuedFunds")}:{" "}
            <span className="text-[#FFD700] font-bold text-lg">29547.68</span>
            <span className="text-gray-400 ml-2">(27650.55/1897.34)</span>
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

        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm flex items-center gap-1">
            <Download className="w-4 h-4" />
            {t("userManagement.exportCards")}
          </button>
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm flex items-center gap-1">
            <Link2 className="w-4 h-4" />
            {t("userManagement.bulkBinding")}
          </button>
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm flex items-center gap-1">
            <Shield className="w-4 h-4" />
            {t("userManagement.limit")}
          </button>
          <button className="px-3 py-1.5 bg-[#4A90E2] hover:bg-[#3A7BC8] text-white rounded transition-colors text-sm flex items-center gap-1">
            <PackageX className="w-4 h-4" />
            {t("userManagement.cancelPackage")}
          </button>
          <button className="px-3 py-1.5 bg-[#F0AD4E] hover:bg-[#E09D3E] text-white rounded transition-colors text-sm flex items-center gap-1">
            <Upload className="w-4 h-4" />
            {t("userManagement.importCancellation")}
          </button>
          <button className="px-3 py-1.5 bg-[#D9534F] hover:bg-[#C9433F] text-white rounded transition-colors text-sm flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            {t("common.delete")}
          </button>
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm flex items-center gap-1">
            <Upload className="w-4 h-4" />
            {t("userManagement.importDeletion")}
          </button>
          <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors text-sm flex items-center gap-1">
            <List className="w-4 h-4" />
            {t("userManagement.list")}
          </button>
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
                  {t("userManagement.user")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.phone")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.device")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.balance")} (
                  {t("userManagement.giftPayment")})
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.package")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.expiry")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.status")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("userManagement.actions")}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        row.user === t("userManagement.notConnected")
                          ? "text-[#D9534F]"
                          : "text-gray-900"
                      }
                    >
                      {row.user}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.device}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={
                        parseFloat(row.balance) < 0
                          ? "text-[#D9534F]"
                          : "text-gray-900"
                      }
                    >
                      {row.balance}◯
                    </span>
                    <span className="text-gray-500 text-xs ml-1">
                      ({row.gift}/{row.payment})
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.package}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.expiry}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        row.status === "normal"
                          ? "bg-[#5CB85C] text-white"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {t(`userManagement.${row.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="text-[#4A90E2] hover:underline text-xs">
                        {t("userManagement.details")}
                      </button>
                      {row.status === "normal" ? (
                        <button className="text-[#D9534F] hover:underline text-xs">
                          {t("userManagement.reportLost")}
                        </button>
                      ) : (
                        <button className="text-[#5CB85C] hover:underline text-xs">
                          {t("userManagement.restore")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            {t("common.total")} 1-20 {t("common.from")} 27 {t("common.records")}
          </div>
        </div>
      </div>
    </div>
  );
}
