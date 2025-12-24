import { useState } from 'react';
import { SearchFilter, FilterField } from '../../components/SearchFilter';
import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';

export function AllFilters() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    simCardStatus: 'all',
    simCardNumber: '',
    equipmentId: '',
    equipmentAddress: '',
    simCardType: 'all'
  });

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const handleClear = () => {
    setFilters({
      simCardStatus: 'all',
      simCardNumber: '',
      equipmentId: '',
      equipmentAddress: '',
      simCardType: 'all'
    });
  };

  const columns = [
    { key: 'id', label: '№' },
    { key: 'equipmentType', label: 'Тип оборудования' },
    { key: 'equipmentNumber', label: 'Номер оборудования' },
    { key: 'equipmentAddress', label: 'Адрес оборудования' },
    { key: 'filterName', label: t('filter.filterName') },
    { key: 'filterNumber', label: t('filter.filterNumber') },
    { key: 'usedDays', label: t('filter.usedDays') },
    { key: 'filterStatus', label: t('filter.filterStatus') },
    { key: 'filterMode', label: t('filter.filterMode') },
    { key: 'waterPassed', label: t('filter.waterPassed') },
    { key: 'standardWaterVolume', label: t('filter.standardWaterVolume') },
    { key: 'replacementTime', label: t('filter.replacementTime') },
    { key: 'timeUntilReplacement', label: t('filter.timeUntilReplacement') },
    {
      key: 'operations',
      label: t('common.operations'),
      render: () => (
        <ActionButton size="sm" variant="primary">
          {t('common.details')}
        </ActionButton>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('nav.allFilters')}</h1>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t('sim.simCardStatus')}
          type="select"
          value={filters.simCardStatus}
          onChange={(value) => setFilters({ ...filters, simCardStatus: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'active', label: t('common.active') },
            { value: 'inactive', label: t('common.inactive') }
          ]}
        />
        <FilterField
          label={t('sim.simCardNumber')}
          value={filters.simCardNumber}
          onChange={(value) => setFilters({ ...filters, simCardNumber: value })}
        />
        <FilterField
          label={t('equipment.equipmentId')}
          value={filters.equipmentId}
          onChange={(value) => setFilters({ ...filters, equipmentId: value })}
        />
        <FilterField
          label={t('home.equipmentAddress')}
          value={filters.equipmentAddress}
          onChange={(value) => setFilters({ ...filters, equipmentAddress: value })}
        />
        <FilterField
          label={t('sim.simCardType')}
          type="select"
          value={filters.simCardType}
          onChange={(value) => setFilters({ ...filters, simCardType: value })}
          options={[
            { value: 'all', label: t('common.all') }
          ]}
        />
      </SearchFilter>

      <div className="flex gap-2">
        <ActionButton variant="primary">
          {t('filter.replaceFilters')}
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
