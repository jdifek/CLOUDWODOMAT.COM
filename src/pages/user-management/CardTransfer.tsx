import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function CardTransfer() {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    merchantBefore: '',
    merchantAfter: '',
    giftAmount: '',
    actualAmount: ''
  });

  const handleStartTransfer = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      cardNumber: '',
      merchantBefore: '',
      merchantAfter: '',
      giftAmount: '',
      actualAmount: ''
    });
  };

  const handleSubmit = () => {
    console.log('Transfer submitted:', formData);
    handleCloseModal();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('cardTransfer.title')}</h1>
        <button
          onClick={handleStartTransfer}
          className="px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t('cardTransfer.startTransfer')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">№</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.cardNumber')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.merchantBefore')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.merchantAfter')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.giftAmountAfter')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.actualAmountAfter')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.operator')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('common.status')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('cardTransfer.time')}</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                  {t('common.noData')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{t('cardTransfer.startCardTransfer')}</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardTransfer.cardNumber')}
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('cardTransfer.enterCardNumber')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardTransfer.merchantBefore')}
                </label>
                <input
                  type="text"
                  value={formData.merchantBefore}
                  onChange={(e) => setFormData({ ...formData, merchantBefore: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('cardTransfer.enterMerchantBefore')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardTransfer.merchantAfter')}
                </label>
                <input
                  type="text"
                  value={formData.merchantAfter}
                  onChange={(e) => setFormData({ ...formData, merchantAfter: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('cardTransfer.enterMerchantAfter')}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardTransfer.giftAmountAfter')}
                </label>
                <input
                  type="number"
                  value={formData.giftAmount}
                  onChange={(e) => setFormData({ ...formData, giftAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('cardTransfer.actualAmountAfter')}
                </label>
                <input
                  type="number"
                  value={formData.actualAmount}
                  onChange={(e) => setFormData({ ...formData, actualAmount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors"
              >
                {t('common.confirm')}
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