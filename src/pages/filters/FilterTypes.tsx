import { DataTable } from "../../components/DataTable";
import { ActionButton } from "../../components/ActionButton";
import { useLanguage } from "../../contexts/LanguageContext";
import { Plus } from "lucide-react";

export function FilterTypes() {
  const { t } = useLanguage();
  const mockData = [
    {
      id: 1,
      filterName: "Предварительный",
      filterType: "Торговый автомат",
      replacementPeriod: 90,
      warningDays: 3,
      totalWaterVolume: 30,
      createdAt: "2025-07-23 17:47:30",
      updatedAt: t("common.noData"),
    },
  ];
  const columns = [
    { key: "id", label: "№" },
    { key: "filterName", label: t("filter.filterName") },
    { key: "filterType", label: t("filter.filterType") },
    { key: "replacementPeriod", label: t("filter.replacementPeriod") },
    { key: "warningDays", label: t("filter.warningBeforeReplacement") },
    { key: "totalWaterVolume", label: t("filter.totalWaterVolume") },
    { key: "createdAt", label: t("common.createdAt") },
    { key: "updatedAt", label: t("common.updatedAt") },
    {
      key: "operations",
      label: t("common.operations"),
      render: () => (
        <div className="flex gap-2">
          <ActionButton size="sm" variant="warning">
            {t("common.edit")}
          </ActionButton>
          <ActionButton size="sm" variant="danger">
            {t("common.delete")}
          </ActionButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("nav.filterTypes")}
        </h1>
        <ActionButton variant="success">
          <Plus className="w-4 h-4 mr-2 inline" />
          {t("filter.addFilter")}
        </ActionButton>
      </div>

      <div className="text-sm text-gray-600">Показано 1-1 из 1 записей</div>

      <DataTable
        columns={columns}
        data={mockData}
        currentPage={1}
        totalPages={1}
        totalRecords={mockData.length}
      />
    </div>
  );
}
