import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, Calendar, DollarSign, Package } from 'lucide-react';

interface SubscriptionData {
  id: string;
  status: string;
  price: number;
  devicesCount: number;
  currentPeriodEnd: string | null;
}

export function Subscription() {
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [devicesCount, setDevicesCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const basePrice = 10;

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const response = await api.get('/user/me');
      setSubscription(response.data.subscription);
    } catch {
      console.error('Failed to fetch subscription');
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await api.post('/subscription/checkout', { devicesCount });
      window.location.href = response.data.url;
    } catch {
      console.error('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => basePrice * devicesCount;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('subscription.title')}</h1>

      {subscription && subscription.status === 'ACTIVE' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t('subscription.currentSubscription')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="w-8 h-8 text-[#4A90E2]" />
              <div>
                <p className="text-sm text-gray-600">{t('subscription.status')}</p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {subscription.status.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-[#5CB85C]" />
              <div>
                <p className="text-sm text-gray-600">{t('subscription.price')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${subscription.price}/month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <CreditCard className="w-8 h-8 text-[#F0AD4E]" />
              <div>
                <p className="text-sm text-gray-600">{t('subscription.devicesCount')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.devicesCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-[#D9534F]" />
              <div>
                <p className="text-sm text-gray-600">{t('subscription.renewalDate')}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.currentPeriodEnd 
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {subscription?.status === 'ACTIVE' 
            ? t('subscription.upgradeSubscription') 
            : t('subscription.startSubscription')}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('subscription.numberOfDevices')}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={devicesCount}
              onChange={(e) => setDevicesCount(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{t('subscription.basePricePerDevice')}:</span>
              <span className="font-semibold text-gray-900">${basePrice}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">{t('subscription.devicesCount')}:</span>
              <span className="font-semibold text-gray-900">×{devicesCount}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                {t('subscription.totalMonthly')}:
              </span>
              <span className="text-2xl font-bold text-[#4A90E2]">${calculatePrice()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full px-6 py-3 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard className="w-5 h-5" />
            {loading ? t('subscription.processing') : t('subscription.proceedToPayment')}
          </button>
        </div>
      </div>
    </div>
  );
}