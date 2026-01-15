/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { ArrowLeft, User, CreditCard, Package, Trash2 } from 'lucide-react';

export function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [deviceForm, setDeviceForm] = useState({ name: '', code: '' });
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionForm, setSubscriptionForm] = useState({
    status: 'ACTIVE',
    price: '',
    devicesCount: '',
    currentPeriodEnd: ''
  });

  // Базовая цена из ENV (в продакшене это будет process.env.BASE_PRICE)
  const BASE_PRICE = 47; // Замени на реальное значение из ENV

  // Автоматический расчет цены и количества устройств
  const calculatedDevicesCount = user?.devices?.length || 0;
  const calculatedPrice = BASE_PRICE * calculatedDevicesCount;

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await api.get(`/admin/users/${id}`);
      setUser(response.data);
      
      // Prefill subscription form if exists
      if (response.data.subscription) {
        setSubscriptionForm({
          status: response.data.subscription.status,
          price: response.data.subscription.price.toString(),
          devicesCount: response.data.subscription.devicesCount.toString(),
          currentPeriodEnd: response.data.subscription.currentPeriodEnd 
            ? new Date(response.data.subscription.currentPeriodEnd).toISOString().split('T')[0]
            : ''
        });
      }
    } catch {
      console.error('Failed to fetch user');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      await api.put(`/admin/users/${id}`, editData);
      setEditMode(false);
      fetchUser();
    } catch {
      console.error('Failed to update user');
      alert('Failed to update user');
    }
  };

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/admin/users/${id}/devices`, deviceForm);
      setShowDeviceModal(false);
      setDeviceForm({ name: '', code: '' });
      fetchUser();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to add device');
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm(t('admin.deleteDeviceConfirm'))) return;
    
    try {
      await api.delete(`/admin/devices/${deviceId}`);
      fetchUser();
    } catch {
      console.error('Failed to delete device');
      alert('Failed to delete device');
    }
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = {
        status: subscriptionForm.status,
        price: user.subscription ? parseFloat(subscriptionForm.price) : calculatedPrice,
        devicesCount: user.subscription ? parseInt(subscriptionForm.devicesCount) : calculatedDevicesCount,
        currentPeriodEnd: subscriptionForm.currentPeriodEnd ? new Date(subscriptionForm.currentPeriodEnd).toISOString() : null
      };

      if (user.subscription) {
        await api.put(`/admin/subscriptions/${user.subscription.id}`, data);
      } else {
        await api.post('/admin/subscriptions', { ...data, userId: id });
      }
      
      setShowSubscriptionModal(false);
      fetchUser();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to save subscription');
    }
  };

  const handleDeleteSubscription = async () => {
    if (!confirm(t('admin.deleteSubscriptionConfirm'))) return;
    
    try {
      await api.delete(`/admin/subscriptions/${user.subscription.id}`);
      fetchUser();
      setShowSubscriptionModal(false);
    } catch {
      console.error('Failed to delete subscription');
      alert('Failed to delete subscription');
    }
  };

  const handleDeleteUser = async () => {
    if (!confirm(`${t('admin.deleteUserConfirm')}: ${user.email}?`)) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      navigate('/admin/users');
    } catch {
      console.error('Failed to delete user');
      alert('Failed to delete user');
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{t('admin.userDetails')}</h1>
        </div>
        <div className="flex gap-2">
          {editMode ? (
            <>
              <button 
                onClick={handleSaveUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                {t('admin.save')}
              </button>
              <button 
                onClick={() => {
                  setEditMode(false);
                  setEditData({});
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {t('admin.cancel')}
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => {
                  setEditMode(true);
                  setEditData({
                    name: user.name || '',
                    surname: user.surname || '',
                    phone: user.phone || '',
                    company: user.company || '',
                    role: user.role
                  });
                }}
                className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8]"
              >
                {t('admin.edit')}
              </button>
              <button 
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                {t('admin.deleteUser')}
              </button>
            </>
          )}
        </div>
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
            <p className="text-sm text-gray-600 mb-1">{t('admin.name')}</p>
            {editMode ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-gray-900">{user.name || t('admin.notSet')}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('admin.surname')}</p>
            {editMode ? (
              <input
                type="text"
                value={editData.surname}
                onChange={(e) => setEditData({...editData, surname: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-gray-900">{user.surname || t('admin.notSet')}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('admin.phoneLabel')}</p>
            {editMode ? (
              <input
                type="text"
                value={editData.phone}
                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-gray-900">{user.phone || t('admin.notSet')}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('admin.companyLabel')}</p>
            {editMode ? (
              <input
                type="text"
                value={editData.company}
                onChange={(e) => setEditData({...editData, company: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              />
            ) : (
              <p className="text-gray-900">{user.company || t('admin.notSet')}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('admin.role')}</p>
            {editMode ? (
              <select
                value={editData.role}
                onChange={(e) => setEditData({...editData, role: e.target.value})}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            ) : (
              <p className="text-gray-900">{user.role}</p>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('admin.createdAt')}</p>
            <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#4A90E2]" />
            <h3 className="text-lg font-semibold text-gray-900">{t('admin.subscription')}</h3>
          </div>
          {user.subscription ? (
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="px-3 py-1 bg-[#4A90E2] text-white text-sm rounded hover:bg-[#3A7BC8]"
            >
              {t('admin.editSubscription')}
            </button>
          ) : (
            <button
              onClick={() => setShowSubscriptionModal(true)}
              className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
            >
              {t('admin.createSubscription')}
            </button>
          )}
        </div>

        {user.subscription ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">{t('subscription.status')}</p>
              <p className="text-gray-900 capitalize">{user.subscription.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('subscription.price')}</p>
              <p className="text-gray-900">zł{user.subscription.price}/month</p>
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
        ) : (
          <p className="text-gray-600">{t('admin.noSubscription')}</p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#4A90E2]" />
            <h3 className="text-lg font-semibold text-gray-900">{t('admin.devices')}</h3>
          </div>
          <button
            onClick={() => setShowDeviceModal(true)}
            className="px-3 py-1 bg-[#4A90E2] text-white text-sm rounded hover:bg-[#3A7BC8]"
          >
            + {t('admin.addDevice')}
          </button>
        </div>

        {user.devices && user.devices.length > 0 ? (
          <div className="space-y-2">
            {user.devices.map((device: any) => (
              <div key={device.id} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                <div>
                  <span className="font-medium">{device.name}</span>
                  <span className="text-gray-600 ml-3">{device.code}</span>
                </div>
                <button
                  onClick={() => handleDeleteDevice(device.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title={t('admin.deleteDevice')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">{t('devices.noDevices')}</p>
        )}
      </div>

      {user.payments && user.payments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t('admin.paymentHistory')}
          </h3>
          <div className="overflow-x-auto">
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
                    zł{payment.amount}
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

      {showDeviceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{t('admin.addDevice')}</h2>
            <form onSubmit={handleAddDevice} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.deviceName')}
                </label>
                <input
                  type="text"
                  placeholder={t('admin.deviceName')}
                  value={deviceForm.name}
                  onChange={(e) => setDeviceForm({...deviceForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('admin.deviceCode')}
                </label>
                <input
                  type="text"
                  placeholder={t('admin.deviceCode')}
                  value={deviceForm.code}
                  onChange={(e) => setDeviceForm({...deviceForm, code: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8]"
                >
                  {t('admin.add')}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowDeviceModal(false);
                    setDeviceForm({ name: '', code: '' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {user.subscription ? t('admin.editSubscription') : t('admin.createSubscription')}
            </h2>
            <form onSubmit={handleSaveSubscription} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('subscription.status')}
                </label>
                <select
                  value={subscriptionForm.status}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="CANCELED">CANCELED</option>
                  <option value="PAST_DUE">PAST_DUE</option>
                  <option value="INCOMPLETE">INCOMPLETE</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('subscription.price')} (zł/month)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="29.99"
                  value={user.subscription ? subscriptionForm.price : calculatedPrice}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, price: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-gray-50"
                  disabled={true}
                  required
                />
                {!user.subscription && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('admin.autoCalculated')}: zł{BASE_PRICE} × {calculatedDevicesCount} {t('admin.devices').toLowerCase()}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('subscription.devicesCount')}
                </label>
                <input
                  type="number"
                  placeholder="5"
                  value={user.subscription ? subscriptionForm.devicesCount : calculatedDevicesCount}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, devicesCount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] bg-gray-50"
                  disabled={true}
                  required
                />
                {!user.subscription && (
                  <p className="text-xs text-gray-500 mt-1">
                    {t('admin.currentDevices')}: {calculatedDevicesCount}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('subscription.renewalDate')}
                </label>
                <input
                  type="date"
                  value={subscriptionForm.currentPeriodEnd}
                  onChange={(e) => setSubscriptionForm({...subscriptionForm, currentPeriodEnd: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8]"
                >
                  {t('admin.save')}
                </button>
                {user.subscription && (
                  <button 
                    type="button"
                    onClick={handleDeleteSubscription}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    {t('admin.deleteSubscription')}
                  </button>
                )}
                <button 
                  type="button" 
                  onClick={() => {
                    setShowSubscriptionModal(false);
                   
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  {t('admin.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}