import { Plus } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function QRGroups() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("qrGroups.title")}
        </h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {t("qrGroups.addNewStrategy")}
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
                  {t("qrGroups.qrZone")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.createdAt")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.updatedAt")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t("common.operations")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td
                  colSpan={5}
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
