import { useState } from 'react';
import { Save } from 'lucide-react';

export default function GiftConfig() {
  const [formData, setFormData] = useState({
    bindingGift: '',
    bindingPackage: '',
    eCardGift: '0',
    eCardPackage: ''
  });

  const handleSubmit = () => {
    console.log('Saving gift config:', formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Konfiguracja prezentów</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prezent przy powiązaniu mikrosygnału (yuan)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.bindingGift}
              onChange={(e) => setFormData({ ...formData, bindingGift: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pakiet prezentu przy powiązaniu mikrosygnału
            </label>
            <select
              value={formData.bindingPackage}
              onChange={(e) => setFormData({ ...formData, bindingPackage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Wybierz pakiet</option>
              <option value="basic">Podstawowy</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prezentowa karta elektroniczna (yuan)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.eCardGift}
              onChange={(e) => setFormData({ ...formData, eCardGift: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pakiet prezentowej karty elektronicznej
            </label>
            <select
              value={formData.eCardPackage}
              onChange={(e) => setFormData({ ...formData, eCardPackage: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Wybierz pakiet</option>
              <option value="basic">Podstawowy</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Zapisz
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}