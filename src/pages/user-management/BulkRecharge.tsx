import { useState } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function BulkRecharge() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('bulk');
  const [formData, setFormData] = useState({
    startCard: '',
    endCard: '',
    amount: '',
    actualAmount: '',
    device: '',
    note: ''
  });

  const handleRecharge = () => {
    console.log('Bulk recharge:', formData);
  };

  const handleReturn = () => {
    window.history.back();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('bulkRecharge.title')}</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('bulk')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'bulk'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('bulkRecharge.bulkRechargeTab')}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'settings'
                  ? 'text-[#4A90E2] border-b-2 border-[#4A90E2]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('bulkRecharge.packageSettings')}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bulkRecharge.startCard')}
              </label>
              <input
                type="text"
                value={formData.startCard}
                onChange={(e) => setFormData({ ...formData, startCard: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('bulkRecharge.enterStartCard')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bulkRecharge.endCard')}
              </label>
              <input
                type="text"
                value={formData.endCard}
                onChange={(e) => setFormData({ ...formData, endCard: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('bulkRecharge.enterEndCard')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('bulkRecharge.amount')}
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                <button className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2">
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

            <div className="bg-[#FFE6E6] border border-[#D9534F] rounded p-3 text-sm text-[#D9534F]">
              {t('bulkRecharge.noPackagesError')}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleReturn}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors flex items-center gap-2"
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
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 py-4 border-t">
        <p>© Happy-ti 2025 | powered by Happy-ti</p>
      </div>
    </div>
  );
}