import { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function AuthorizationDetails() {
  const [filters, setFilters] = useState({
    employee: '',
    operator: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = () => {
    console.log('Searching...', filters);
  };

  const handleClear = () => {
    setFilters({
      employee: '',
      operator: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const records = [
    {
      id: 1,
      employee: '13289967016',
      operator: '15137386333',
      rechargeAmount: '20000',
      balanceAfter: '20000',
      note: '(Nie ustawiono)',
      time: '2025-12-18 08:27:02'
    },
    {
      id: 2,
      employee: '13698895725',
      operator: '15137386333',
      rechargeAmount: '20000',
      balanceAfter: '20000',
      note: '(Nie ustawiono)',
      time: '2025-10-30 08:25:41'
    },
    {
      id: 3,
      employee: '18625799572',
      operator: '15137386333',
      rechargeAmount: '50000',
      balanceAfter: '50000',
      note: '(Nie ustawiono)',
      time: '2025-05-13 09:54:21'
    },
    {
      id: 4,
      employee: '13698895725',
      operator: '15137386333',
      rechargeAmount: '20000',
      balanceAfter: '20000',
      note: 'Zapisano z logowania roboczego',
      time: '2025-05-13 09:54:11'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Szczegóły kwoty autoryzacyjnej</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pracownik
            </label>
            <input
              type="text"
              value={filters.employee}
              onChange={(e) => setFilters({ ...filters, employee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Wprowadź pracownika"
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
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
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

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">1-4 z 4 danych</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pracownik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Operator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota doładowania</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota po doładowaniu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uwaga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.map((record, idx) => (
                <tr key={record.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.employee}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.operator}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.rechargeAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.balanceAfter}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={record.note.includes('Nie ustawiono') ? 'text-[#D9534F]' : 'text-gray-900'}>
                      {record.note}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.time}</td>
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