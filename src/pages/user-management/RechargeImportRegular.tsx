/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Search, Upload, Download } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function RechargeImportRegular() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('regular');
  const [formData, setFormData] = useState({
    file: null,
    device: ''
  });

  const handleFileChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = () => {
    console.log('Importing recharge:', formData);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{t('rechargeImport.title')}</h1>

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
          <div className="space-y-4 max-w-2xl">
            <div className="bg-[#FFF9E6] border border-[#FFD700] rounded p-3 text-sm text-gray-700">
              {t('rechargeImport.maxRecordsWarning')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('rechargeImport.downloadExample')}
              </label>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-[#4A90E2] hover:underline"
              >
                <Download className="w-4 h-4" />
                {t('rechargeImport.downloadExcelTemplate')}
              </a>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('rechargeImport.uploadExcelFile')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={formData.file ? formData.file : ''}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  placeholder={t('rechargeImport.noFileSelected')}
                />
                <label className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  {t('rechargeImport.browse')}
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
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

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
              >
                {t('rechargeImport.submit')}
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