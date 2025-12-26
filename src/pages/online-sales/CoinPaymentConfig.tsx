import { useState } from "react";
import { Save, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CoinPaymentConfig() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    machineCoins: "10.00",
    liquidCoins: "20.00",
    randomCoins: "10.00",
  });

  const handleSubmit = () => {
    console.log("Saving coin config:", formData);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("coinPaymentConfig.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6 space-y-3">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700 space-y-2">
              <p>
                <strong>{t("coinPaymentConfig.warningTitle")}</strong>{" "}
                {t("coinPaymentConfig.warningText1")}
              </p>
              <p>
                <strong>{t("coinPaymentConfig.exampleTitle")}</strong>{" "}
                {t("coinPaymentConfig.exampleText")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("coinPaymentConfig.machineSalesCoins")}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.machineCoins}
              onChange={(e) =>
                setFormData({ ...formData, machineCoins: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("coinPaymentConfig.liquidSalesCoins")}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.liquidCoins}
              onChange={(e) =>
                setFormData({ ...formData, liquidCoins: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("coinPaymentConfig.randomMachineCoins")}
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.randomCoins}
              onChange={(e) =>
                setFormData({ ...formData, randomCoins: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
