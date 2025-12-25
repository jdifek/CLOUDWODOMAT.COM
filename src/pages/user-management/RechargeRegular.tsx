import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function RechargeRegular() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('regular');
  const [formData, setFormData] = useState({
    cardNumber: '',
    rechargeAmount: '',
    actualAmount: '',
    device: '',
    note: ''
  });

  const [showDeviceSearch, setShowDeviceSearch] = useState(false);

  const handleRecharge = () => {
    console.log('Recharge:', formData);
  };

  const handleReturn = () => {
    window.history.back();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('recharge.title')}</h1>

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
              {t('recharge.regular')}
            </button>
            <button
              onClick={() => setActiveTab('batch')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'batch'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('recharge.batch')}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'regular' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('recharge.cardNumber')}
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('recharge.enterCardNumber')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('recharge.rechargeAmount')}
                </label>
                <input
                  type="number"
                  value={formData.rechargeAmount}
                  onChange={(e) => setFormData({ ...formData, rechargeAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('recharge.actualReceived')}
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
                  {t('recharge.device')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.device}
                    onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t('recharge.selectDevice')}
                  />
                  <button
                    onClick={() => setShowDeviceSearch(true)}
                    className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {t('common.search')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('recharge.note')}
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={t('recharge.enterNote')}
                />
              </div>

              <div className="bg-[#FFF9E6] border border-[#FFD700] rounded p-3 text-sm text-gray-700">
                {t('recharge.autoPackageInfo')}
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={handleReturn}
                  className="px-6 py-2 bg-[#D9534F] text-white rounded hover:bg-[#C9433F] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('recharge.return')}
                </button>
                <button
                  onClick={handleRecharge}
                  className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
                >
                  {t('recharge.rechargeButton')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'batch' && (
            <div className="text-center text-gray-500 py-12">
              {t('recharge.batchTabContent')}
            </div>
          )}
        </div>
      </div>

      {showDeviceSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('recharge.searchDevice')}</h2>
              <button
                onClick={() => setShowDeviceSearch(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <div className="mb-4">
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('recharge.searchDevicePlaceholder')}
              />
            </div>

            <div className="border border-gray-200 rounded max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('recharge.deviceId')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('recharge.deviceName')}</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">{t('common.operations')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      {t('common.noData')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowDeviceSearch(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {t('recharge.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}