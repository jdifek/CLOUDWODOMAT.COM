/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';
import { User, Save, AlertCircle, CheckCircle } from 'lucide-react';

export function Profile() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    company: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/user/me', formData);
      setMessage({ type: 'success', text: t('profile.updateSuccess') });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.error || t('profile.updateFailed') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-[#4A90E2] rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.email}</h2>
            <p className="text-sm text-gray-600">
              {t('profile.role')}: <span className="font-medium">{user?.role}</span>
            </p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-4 p-3 rounded-md flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.firstName')}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="John"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('profile.lastName')}
              </label>
              <input
                type="text"
                value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.phone')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="+1234567890"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('profile.company')}
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              placeholder="Your Company"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? t('profile.saving') : t('profile.saveChanges')}
          </button>
        </form>
      </div>
    </div>
  );
}