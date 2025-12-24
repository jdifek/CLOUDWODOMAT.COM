import { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';

export default function CoinPaymentConfig() {
  const [formData, setFormData] = useState({
    machineCoins: '10.00',
    liquidCoins: '20.00',
    randomCoins: '10.00'
  });

  const handleSubmit = () => {
    console.log('Saving coin config:', formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Konfiguracja płatności monetami</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 space-y-2">
              <p>
                <strong>Uwaga:</strong> Jeśli kwota płatności jest większa niż kwota monet, wymagana jest obowiązkowa rejestracja, 
                usunięcie monet nie może być zaksięgowane na karcie elektronicznej, można używać wielokrotnie. 
                Jeśli monet jest mniej, można użyć tylko raz, na przykład 9 yuanów obsługuje tylko jedną płatność, 
                woda jest automatycznie odliczana 9 yuanów.
              </p>
              <p>
                <strong>Przykład:</strong> Jeśli monety są ustawione na 10 yuanów, płatność powyżej 10 yuanów wymaga rejestracji, 
                kwota jest doładowywana na kartę, można używać wielokrotnie; jeśli mniej niż 10 yuanów, na przykład 9 yuanów, 
                rejestracja nie jest wymagana, tylko jednorazowe użycie, użytkownik otrzymuje wodę automatycznie odlicza się 9 yuanów.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sprzedaż maszyny - złote monety
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.machineCoins}
              onChange={(e) => setFormData({ ...formData, machineCoins: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sprzedaż płynów - złote monety
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.liquidCoins}
              onChange={(e) => setFormData({ ...formData, liquidCoins: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Losowa maszyna - złote monety
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.randomCoins}
              onChange={(e) => setFormData({ ...formData, randomCoins: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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