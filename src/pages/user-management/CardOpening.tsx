import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

export default function CardOpening() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("opening");
  const [formData, setFormData] = useState({
    startCard: "",
    endCard: "",
    deviceId: "",
    merchantNumber: "",
  });

  const handleOpenCards = () => {
    console.log("Opening cards:", formData);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("cardOpening.title")}
      </h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("opening")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "opening"
                  ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("cardOpening.cardOpeningTab")}
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "records"
                  ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("cardOpening.openingRecords")}
            </button>
            <button
              onClick={() => setActiveTab("log")}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === "log"
                  ? "text-[#4A90E2] border-b-2 border-[#4A90E2]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t("cardOpening.log")}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "opening" && (
            <>
              <div className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("cardOpening.startCard")}
                  </label>
                  <input
                    type="text"
                    value={formData.startCard}
                    onChange={(e) =>
                      setFormData({ ...formData, startCard: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("cardOpening.enterStartCard")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("cardOpening.endCard")}
                  </label>
                  <input
                    type="text"
                    value={formData.endCard}
                    onChange={(e) =>
                      setFormData({ ...formData, endCard: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("cardOpening.enterEndCard")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("cardOpening.deviceId")}
                  </label>
                  <input
                    type="text"
                    value={formData.deviceId}
                    onChange={(e) =>
                      setFormData({ ...formData, deviceId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("cardOpening.enterDeviceId")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("cardOpening.merchantNumber")}
                  </label>
                  <input
                    type="text"
                    value={formData.merchantNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        merchantNumber: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={t("cardOpening.enterMerchantNumber")}
                  />
                </div>

                <div className="bg-[#FFF9E6] border border-[#FFD700] rounded p-3 text-sm text-gray-700">
                  {t("cardOpening.newVersionAvailable")}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleOpenCards}
                    className="px-6 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
                  >
                    {t("cardOpening.openCards")}
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {t("cardOpening.validRanges")}
                </h3>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            №
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {t("cardOpening.merchant")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {t("cardOpening.start")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {t("cardOpening.end")}
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            {t("cardOpening.name")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            {t("common.noData")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "records" && (
            <div className="text-center text-gray-500 py-12">
              {t("cardOpening.openingRecordsContent")}
            </div>
          )}

          {activeTab === "log" && (
            <div className="text-center text-gray-500 py-12">
              {t("cardOpening.logContent")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
