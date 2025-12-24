import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus } from 'lucide-react';

export function PackageZones() {
  const { t } = useLanguage();

  const columns = [
    { key: 'id', label: '№' },
    { key: 'zoneName', label: t('home.zoneName') },
    { key: 'createdAt', label: t('common.createdAt') },
    { key: 'updatedAt', label: t('common.updatedAt') }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.packageZones')}</h1>
        <ActionButton variant="success">
          <Plus className="w-4 h-4 mr-2 inline" />
          {t('home.addZone')}
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
