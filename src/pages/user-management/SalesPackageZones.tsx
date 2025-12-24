import { Plus } from 'lucide-react';

export default function SalesPackageZones() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lista stref pakietów</h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj strefę pakietu
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strefa pakietu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas utworzenia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas aktualizacji</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
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

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}