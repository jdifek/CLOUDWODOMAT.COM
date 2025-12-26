import { useState } from "react";
import { Plus, Eye } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function RechargePackages() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    name: "",
    type: "",
    price: "",
    discount: "",
    status: "all",
    usage: "all",
  });

  const packages = [
    {
      id: 1,
      name: t("rechargePackages.recharge500get500"),
      type: t("rechargePackages.online"),
      price: "500",
      discount: "500",
      status: "published",
      usage: "unlimited",
    },
    {
      id: 2,
      name: t("rechargePackages.recharge300get300"),
      type: t("rechargePackages.online"),
      price: "300",
      discount: "300",
      status: "published",
      usage: "unlimited",
    },
    {
      id: 3,
      name: t("rechargePackages.recharge200get200"),
      type: t("rechargePackages.online"),
      price: "200",
      discount: "200",
      status: "published",
      usage: "unlimited",
    },
    {
      id: 4,
      name: t("rechargePackages.recharge100get100"),
      type: t("rechargePackages.online"),
      price: "100",
      discount: "120",
      status: "published",
      usage: "unlimited",
    },
    {
      id: 5,
      name: t("rechargePackages.recharge50get50"),
      type: t("rechargePackages.online"),
      price: "50",
      discount: "50",
      status: "published",
      usage: "unlimited",
    },
    {
      id: 6,
      name: t("rechargePackages.recharge20get20"),
      type: t("rechargePackages.online"),
      price: "20",
      discount: "20",
      status: "published",
      usage: "unlimited",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("rechargePackages.title")}
        </h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("rechargePackages.addNewPackage")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">
          1-6 {t("common.from")} 6 {t("common.records")}
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
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    {t("packageManagement.packageName")}
                  </div>
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) =>
                      setFilters({ ...filters, name: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder={t("packageManagement.name")}
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    {t("operationsLog.type")}
                  </div>
                  <select
                    value={filters.type}
                    onChange={(e) =>
                      setFilters({ ...filters, type: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="">{t("common.select")}</option>
                    <option value="online">
                      {t("rechargePackages.online")}
                    </option>
                    <option value="offline">
                      {t("rechargePackages.offline")}
                    </option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    {t("home.price")}
                  </div>
                  <input
                    type="text"
                    value={filters.price}
                    onChange={(e) =>
                      setFilters({ ...filters, price: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    {t("rechargePackages.actualDiscount")}
                  </div>
                  <input
                    type="text"
                    value={filters.discount}
                    onChange={(e) =>
                      setFilters({ ...filters, discount: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    {t("common.status")}
                  </div>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="all">{t("common.all")}</option>
                    <option value="published">
                      {t("rechargePackages.published")}
                    </option>
                    <option value="draft">{t("rechargePackages.draft")}</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">
                    {t("rechargePackages.usageCount")}
                  </div>
                  <select
                    value={filters.usage}
                    onChange={(e) =>
                      setFilters({ ...filters, usage: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="all">{t("common.all")}</option>
                    <option value="unlimited">
                      {t("rechargePackages.unlimited")}
                    </option>
                    <option value="limited">
                      {t("rechargePackages.limited")}
                    </option>
                  </select>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg, idx) => (
                <tr
                  key={pkg.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pkg.discount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-[#5CB85C] text-white rounded text-xs">
                      {t(`rechargePackages.${pkg.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {t(`rechargePackages.${pkg.usage}`)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-gray-600 hover:text-gray-800">
                      <Eye className="w-4 h-4" />
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
