import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus } from 'lucide-react';

export function EquipmentModels() {
  const { t } = useLanguage();

  const columns = [
    { key: 'id', label: '№' },
    { key: 'model', label: t('home.equipmentModel') },
    { key: 'manufacturer', label: t('home.manufacturer') },
    { key: 'createdAt', label: t('common.createdAt') }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.equipmentModels')}</h1>
        <ActionButton variant="success">
          <Plus className="w-4 h-4 mr-2 inline" />
          {t('home.createModel')}
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
