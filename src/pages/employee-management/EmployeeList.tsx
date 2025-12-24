import { useState } from 'react';
import { Search, X, Plus, Zap, Eye, Trash2 } from 'lucide-react';

export default function EmployeeList() {
  const [filters, setFilters] = useState({
    accountName: '',
    surname: '',
    minBalance: '',
    maxBalance: '',
    dateFrom: '',
    dateTo: ''
  });

  const handleSearch = () => {
    console.log('Searching...', filters);
  };

  const handleClear = () => {
    setFilters({
      accountName: '',
      surname: '',
      minBalance: '',
      maxBalance: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const employees = [
    {
      id: 1,
      account: '18303695886',
      password: '******',
      surname: 'Testowy Wei',
      created: '2024-11-02 16:24:50',
      balance: '0.00',
      operationTime: '(Nie ustawiono)'
    },
    {
      id: 2,
      account: '18625799572',
      password: '*******',
      surname: 'Wang Jianxin',
      created: '2024-11-29 09:46:18',
      balance: '45000.00',
      operationTime: '(Nie ustawiono)'
    },
    {
      id: 3,
      account: '13289967016',
      password: '*******',
      surname: 'Ma Gong',
      created: '2025-12-18 08:26:36',
      balance: '20000.00',
      operationTime: '(Nie ustawiono)'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Lista pracowników</h1>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa konta
            </label>
            <input
              type="text"
              value={filters.accountName}
              onChange={(e) => setFilters({ ...filters, accountName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Wprowadź nazwę konta"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nazwisko
            </label>
            <input
              type="text"
              value={filters.surname}
              onChange={(e) => setFilters({ ...filters, surname: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Wprowadź nazwisko"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo minimalne
              </label>
              <input
                type="number"
                value={filters.minBalance}
                onChange={(e) => setFilters({ ...filters, minBalance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Saldo maksymalne
              </label>
              <input
                type="number"
                value={filters.maxBalance}
                onChange={(e) => setFilters({ ...filters, maxBalance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="col-span-2 grid grid-cols-2 gap-2">
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

      <div className="flex gap-2">
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj pracownika
        </button>
        <button className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Doładowanie zbiorcze
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600 mb-4">1-3 z 3 danych</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa konta pracownika</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hasło</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwisko</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas utworzenia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas operacji</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee, idx) => (
                <tr key={employee.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.account}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{employee.password}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.surname}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.balance}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D9534F]">{employee.operationTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button className="px-3 py-1 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        Szczegóły
                      </button>
                      <button className="px-3 py-1 bg-[#F0AD4E] text-white rounded hover:bg-[#E09D3E] transition-colors text-xs">
                        Wynik
                      </button>
                      <button className="px-3 py-1 bg-[#D9534F] text-white rounded hover:bg-[#C9433F] transition-colors text-xs flex items-center gap-1">
                        <Trash2 className="w-3 h-3" />
                        Usuń
                      </button>
                    </div>
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