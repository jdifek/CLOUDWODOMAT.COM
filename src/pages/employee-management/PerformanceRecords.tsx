import { useState } from 'react';
import { Search, X, Download } from 'lucide-react';

export default function PerformanceRecords() {
  const [filters, setFilters] = useState({
    employeeAccount: '',
    operator: '',
    resultYear: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = () => {
    console.log('Searching...', filters);
  };

  const handleClear = () => {
    setFilters({
      employeeAccount: '',
      operator: '',
      resultYear: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleExport = () => {
    console.log('Exporting data...');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Rejestr wyników pracowników</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Numer konta pracownika
            </label>
            <input
              type="text"
              value={filters.employeeAccount}
              onChange={(e) => setFilters({ ...filters, employeeAccount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Wprowadź numer konta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <input
              type="text"
              value={filters.operator}
              onChange={(e) => setFilters({ ...filters, operator: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Wprowadź operatora"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rok wyniku
            </label>
            <input
              type="text"
              value={filters.resultYear}
              onChange={(e) => setFilters({ ...filters, resultYear: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="np. 2025"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data od
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data do
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Szukaj
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Wyczyść
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Eksportuj dane
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numer konta pracownika</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kupiec</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota doładowania</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota faktyczna</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota w czasie wyniku</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liczba doładowań</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Okres wyniku</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas operacji</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rok wyniku</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td colSpan={12} className="px-6 py-12 text-center text-gray-500">
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