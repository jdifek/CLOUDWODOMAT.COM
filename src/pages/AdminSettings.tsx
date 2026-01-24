import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { api } from '../services/api';

export function AdminSettings() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    BASE_PRICE: '1'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings({
        BASE_PRICE: response.data.BASE_PRICE || '1'
      });
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post('/settings/bulk', { settings });
      alert(t('admin.settingsSaved') || 'Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(t('admin.settingsSaveFailed') || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SettingsIcon className="w-8 h-8 text-[#4A90E2]" />
          <h1 className="text-2xl font-bold text-gray-900">
            {t('admin.systemSettings') || 'System Settings'}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? (t('admin.saving') || 'Saving...') : (t('admin.saveSettings') || 'Save Settings')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          {t('admin.pricingSettings') || 'Pricing Settings'}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
             (PLN/month)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={settings.BASE_PRICE}
              onChange={(e) => setSettings({ ...settings, BASE_PRICE: e.target.value })}
              className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            />
            <p className="text-sm text-gray-500 mt-2">
              {t('admin.basePriceDescription') || 'This price will be multiplied by the number of devices for each subscription.'}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              {t('admin.exampleCalculation') || 'Example Calculation'}
            </h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• 1 {t('admin.device') || 'device'}: {settings.BASE_PRICE} PLN/month</p>
              <p>• 5 {t('admin.devices') || 'devices'}: {(parseFloat(settings.BASE_PRICE) * 5).toFixed(2)} PLN/month</p>
              <p>• 10 {t('admin.devices') || 'devices'}: {(parseFloat(settings.BASE_PRICE) * 10).toFixed(2)} PLN/month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>{t('admin.warning') || 'Warning'}:</strong> {t('admin.priceChangeWarning') || 'Changing the base price will affect all new subscriptions. Existing subscriptions will keep their current price.'}
        </p>
      </div>
    </div>
  );
}