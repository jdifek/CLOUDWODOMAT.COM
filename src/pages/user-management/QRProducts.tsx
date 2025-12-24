import { useState } from 'react';
import { Plus, Eye } from 'lucide-react';

export default function QRProducts() {
  const [filters, setFilters] = useState({
    price: '',
    name: '',
    sort: '',
    status: 'all',
    time: ''
  });

  const products = [
    { id: 1, price: '10', name: '10 yuanów 10L', sort: '-', status: 'Opublikowane', created: '2025-11-21 15:43:21' },
    { id: 2, price: '5', name: '5 yuanów 5L', sort: '-', status: 'Opublikowane', created: '2025-11-21 15:43:12' },
    { id: 3, price: '1', name: '1 yuan 1L', sort: '-', status: 'Opublikowane', created: '2025-11-21 15:43:02' },
    { id: 4, price: '2', name: '7.5', sort: '-', status: 'Opublikowane', created: '2025-05-07 09:01:34' },
    { id: 5, price: '6', name: '1升', sort: '-', status: 'Opublikowane', created: '2023-10-23 11:02:31' },
    { id: 6, price: '6', name: 'Pranie ubrań', sort: '-', status: 'Opublikowane', created: '2023-10-23 11:02:20' },
    { id: 7, price: '6', name: '1', sort: '-', status: 'Opublikowane', created: '2023-10-23 10:41:44' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lista produktów według kodów QR</h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj nowy produkt
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">1-7 z 7 danych</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
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
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Nazwa</div>
                  <input
                    type="text"
                    value={filters.name}
                    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left">
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Sortowanie</div>
                  <input
                    type="text"
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
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
                  <div className="text-xs font-medium text-gray-500 uppercase mb-2">Czas utworzenia</div>
                  <input
                    type="text"
                    value={filters.time}
                    onChange={(e) => setFilters({ ...filters, time: e.target.value })}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, idx) => (
                <tr key={product.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.sort}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 bg-[#5CB85C] text-white rounded text-xs">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.created}</td>
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