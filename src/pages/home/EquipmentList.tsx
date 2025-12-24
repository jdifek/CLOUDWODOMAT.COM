import { useState } from 'react';
import { SearchFilter, FilterField } from '../../components/SearchFilter';
import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { useLanguage } from '../../contexts/LanguageContext';
import { Signal, Droplet } from 'lucide-react';

export function EquipmentList() {
  const { t } = useLanguage();
  const [filters, setFilters] = useState({
    doorNumber: '',
    equipmentId: '',
    equipmentModel: 'all',
    equipmentStatus: 'all',
    productType: '',
    userName: '',
    userPhone: '',
    installer: '',
    district: 'all',
    building: 'all',
    unit: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
  };

  const handleClear = () => {
    setFilters({
      doorNumber: '',
      equipmentId: '',
      equipmentModel: 'all',
      equipmentStatus: 'all',
      productType: '',
      userName: '',
      userPhone: '',
      installer: '',
      district: 'all',
      building: 'all',
      unit: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const columns = [
    { key: 'id', label: '№' },
    { key: 'equipmentId', label: t('equipment.equipmentId') },
    {
      key: 'todayPurification',
      label: t('home.todayPurification'),
      render: (value: number) => (
        <div className="flex items-center">
          <Droplet className="w-4 h-4 mr-1 text-blue-500" />
          <span>{value}L</span>
        </div>
      )
    },
    { key: 'userInfo', label: t('home.userInfo') },
    { key: 'doorNumber', label: t('home.doorNumber') },
    {
      key: 'signal',
      label: t('equipment.signalStrength'),
      render: (value: number) => (
        <div className="flex items-center">
          <Signal className="w-4 h-4 mr-1 text-green-500" />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'waterQuality', label: t('home.waterQuality') },
    { key: 'status', label: t('common.status') },
    { key: 'model', label: t('home.equipmentModel') },
    { key: 'remainingWater', label: t('home.remainingWater') },
    { key: 'filterLifespan', label: t('home.filterLifespan') },
    { key: 'location', label: t('home.location') },
    { key: 'district', label: t('home.district') },
    { key: 'createdAt', label: t('common.createdAt') }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('nav.equipmentList')}</h1>

      <SearchFilter onSearch={handleSearch} onClear={handleClear}>
        <FilterField
          label={t('home.doorNumber')}
          value={filters.doorNumber}
          onChange={(value) => setFilters({ ...filters, doorNumber: value })}
        />
        <FilterField
          label={t('equipment.equipmentId')}
          value={filters.equipmentId}
          onChange={(value) => setFilters({ ...filters, equipmentId: value })}
        />
        <FilterField
          label={t('home.equipmentModel')}
          type="select"
          value={filters.equipmentModel}
          onChange={(value) => setFilters({ ...filters, equipmentModel: value })}
          options={[
            { value: 'all', label: t('common.all') },
            { value: 'model1', label: 'Model 1' },
            { value: 'model2', label: 'Model 2' }
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
          label={t('home.productType')}
          value={filters.productType}
          onChange={(value) => setFilters({ ...filters, productType: value })}
        />
        <FilterField
          label={t('home.userName')}
          value={filters.userName}
          onChange={(value) => setFilters({ ...filters, userName: value })}
        />
        <FilterField
          label={t('home.userPhone')}
          value={filters.userPhone}
          onChange={(value) => setFilters({ ...filters, userPhone: value })}
        />
        <FilterField
          label={t('home.installer')}
          value={filters.installer}
          onChange={(value) => setFilters({ ...filters, installer: value })}
        />
        <FilterField
          label={t('home.district')}
          type="select"
          value={filters.district}
          onChange={(value) => setFilters({ ...filters, district: value })}
          options={[
            { value: 'all', label: t('home.districtName') }
          ]}
        />
        <FilterField
          label={t('home.building')}
          type="select"
          value={filters.building}
          onChange={(value) => setFilters({ ...filters, building: value })}
          options={[
            { value: 'all', label: t('home.building') }
          ]}
        />
        <FilterField
          label={t('home.unit')}
          type="select"
          value={filters.unit}
          onChange={(value) => setFilters({ ...filters, unit: value })}
          options={[
            { value: 'all', label: t('home.unit') }
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
          {t('home.districtSettings')}
        </ActionButton>
        <ActionButton variant="warning">
          {t('home.buildingSettings')}
        </ActionButton>
        <ActionButton variant="primary">
          {t('home.periodReport')}
        </ActionButton>
      </div>

      <div className="text-sm text-gray-600">
        {t('common.total')} 0 {t('common.records')} | {t('home.productionIndicator')} 0L
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
