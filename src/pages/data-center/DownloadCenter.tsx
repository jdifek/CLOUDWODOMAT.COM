import { useState } from 'react';

export default function DownloadCenter() {
  const [filters, setFilters] = useState({
    module: 'all',
    status: 'all',
    operator: '',
    dateFrom: '',
    dateTo: ''
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Centrum pobierania</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Moduł</label>
            <select
              value={filters.module}
              onChange={(e) => setFilters({ ...filters, module: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie</option>
              <option value="cards">Karty</option>
              <option value="recharges">Doładowania</option>
              <option value="consumption">Zużycie</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Wszystkie</option>
              <option value="completed">Ukończone</option>
              <option value="processing">W trakcie</option>
              <option value="failed">Niepowodzenie</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
            <input
              type="text"
              value={filters.operator}
              onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Operator"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data od</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Do</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Moduł</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operacja</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Opis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Postęp (w przybliżeniu)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utworzono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ukończono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Do</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td colSpan={11} className="px-6 py-12 text-center text-gray-500">
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