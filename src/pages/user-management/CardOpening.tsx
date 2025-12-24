import { useState } from 'react';

export default function CardOpening() {
  const [activeTab, setActiveTab] = useState('opening');
  const [formData, setFormData] = useState({
    startCard: '',
    endCard: '',
    deviceId: '',
    merchantNumber: ''
  });

  const handleOpenCards = () => {
    console.log('Opening cards:', formData);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Otwieranie kart</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('opening')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'opening'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Otwieranie kart
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'records'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Rekordy otwarcia
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'log'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Dziennik
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'opening' && (
            <>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Karta początkowa
                  </label>
                  <input
                    type="text"
                    value={formData.startCard}
                    onChange={(e) => setFormData({ ...formData, startCard: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wprowadź kartę początkową"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Karta końcowa
                  </label>
                  <input
                    type="text"
                    value={formData.endCard}
                    onChange={(e) => setFormData({ ...formData, endCard: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wprowadź kartę końcową"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID urządzenia
                  </label>
                  <input
                    type="text"
                    value={formData.deviceId}
                    onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wprowadź ID urządzenia"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numer kupca
                  </label>
                  <input
                    type="text"
                    value={formData.merchantNumber}
                    onChange={(e) => setFormData({ ...formData, merchantNumber: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Wprowadź numer kupca"
                  />
                </div>

                <div className="bg-[#FFF9E6] border border-[#FFD700] rounded p-3 text-sm text-gray-700">
                  Jest dostępna nowa wersja dziennika
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleOpenCards}
                    className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
                  >
                    Otwórz karty
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ważne zakresy</h3>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kupiec</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Początkowa</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Końcowa</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Imię</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Brak danych
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'records' && (
            <div className="text-center text-gray-500 py-12">
              Rekordy otwarcia - zawartość zakładki
            </div>
          )}

          {activeTab === 'log' && (
            <div className="text-center text-gray-500 py-12">
              Dziennik - zawartość zakładki
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}