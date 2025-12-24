import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function PackageManagement() {
  const [recommendEnabled, setRecommendEnabled] = useState(false);
  const [modifyEnabled, setModifyEnabled] = useState(true);

  const [filters, setFilters] = useState({
    packageName: '',
    price: '',
    giftAmount: '',
    freeGifts: '',
    packageType: '',
    userLimit: '',
    channels: '',
    giftPeriod: '',
    redemptionPeriod: '',
    createTime: '',
    status: 'all'
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Zarządzanie pakietami</h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Utwórz pakiet
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center gap-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Rekomendacja pakietów według efektywności</span>
            <button
              onClick={() => setRecommendEnabled(!recommendEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                recommendEnabled ? 'bg-[#5CB85C]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  recommendEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500">{recommendEnabled ? 'Wł' : 'Wył'}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Zmiana pakietów według efektywności</span>
            <button
              onClick={() => setModifyEnabled(!modifyEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                modifyEnabled ? 'bg-[#5CB85C]' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  modifyEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-gray-500">{modifyEnabled ? 'Wł' : 'Wył'}</span>
          </div>

          <a href="#" className="text-sm text-[#4A90E2] hover:underline">Zobacz przykład</a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Nazwa pakietu</div>
                  <input
                    type="text"
                    value={filters.packageName}
                    onChange={(e) => setFilters({ ...filters, packageName: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Nazwa"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Cena sprzedaży</div>
                  <input
                    type="text"
                    value={filters.price}
                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Kwota prezentu</div>
                  <input
                    type="text"
                    value={filters.giftAmount}
                    onChange={(e) => setFilters({ ...filters, giftAmount: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Darmowe prezenty</div>
                  <input
                    type="text"
                    value={filters.freeGifts}
                    onChange={(e) => setFilters({ ...filters, freeGifts: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Typ pakietu</div>
                  <select
                    value={filters.packageType}
                    onChange={(e) => setFilters({ ...filters, packageType: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="">Wybierz</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Limit użytkownika</div>
                  <select
                    value={filters.userLimit}
                    onChange={(e) => setFilters({ ...filters, userLimit: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="">Wszystkie</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Kanały</div>
                  <select
                    value={filters.channels}
                    onChange={(e) => setFilters({ ...filters, channels: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="">Wszystkie</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Okres prezentu (dni)</div>
                  <input
                    type="text"
                    value={filters.giftPeriod}
                    onChange={(e) => setFilters({ ...filters, giftPeriod: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Okres realizacji (dni)</div>
                  <input
                    type="text"
                    value={filters.redemptionPeriod}
                    onChange={(e) => setFilters({ ...filters, redemptionPeriod: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Czas utworzenia</div>
                  <input
                    type="text"
                    value={filters.createTime}
                    onChange={(e) => setFilters({ ...filters, createTime: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Status</div>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="all">Wszystkie</option>
                    <option value="active">Aktywny</option>
                    <option value="inactive">Nieaktywny</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td colSpan={13} className="px-6 py-12 text-center text-gray-500">
                  Brak danych
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}