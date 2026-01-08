/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, User, CreditCard, Package } from 'lucide-react';

export function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      setUser(response.data);
    } catch {
      console.error('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-12">User not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/admin/users')}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.userDetails')}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user.email}</h2>
            <p className="text-sm text-gray-600">
              {user.name} {user.surname}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-600">{t('admin.phoneLabel')}</p>
            <p className="text-gray-900">{user.phone || t('admin.notSet')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('admin.companyLabel')}</p>
            <p className="text-gray-900">{user.company || t('admin.notSet')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('admin.role')}</p>
            <p className="text-gray-900">{user.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('admin.createdAt')}</p>
            <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
</div>
</div>
</div>  {user.subscription && (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="w-5 h-5 text-[#4A90E2]" />
        <h3 className="text-lg font-semibold text-gray-900">{t('admin.subscription')}</h3>
      </div>      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">{t('subscription.status')}</p>
          <p className="text-gray-900 capitalize">{user.subscription.status}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('subscription.price')}</p>
          <p className="text-gray-900">${user.subscription.price}/month</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('subscription.devicesCount')}</p>
          <p className="text-gray-900">{user.subscription.devicesCount}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">{t('subscription.renewalDate')}</p>
          <p className="text-gray-900">
            {user.subscription.currentPeriodEnd
              ? new Date(user.subscription.currentPeriodEnd).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  )}  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center gap-2 mb-4">
      <Package className="w-5 h-5 text-[#4A90E2]" />
      <h3 className="text-lg font-semibold text-gray-900">{t('admin.devices')}</h3>
    </div>    {user.devices && user.devices.length > 0 ? (
      <div className="space-y-2">
        {user.devices.map((device: any) => (
          <div key={device.id} className="p-3 bg-gray-50 rounded-lg flex justify-between">
            <span className="font-medium">{device.name}</span>
            <span className="text-gray-600">{device.code}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-600">{t('devices.noDevices')}</p>
    )}
  </div>  {user.payments && user.payments.length > 0 && (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('admin.paymentHistory')}
      </h3>      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                {t('admin.date')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                {t('admin.amount')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                {t('admin.status')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {user.payments.map((payment: any) => (
              <tr key={payment.id}>
                <td className="px-4 py-2 text-sm text-gray-900">
                  {new Date(payment.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900">
                  ${payment.amount}
                </td>
                <td className="px-4 py-2 text-sm">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                    {payment.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}
</div>
);
}