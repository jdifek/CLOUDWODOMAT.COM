import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function RechargeBatch() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("batch");
  const [formData, setFormData] = useState({
    cardNumber: "",
    actualAmount: "",
    expiryDate: "",
    device: "",
    note: "",
    package: "",
  });

  const handleRecharge = () => {
    console.log("Batch recharge:", formData);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("recharge.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("regular")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "regular"
                  ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("recharge.regular")}
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "batch"
                  ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("recharge.batch")}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recharge.cardNumber")}
              </label>
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({ ...formData, cardNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t("recharge.enterCardNumber")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recharge.actualReceived")}
              </label>
              <input
                type="number"
                value={formData.actualAmount}
                onChange={(e) =>
                  setFormData({ ...formData, actualAmount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("rechargeBatch.expiryDate")}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recharge.device")}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.device}
                  onChange={(e) =>
                    setFormData({ ...formData, device: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t("recharge.selectDevice")}
                />
                <button className="px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {t("common.search")}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("recharge.note")}
              </label>
              <textarea
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder={t("recharge.enterNote")}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("rechargeBatch.packageSelection")}
              </label>
              <select
                value={formData.package}
                onChange={(e) =>
                  setFormData({ ...formData, package: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("rechargeBatch.selectPackage")}</option>
              </select>
            </div>

            <div className="bg-[#FFE6E6] border border-[#D9534F] rounded p-3 text-sm text-[#D9534F]">
              {t("rechargeBatch.noPackagesWarning")}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                onClick={handleRecharge}
                className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
              >
                {t("recharge.rechargeButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
