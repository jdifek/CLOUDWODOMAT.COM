import { useState } from "react";
import { Save } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function GiftConfig() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    bindingGift: "",
    bindingPackage: "",
    eCardGift: "0",
    eCardPackage: "",
  });

  const handleSubmit = () => {
    console.log("Saving gift config:", formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("giftConfig.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("giftConfig.bindingGift")}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.bindingGift}
              onChange={(e) =>
                setFormData({ ...formData, bindingGift: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("giftConfig.bindingPackage")}
            </label>
            <select
              value={formData.bindingPackage}
              onChange={(e) =>
                setFormData({ ...formData, bindingPackage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("giftConfig.selectPackage")}</option>
              <option value="basic">{t("userManagement.basic")}</option>
              <option value="standard">{t("userManagement.standard")}</option>
              <option value="premium">{t("userManagement.premium")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("giftConfig.eCardGift")}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.eCardGift}
              onChange={(e) =>
                setFormData({ ...formData, eCardGift: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("giftConfig.eCardPackage")}
            </label>
            <select
              value={formData.eCardPackage}
              onChange={(e) =>
                setFormData({ ...formData, eCardPackage: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t("giftConfig.selectPackage")}</option>
              <option value="basic">{t("userManagement.basic")}</option>
              <option value="standard">{t("userManagement.standard")}</option>
              <option value="premium">{t("userManagement.premium")}</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#5CB85C] text-white rounded hover:bg-[#4CA64C] transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {t("threeLevelConfig.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
