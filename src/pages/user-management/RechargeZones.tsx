import { Plus, Eye } from 'lucide-react';

export default function RechargeZones() {
  const zones = [
    { id: 1, zone: '1', created: '2025-03-29 21:02:32', updated: '2025-03-29 21:02:32' },
    { id: 2, zone: '1', created: '2025-03-29 21:02:18', updated: '2025-03-29 21:02:18' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Lista stref doładowania</h1>
        <button className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Dodaj strefę doładowania
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">1-2 z 2 danych</div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Strefa doładowania</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas utworzenia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Czas aktualizacji</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Akcje</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {zones.map((zone, idx) => (
                <tr key={zone.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.zone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.created}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{zone.updated}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-gray-600 hover:text-gray-800">
                      <Eye className="w-4 h-4" />
                    </button>
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