import { Plus } from 'lucide-react';

export default function PromoActivities() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Konfiguracja działań promocyjnych</h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Utwórz działanie
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nazwa działania</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Urządzenia z 1 dniem darmowej kwoty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">QR z darmową kwotą</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rzeczywista woda z kartą bez darmowej kwoty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">E-woda z kartą bez darmowej kwoty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Liczba urządzeń</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Okres ważności</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
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