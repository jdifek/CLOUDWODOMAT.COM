import { useState } from 'react';
import { Search, X, Download, BarChart3 } from 'lucide-react';

export default function ConsumptionLog() {
  const [activeYear, setActiveYear] = useState('2025');
  const [activeView, setActiveView] = useState('year');
  const [filters, setFilters] = useState({
    cardNumber: '',
    consumptionType: 'all',
    region: 'all',
    deviceId: '',
    place: '',
    merchant: '',
    waterOutput: 'all',
    amountFrom: '',
    amountTo: '',
    dateFrom: '',
    dateTo: ''
  });

  const years = ['2025', '2024', '2023', '2022', '2021', 'Wcześniej'];

  const handleSearch = () => {
    console.log('Searching...', filters);
  };

  const handleClear = () => {
    setFilters({
      cardNumber: '',
      consumptionType: 'all',
      region: 'all',
      deviceId: '',
      place: '',
      merchant: '',
      waterOutput: 'all',
      amountFrom: '',
      amountTo: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const sampleData = [
    {
      id: 1,
      number: '60650898006',
      user: 'Nie podłączony',
      place: 'Słodka woda',
      deviceId: '869966071031852',
      amount: '4.16',
      income: '0.00',
      gift: '4.16',
      balanceAfter: '5511.12',
      type: 'Karta',
      output: '1 droga',
      liters: '4.1',
      loadTime: '2025-12-19 18:08:13',
      deviceTime: '2025-12-19 18:08:10'
    }
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Dziennik zużycia</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                  activeYear === year
                    ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Numer karty</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.cardNumber}
                  onChange={(e) => setFilters({ ...filters, cardNumber: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Typ zużycia</label>
              <select
                value={filters.consumptionType}
                onChange={(e) => setFilters({ ...filters, consumptionType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie</option>
                <option value="card">Karta</option>
                <option value="cash">Gotówka</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => setFilters({ ...filters, region: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID urządzenia</label>
              <input
                type="text"
                value={filters.deviceId}
                onChange={(e) => setFilters({ ...filters, deviceId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Miejsce</label>
              <input
                type="text"
                value={filters.place}
                onChange={(e) => setFilters({ ...filters, place: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kupiec</label>
              <input
                type="text"
                value={filters.merchant}
                onChange={(e) => setFilters({ ...filters, merchant: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Wyjście wody</label>
              <select
                value={filters.waterOutput}
                onChange={(e) => setFilters({ ...filters, waterOutput: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Wszystkie</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kwota od</label>
                <input
                  type="number"
                  value={filters.amountFrom}
                  onChange={(e) => setFilters({ ...filters, amountFrom: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Do</label>
                <input
                  type="number"
                  value={filters.amountTo}
                  onChange={(e) => setFilters({ ...filters, amountTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
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

          <div className="flex items-center justify-between mb-4">
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

          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              <div className="text-sm">
                Zużycie: <span className="text-[#FFD700] font-bold text-lg">1627130.26</span>
              </div>
              <div className="text-sm">
                Dochód: <span className="text-[#FFD700] font-bold text-lg">7886.09</span>
              </div>
              <div className="text-sm">
                Prezenty: <span className="text-[#FFD700] font-bold text-lg">381.81</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('year')}
                className={`px-3 py-1 text-sm rounded ${
                  activeView === 'year' ? 'bg-[#4A90E2] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Rok
              </button>
              <button
                onClick={() => setActiveView('month')}
                className={`px-3 py-1 text-sm rounded ${
                  activeView === 'month' ? 'bg-[#4A90E2] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Miesiąc
              </button>
              <button
                onClick={() => setActiveView('day')}
                className={`px-3 py-1 text-sm rounded ${
                  activeView === 'day' ? 'bg-[#4A90E2] text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Dzień
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Eksport
            </button>
            <button className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Statystyka
            </button>
            <span className="text-sm text-gray-500 flex items-center">?</span>
          </div>

          <div className="text-sm text-gray-600 mb-2">1-20 z 10,336</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Użytkownik</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Miejsce</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID urządzenia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kwota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dochód</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prezent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Saldo po</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Typ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wyjście</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Litry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas załadunku</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas urządzenia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sampleData.map((row, idx) => (
                <tr key={row.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <a href="#" className="text-[#4A90E2] hover:underline">{row.number}</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.user}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.place}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.deviceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.amount}₽</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.income}₽</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.gift}₽</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.balanceAfter}₽</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.output}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.liters}л</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.loadTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.deviceTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-[#4A90E2] hover:underline text-xs">Szczegóły</button>
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