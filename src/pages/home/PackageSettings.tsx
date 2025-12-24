import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus } from 'lucide-react';

export function PackageSettings() {
  const { t } = useLanguage();

  const columns = [
    { key: 'id', label: '№' },
    { key: 'packageName', label: t('home.packageName') },
    { key: 'manufacturer', label: t('home.manufacturer') },
    { key: 'price', label: t('home.price') },
    { key: 'packageType', label: t('home.packageType') },
    { key: 'status', label: t('common.status') },
    { key: 'deliveryDays', label: t('home.deliveryDays') },
    { key: 'deliveryVolume', label: t('home.deliveryVolume') },
    { key: 'supportedTypes', label: t('home.supportedTypes') },
    { key: 'sorting', label: t('home.sorting') },
    { key: 'description', label: t('home.packageDescription') },
    {
      key: 'operations',
      label: t('common.operations'),
      render: () => (
        <div className="flex gap-2">
          <ActionButton size="sm" variant="warning">
            {t('common.edit')}
          </ActionButton>
          <ActionButton size="sm" variant="danger">
            {t('common.delete')}
          </ActionButton>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.packageSettings')}</h1>
        <ActionButton variant="success">
          <Plus className="w-4 h-4 mr-2 inline" />
          {t('home.createPackage')}
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
