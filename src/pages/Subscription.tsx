import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { CreditCard, Calendar, DollarSign, Package } from "lucide-react";

interface SubscriptionData {
  id: string;
  status: string;
  price: number;
  devicesCount: number;
  currentPeriodEnd: string | null;
}

interface Device {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export function Subscription() {
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [basePrice, setBasePrice] = useState<number>(1);
  const [settingsLoading, setSettingsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    fetchSubscription();
    fetchDevices();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      setBasePrice(parseFloat(response.data.BASE_PRICE) || 1);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setBasePrice(1); // Fallback
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await api.get("/user/devices");
      setDevices(response.data);
    } catch {
      console.error("Failed to fetch devices");
    }
  };

  const fetchSubscription = async () => {
    try {
      const response = await api.get("/user/me");
      setSubscription(response.data.subscription);
    } catch {
      console.error("Failed to fetch subscription");
    }
  };

  const handleCheckout = async () => {
    if (devices.length === 0) {
      alert(t("subscription.noDevicesError") || "Please add at least one device before subscribing.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/subscription/checkout", {
        devicesCount: devices.length,
      });
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      alert(t("subscription.checkoutError") || "Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = () => basePrice * devices.length;

  if (settingsLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {t("subscription.title")}
      </h1>

      {subscription && subscription.status === "ACTIVE" && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {t("subscription.currentSubscription")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Package className="w-8 h-8 text-[#4A90E2]" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("subscription.status")}
                </p>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {subscription.status.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8 text-[#5CB85C]" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("subscription.price")}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.price.toFixed(2)}zł/month
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <CreditCard className="w-8 h-8 text-[#F0AD4E]" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("subscription.devicesCount")}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.devicesCount}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Calendar className="w-8 h-8 text-[#D9534F]" />
              <div>
                <p className="text-sm text-gray-600">
                  {t("subscription.renewalDate")}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {subscription.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          {subscription?.status === "ACTIVE"
            ? t("subscription.upgradeSubscription")
            : t("subscription.startSubscription")}
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {t("subscription.basePricePerDevice")}:
              </span>
              <span className="font-semibold text-gray-900">{basePrice.toFixed(2)}zł</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">
                {t("subscription.devicesCount")}:
              </span>
              <span className="font-semibold text-gray-900">
                ×{devices.length}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                {t("subscription.totalMonthly")}:
              </span>
              <span className="text-2xl font-bold text-[#4A90E2]">
                {calculatePrice().toFixed(2)}zł
              </span>
            </div>
          </div>

          {devices.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                {t("subscription.addDevicesFirst") || "Please add at least one device before subscribing."}
              </p>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading || devices.length === 0}
            className="w-full px-6 py-3 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CreditCard className="w-5 h-5" />
            {loading
              ? t("subscription.processing")
              : t("subscription.proceedToPayment")}
          </button>
        </div>
      </div>
    </div>
  );
}