import { useState } from "react";
import { Save } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function ThreeLevelConfig() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    accountName: "",
    hotline: "",
    firstLevelPercent: "0.00",
    firstLevelLimit: "unlimited",
    firstLevelAmount: "0",
    secondLevelPercent: "0.00",
    secondLevelLimit: "unlimited",
    secondLevelAmount: "0",
    marketingText: "",
    promoText: "",
  });

  const handleSubmit = () => {
    console.log("Saving config:", formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("threeLevelConfig.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {t("threeLevelConfig.relationshipDiagram")}
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 flex items-center justify-center">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-pink-400 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                  A
                </div>
                <div className="text-sm text-gray-600">
                  {t("threeLevelConfig.userA")}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-[#F0AD4E] text-3xl">→</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                  B
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  {t("threeLevelConfig.firstLevelOfA")}
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-[#F0AD4E] text-3xl">→</div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                  C
                </div>
                <div className="text-sm text-gray-600 font-semibold">
                  {t("threeLevelConfig.secondLevelOfA")}
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-gray-500">
            {t("threeLevelConfig.partner")}
          </div>
        </div>

        <div className="space-y-4 max-w-3xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("threeLevelConfig.officialAccountName")}
            </label>
            <input
              type="text"
              value={formData.accountName}
              onChange={(e) =>
                setFormData({ ...formData, accountName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("threeLevelConfig.enterAccountName")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("threeLevelConfig.activityHotline")}
            </label>
            <input
              type="text"
              value={formData.hotline}
              onChange={(e) =>
                setFormData({ ...formData, hotline: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t("threeLevelConfig.foreignNumberNote")}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("threeLevelConfig.firstLevelReturnPercent")}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.firstLevelPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    firstLevelPercent: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("threeLevelConfig.limitFirstLevelReturns")}
              </label>
              <select
                value={formData.firstLevelLimit}
                onChange={(e) =>
                  setFormData({ ...formData, firstLevelLimit: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unlimited">
                  {t("threeLevelConfig.noLimit")}
                </option>
                <option value="limited">{t("threeLevelConfig.limit")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("threeLevelConfig.firstLevelReturnLimit")}
              </label>
              <input
                type="number"
                value={formData.firstLevelAmount}
                onChange={(e) =>
                  setFormData({ ...formData, firstLevelAmount: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("threeLevelConfig.secondLevelReturnPercent")}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.secondLevelPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secondLevelPercent: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("threeLevelConfig.limitSecondLevelReturns")}
              </label>
              <select
                value={formData.secondLevelLimit}
                onChange={(e) =>
                  setFormData({ ...formData, secondLevelLimit: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="unlimited">
                  {t("threeLevelConfig.noLimit")}
                </option>
                <option value="limited">{t("threeLevelConfig.limit")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("threeLevelConfig.secondLevelReturnLimit")}
              </label>
              <input
                type="number"
                value={formData.secondLevelAmount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    secondLevelAmount: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("threeLevelConfig.marketingText")}
            </label>
            <textarea
              value={formData.marketingText}
              onChange={(e) =>
                setFormData({ ...formData, marketingText: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={t("threeLevelConfig.enterMarketingText")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("threeLevelConfig.promoText")}
            </label>
            <textarea
              value={formData.promoText}
              onChange={(e) =>
                setFormData({ ...formData, promoText: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder={t("threeLevelConfig.enterPromoText")}
            />
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
