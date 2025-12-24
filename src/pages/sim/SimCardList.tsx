import { useState } from 'react';
import { SearchFilter, FilterField } from '../../components/SearchFilter';
import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Download } from 'lucide-react';

const mockData = [
  {
    id: 1,
    iccid: '898602B3061970012345',
    mainBoardNumber: '12345678',
    address: 'Цветочный район',
    manufacturer: 'Test Manufacturer',
    operator: 'Китай мобильный (Шанхай)',
    status: 'active',
    validityPeriod: '2026-12-31',
    prepaidExpiration: '2026-12-31'
  }
];

export function SimCardList() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    simCardStatus: 'all',
    simCardNumber: '',
    equipmentId: '',
    equipmentAddress: '',
    simCardType: 'all',
    dateFrom: '',
    dateTo: ''
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
      simCardType: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const columns = [
    { key: 'id', label: '№' },
    { key: 'iccid', label: t('sim.iccid') },
    { key: 'mainBoardNumber', label: t('sim.mainBoardNumber') },
    { key: 'address', label: t('cloud.address') },
    { key: 'manufacturer', label: t('home.manufacturer') },
    { key: 'operator', label: t('sim.operator') },
    {
      key: 'status',
      label: t('common.status'),
      render: (value: string) => {
        const colors: { [key: string]: string } = {
          active: 'bg-blue-100 text-blue-800',
          expired: 'bg-yellow-100 text-yellow-800',
          alreadyActive: 'bg-green-100 text-green-800'
        };
        const labels: { [key: string]: string } = {
          active: t('common.active'),
          expired: t('sim.expired'),
          alreadyActive: t('sim.alreadyActive')
        };
        return (
          <span className={`px-2 py-1 rounded text-xs ${colors[value] || colors.active}`}>
            {labels[value] || value}
          </span>
        );
      }
    },
    { key: 'validityPeriod', label: t('sim.validityPeriod') },
    { key: 'prepaidExpiration', label: t('sim.prepaidExpiration') },
    {
      key: 'operations',
      label: t('common.operations'),
      render: () => (
        <div className="flex gap-2">
          <ActionButton size="sm" variant="primary">
            {t('common.details')}
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
      <h1 className="text-2xl font-bold text-gray-900">{t('sim.simManagement')}</h1>

      <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
        {t('sim.expiringWarning')}
      </div>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t('sim.simCardStatus')}
          type="select"
          value={filters.simCardStatus}
          onChange={(value) => setFilters({ ...filters, simCardStatus: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'active', label: t('common.active') },
            { value: 'expired', label: t('sim.expired') }
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
        <FilterField
          label={t('common.from')}
          type="date"
          value={filters.dateFrom}
          onChange={(value) => setFilters({ ...filters, dateFrom: value })}
        />
        <FilterField
          label={t('common.to')}
          type="date"
          value={filters.dateTo}
          onChange={(value) => setFilters({ ...filters, dateTo: value })}
        />
      </SearchFilter>

      <div className="flex gap-2">
        <ActionButton variant="success">
          <Download className="w-4 h-4 mr-2 inline" />
          {t('common.export')}
        </ActionButton>
      </div>

      <div className="text-sm text-gray-600">
        Всего 1-10 из 10 записей
      </div>

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
