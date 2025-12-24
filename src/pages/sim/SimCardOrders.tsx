import { useState } from 'react';
import { SearchFilter, FilterField } from '../../components/SearchFilter';
import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus } from 'lucide-react';

const mockData = [
  {
    id: 1,
    transactionNumber: '864708067921968025110074420',
    amount: 25,
    simCard: '898602B3061970012345',
    status: 'successful',
    orderType: 'Успешно',
    equipmentAddress: 'Цветочный район',
    equipmentNumber: '12345',
    simManufacturer: 'Китай мобильный (Пекин)',
    simVendor: 'China Mobile',
    recipient: '15137386333',
    simCommerce: 'Commerce 1',
    simCardType: 'Type A',
    operand: 'Admin',
    activationStatus: 'Элемент',
    createdAt: '2025-07-20 14:30:00'
  }
];

export function SimCardOrders() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    transactionNumber: '',
    simCardNumber: '',
    status: 'all',
    operand: '',
    simCardType: 'all',
    amountFrom: 'select',
    amountTo: 'select',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const handleClear = () => {
    setFilters({
      transactionNumber: '',
      simCardNumber: '',
      status: 'all',
      operand: '',
      simCardType: 'all',
      amountFrom: 'select',
      amountTo: 'select',
      dateFrom: '',
      dateTo: ''
    });
  };

  const columns = [
    { key: 'id', label: '№' },
    { key: 'transactionNumber', label: t('sim.transactionNumber') },
    { key: 'amount', label: t('sim.amount') },
    { key: 'simCard', label: t('equipment.simCard') },
    {
      key: 'status',
      label: t('common.status'),
      render: (value: string) => (
        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
          {t('sim.successful')}
        </span>
      )
    },
    { key: 'orderType', label: t('sim.orderType') },
    { key: 'equipmentAddress', label: t('home.equipmentAddress') },
    { key: 'equipmentNumber', label: t('industrial.equipmentNumber') },
    { key: 'simManufacturer', label: 'SIM производитель' },
    { key: 'simVendor', label: t('sim.simVendor') },
    { key: 'recipient', label: t('sim.recipient') },
    { key: 'simCommerce', label: t('sim.simCommerce') },
    { key: 'simCardType', label: t('sim.simCardType') },
    { key: 'operand', label: t('sim.operand') },
    { key: 'activationStatus', label: t('sim.activationStatus') },
    { key: 'createdAt', label: t('common.createdAt') },
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Управление заказами SIM карт</h1>
        <ActionButton variant="success">
          <Plus className="w-4 h-4 mr-2 inline" />
          {t('sim.createOrder')}
        </ActionButton>
      </div>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t('sim.transactionNumber')}
          value={filters.transactionNumber}
          onChange={(value) => setFilters({ ...filters, transactionNumber: value })}
        />
        <FilterField
          label={t('sim.simCardNumber')}
          value={filters.simCardNumber}
          onChange={(value) => setFilters({ ...filters, simCardNumber: value })}
        />
        <FilterField
          label={t('common.status')}
          type="select"
          value={filters.status}
          onChange={(value) => setFilters({ ...filters, status: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'successful', label: t('sim.successful') }
          ]}
        />
        <FilterField
          label={t('sim.operand')}
          value={filters.operand}
          onChange={(value) => setFilters({ ...filters, operand: value })}
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
          label={`${t('sim.amount')} (${t('common.from')})`}
          type="select"
          value={filters.amountFrom}
          onChange={(value) => setFilters({ ...filters, amountFrom: value })}
          options={[
            { value: 'select', label: t('common.select') }
          ]}
        />
        <FilterField
          label={`${t('sim.amount')} (${t('common.to')})`}
          type="select"
          value={filters.amountTo}
          onChange={(value) => setFilters({ ...filters, amountTo: value })}
          options={[
            { value: 'select', label: t('common.select') }
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

      <div className="text-sm text-gray-600">
        Всего 1-19 из 19 записей
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
