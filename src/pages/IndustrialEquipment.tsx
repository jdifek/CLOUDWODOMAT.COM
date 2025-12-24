import { useState } from 'react';
import { SearchFilter, FilterField } from '../components/SearchFilter';
import { DataTable } from '../components/DataTable';
import { useLanguage } from '../contexts/LanguageContext';

export function IndustrialEquipment() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    equipmentNumber: '',
    name: '',
    equipmentStatus: 'all'
  });

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const handleClear = () => {
    setFilters({
      equipmentNumber: '',
      name: '',
      equipmentStatus: 'all'
    });
  };

  const columns = [
    { key: 'id', label: '№' },
    { key: 'equipmentNumber', label: t('industrial.equipmentNumber') },
    { key: 'name', label: t('industrial.name') },
    { key: 'equipmentStatus', label: t('equipment.equipmentStatus') },
    { key: 'version', label: t('equipment.versionNumber') },
    { key: 'lastConnection', label: t('industrial.lastConnectionTime') },
    { key: 'createdAt', label: t('common.createdAt') }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('industrial.industrialEquipmentList')}</h1>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t('industrial.equipmentNumber')}
          value={filters.equipmentNumber}
          onChange={(value) => setFilters({ ...filters, equipmentNumber: value })}
        />
        <FilterField
          label={t('industrial.name')}
          value={filters.name}
          onChange={(value) => setFilters({ ...filters, name: value })}
        />
        <FilterField
          label={t('equipment.equipmentStatus')}
          type="select"
          value={filters.equipmentStatus}
          onChange={(value) => setFilters({ ...filters, equipmentStatus: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'active', label: t('common.active') },
            { value: 'inactive', label: t('common.inactive') }
          ]}
        />
      </SearchFilter>

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
