import { useState } from 'react';
import { Search, Calendar } from 'lucide-react';

export default function RechargeBatch() {
  const [activeTab, setActiveTab] = useState('batch');
  const [formData, setFormData] = useState({
    cardNumber: '',
    actualAmount: '',
    expiryDate: '',
    device: '',
    note: '',
    package: ''
  });

  const handleRecharge = () => {
    console.log('Batch recharge:', formData);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Doładowanie</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('regular')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'regular'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Zwykłe
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'batch'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pakietowe
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numer karty
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Wprowadź numer karty"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Faktycznie otrzymano
              </label>
              <input
                type="number"
                value={formData.actualAmount}
                onChange={(e) => setFormData({ ...formData, actualAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data wygaśnięcia
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Urządzenie
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Wybierz urządzenie"
                />
                <button className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Szukaj
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Uwaga
              </label>
              <textarea
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Wprowadź uwagę"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wybór pakietu
              </label>
              <select
                value={formData.package}
                onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Wybierz pakiet</option>
              </select>
            </div>

            <div className="bg-[#FFE6E6] border border-[#D9534F] rounded p-3 text-sm text-[#D9534F]">
              Brak pakietów, najpierw skonfiguruj
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleRecharge}
                className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
              >
                Doładuj
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}