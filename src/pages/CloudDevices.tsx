import { DataTable } from '../components/DataTable';
import { ActionButton } from '../components/ActionButton';
import { useLanguage } from '../contexts/LanguageContext';
import { Plus } from 'lucide-react';

export function CloudDevices() {
  const { t } = useLanguage();

  const columns = [
    { key: 'id', label: '№' },
    { key: 'equipmentId', label: t('equipment.equipmentId') },
    { key: 'manufacturer', label: t('home.manufacturer') },
    { key: 'address', label: t('cloud.address') },
    { key: 'waterQuality1', label: t('cloud.waterQuality1') },
    { key: 'waterQuality2', label: t('cloud.waterQuality2') },
    { key: 'version', label: t('equipment.versionNumber') },
    { key: 'status', label: t('common.status') },
    { key: 'lastConnection', label: t('equipment.lastConnection') }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('cloud.cloudProducts')}</h1>
        <ActionButton variant="success">
          <Plus className="w-4 h-4 mr-2 inline" />
          {t('cloud.createEquipment')}
        </ActionButton>
      </div>

      <DataTable
        columns={columns}
        data={[]}
        currentPage={1}
        totalPages={0}
        totalRecords={0}
      />
    </div>
  );
}
