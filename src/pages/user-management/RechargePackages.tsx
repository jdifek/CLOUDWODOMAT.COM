import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';

export default function RechargePackages() {
  const [filters, setFilters] = useState({
    name: '',
    type: '',
    price: '',
    discount: '',
    status: 'all',
    usage: 'all'
  });

  const packages = [
    { id: 1, name: 'Doładowanie 500 otrzymaj 500', type: 'Online', price: '500', discount: '500', status: 'Opublikowane', usage: 'Bez ograniczeń' },
    { id: 2, name: 'Doładowanie 300 otrzymaj 300', type: 'Online', price: '300', discount: '300', status: 'Opublikowane', usage: 'Bez ograniczeń' },
    { id: 3, name: 'Doładowanie 200 otrzymaj 200', type: 'Online', price: '200', discount: '200', status: 'Opublikowane', usage: 'Bez ograniczeń' },
    { id: 4, name: 'Doładowanie 100 otrzymaj 100', type: 'Online', price: '100', discount: '120', status: 'Opublikowane', usage: 'Bez ograniczeń' },
    { id: 5, name: 'Doładowanie 50 otrzymaj 50', type: 'Online', price: '50', discount: '50', status: 'Opublikowane', usage: 'Bez ograniczeń' },
    { id: 6, name: 'Doładowanie 20 otrzymaj 20', type: 'Online', price: '20', discount: '20', status: 'Opublikowane', usage: 'Bez ograniczeń' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lista pakietów</h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj nowe pakiety doładowania
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">1-6 z 6 danych</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Nazwa pakietu</div>
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    placeholder="Nazwa"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Typ</div>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="">Wybierz</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Cena</div>
                  <input
                    type="text"
                    value={filters.price}
                    onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Faktyczna zniżka</div>
                  <input
                    type="text"
                    value={filters.discount}
                    onChange={(e) => setFilters({ ...filters, discount: e.target.value })}
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
                    <option value="published">Opublikowane</option>
                    <option value="draft">Szkic</option>
                  </select>
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Liczba użyć</div>
                  <select
                    value={filters.usage}
                    onChange={(e) => setFilters({ ...filters, usage: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="all">Wszystkie</option>
                    <option value="unlimited">Bez ograniczeń</option>
                    <option value="limited">Ograniczone</option>
                  </select>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {packages.map((pkg, idx) => (
                <tr key={pkg.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.discount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-[#5CB85C] text-white rounded text-xs">
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{pkg.usage}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-gray-600 hover:text-gray-800">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
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