import { useState } from 'react';
import { SearchFilter, FilterField } from '../../components/SearchFilter';
import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { StatusIndicator } from '../../components/StatusIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { Download, QrCode, Settings, Signal } from 'lucide-react';

export function LiquidVendingMachines() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    equipmentName: '',
    equipmentId: '',
    territorialZone: 'all',
    networkStatus: 'all',
    equipmentStatus: 'all',
    versionNumber: ''
  });

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const handleClear = () => {
    setFilters({
      equipmentName: '',
      equipmentId: '',
      territorialZone: 'all',
      networkStatus: 'all',
      equipmentStatus: 'all',
      versionNumber: ''
    });
  };

  const columns = [
    { key: 'id', label: '№' },
    { key: 'equipmentId', label: t('equipment.equipmentId') },
    { key: 'commerce', label: t('equipment.commerce') },
    { key: 'todaySales', label: t('equipment.todaySales') },
    { key: 'currentSales', label: t('equipment.currentSales') },
    { key: 'name', label: t('equipment.equipmentName') },
    {
      key: 'networkStatus',
      label: t('equipment.networkStatus'),
      render: (value: 'online' | 'offline') => (
        <StatusIndicator status={value} label={t(`common.${value}`)} />
      )
    },
    {
      key: 'status',
      label: t('common.status')
    },
    {
      key: 'signalStrength',
      label: t('equipment.signalStrength'),
      render: (value: number) => (
        <div className="flex items-center">
          <Signal className="w-4 h-4 mr-1 text-green-500" />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'territory', label: t('equipment.territory') },
    { key: 'simCard', label: t('equipment.simCard') },
    { key: 'lastConnection', label: t('equipment.lastConnection') },
    { key: 'createdAt', label: t('common.createdAt') },
    {
      key: 'operations',
      label: t('common.operations'),
      render: () => (
        <div className="flex gap-2">
          <ActionButton size="sm" variant="primary">
            {t('common.details')}
          </ActionButton>
          <ActionButton size="sm" variant="secondary">
            {t('common.view')}
          </ActionButton>
        </div>
      )
    },
    {
      key: 'qrCode',
      label: t('equipment.qrCode'),
      render: () => (
        <button className="p-1 hover:bg-gray-100 rounded">
          <QrCode className="w-5 h-5 text-gray-600" />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('nav.liquidVendingMachines')}</h1>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t('equipment.equipmentName')}
          value={filters.equipmentName}
          onChange={(value) => setFilters({ ...filters, equipmentName: value })}
        />
        <FilterField
          label={t('equipment.equipmentId')}
          value={filters.equipmentId}
          onChange={(value) => setFilters({ ...filters, equipmentId: value })}
        />
        <FilterField
          label={t('equipment.territorialZone')}
          type="select"
          value={filters.territorialZone}
          onChange={(value) => setFilters({ ...filters, territorialZone: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'zone1', label: 'Zone 1' },
            { value: 'zone2', label: 'Zone 2' }
          ]}
        />
        <FilterField
          label={t('equipment.networkStatus')}
          type="select"
          value={filters.networkStatus}
          onChange={(value) => setFilters({ ...filters, networkStatus: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'online', label: t('common.online') },
            { value: 'offline', label: t('common.offline') }
          ]}
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
        <FilterField
          label={t('equipment.versionNumber')}
          value={filters.versionNumber}
          onChange={(value) => setFilters({ ...filters, versionNumber: value })}
        />
      </SearchFilter>

      <div className="flex gap-2">
        <ActionButton variant="primary">
          <Settings className="w-4 h-4 mr-2 inline" />
          {t('equipment.zoneSettings')}
        </ActionButton>
        <ActionButton variant="danger">
          {t('equipment.deleteEquipment')}
        </ActionButton>
        <ActionButton variant="success">
          <Download className="w-4 h-4 mr-2 inline" />
          {t('common.export')}
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
