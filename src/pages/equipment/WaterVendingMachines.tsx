/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { SearchFilter, FilterField } from '../../components/SearchFilter';
import { DataTable } from '../../components/DataTable';
import { ActionButton } from '../../components/ActionButton';
import { StatusIndicator } from '../../components/StatusIndicator';
import { useLanguage } from '../../contexts/LanguageContext';
import { Download, QrCode, Settings, Thermometer, Signal } from 'lucide-react';
import { api } from '../../services/api';

interface Device {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

interface MachineData {
  id: number;
  equipmentId: string;
  todaySales: number | null;
  currentSales: number | null;
  name: string;
  networkStatus: 'online' | 'offline';
  equipmentStatus: 'active' | 'inactive';
  temperature: number | null;
  outdoorTemp: number | null;
  version: string | null;
  signalStrength: number | null;
  territory: string | null;
  simCard: string | null;
  lastConnection: string | null;
  createdAt: string;
}

export function WaterVendingMachines() {
  const { t } = useLanguage();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    equipmentName: '',
    equipmentId: '',
    territorialZone: 'all',
    networkStatus: 'all',
    equipmentStatus: 'all',
    versionNumber: ''
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await api.get("/user/devices");
      setDevices(response.data);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Преобразуем Device в MachineData с прочерками для отсутствующих полей
  const machineData: MachineData[] = devices.map((device, index) => ({
    id: index + 1,
    equipmentId: device.code,
    todaySales: null,
    currentSales: null,
    name: device.name,
    networkStatus: 'offline', // По умолчанию offline, пока бэк не вернет
    equipmentStatus: 'inactive', // По умолчанию inactive, пока бэк не вернет
    temperature: null,
    outdoorTemp: null,
    version: null,
    signalStrength: null,
    territory: null,
    simCard: null,
    lastConnection: null,
    createdAt: device.createdAt
  }));

  const handleSearch = () => {
    console.log('Searching with filters:', filters);
    // TODO: Реализовать фильтрацию когда бэк будет готов
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
    { 
      key: 'todaySales', 
      label: t('equipment.todaySales'),
      render: (value: number | null) => value ?? '—'
    },
    { 
      key: 'currentSales', 
      label: t('equipment.currentSales'),
      render: (value: number | null) => value ?? '—'
    },
    { key: 'name', label: t('equipment.equipmentName') },
    {
      key: 'networkStatus',
      label: t('equipment.networkStatus'),
      render: (value: 'online' | 'offline') => (
        <StatusIndicator status={value} label={t(`common.${value}`)} />
      )
    },
    {
      key: 'equipmentStatus',
      label: t('equipment.equipmentStatus'),
      render: (value: 'active' | 'inactive') => (
        <StatusIndicator status={value} label={t(`common.${value}`)} />
      )
    },
    {
      key: 'temperature',
      label: t('equipment.temperature'),
      render: (value: number | null, row: any) => {
        if (value === null && row.outdoorTemp === null) return '—';
        return (
          <div className="flex items-center">
            <Thermometer className="w-4 h-4 mr-1 text-blue-500" />
            <span>{value ?? '—'}°C | {row.outdoorTemp ?? '—'}°C</span>
          </div>
        );
      }
    },
    { 
      key: 'version', 
      label: t('equipment.versionNumber'),
      render: (value: string | null) => value ?? '—'
    },
    {
      key: 'signalStrength',
      label: t('equipment.signalStrength'),
      render: (value: number | null) => {
        if (value === null) return '—';
        return (
          <div className="flex items-center">
            <Signal className="w-4 h-4 mr-1 text-green-500" />
            <span>{value}</span>
          </div>
        );
      }
    },
    { 
      key: 'territory', 
      label: t('equipment.territory'),
      render: (value: string | null) => value ?? '—'
    },
    { 
      key: 'simCard', 
      label: t('equipment.simCard'),
      render: (value: string | null) => value ?? '—'
    },
    { 
      key: 'lastConnection', 
      label: t('equipment.lastConnection'),
      render: (value: string | null) => value ?? '—'
    },
    { 
      key: 'createdAt', 
      label: t('common.createdAt'),
      render: (value: string) => new Date(value).toLocaleString()
    },
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

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('nav.waterVendingMachines')}</h1>
        <div className="flex justify-center items-center p-8">
          <div className="text-gray-500">{t('common.loading') || 'Загрузка...'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('nav.waterVendingMachines')}</h1>

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
        data={machineData}
        currentPage={1}
        totalPages={1}
        totalRecords={machineData.length}
      />
    </div>
  );
}