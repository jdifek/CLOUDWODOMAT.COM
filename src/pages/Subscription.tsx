import { useState, useEffect } from "react";
import { api } from "../services/api";
import { useLanguage } from "../contexts/LanguageContext";
import { CreditCard, Calendar, DollarSign, Package } from "lucide-react";
import { HappyTiService } from "../services/happyTiService";

interface SubscriptionData {
  id: string;
  status: string;
  price: number;
  devicesCount: number;
  currentPeriodEnd: string | null;
}

export function Subscription() {
  const { t } = useLanguage();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [vendingCount, setVendingCount] = useState(0);
  const [vendingLoading, setVendingLoading] = useState(true);
  const [basePrice, setBasePrice] = useState<number>(1);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'month6' | 'year'>('month');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const periodOptions = [
    { value: 'month',  label: t('subscription.period1Month'),  months: 1,  discount: 0 },
    { value: 'month6', label: t('subscription.period6Months'), months: 6,  discount: 5 },
    { value: 'year',   label: t('subscription.period12Months'), months: 12, discount: 10 },
  ] as const;
  
  const calculatePrice = () => {
    const monthly = basePrice * vendingCount;
    const opt = periodOptions.find(o => o.value === period)!;
    const total = monthly * opt.months * (1 - opt.discount / 100);
    return total;
  };
  
  const calculateMonthly = () => {
    const opt = periodOptions.find(o => o.value === period)!;
    return calculatePrice() / opt.months;
  };
  useEffect(() => {
    fetchSettings();
    fetchSubscription();
    fetchVendingDevices();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get("/settings");
      setBasePrice(parseFloat(response.data.BASE_PRICE) || 1);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
      setBasePrice(1);
    } finally {
      setSettingsLoading(false);
    }
  };

  const fetchVendingDevices = async () => {
    setVendingLoading(true);
    try {
      const types = ["shop", "shop_liquid", "shop_happyfu", "shop_water"] as const;
      const results = await Promise.all(
        types.map((type) => HappyTiService.deviceList({ type, page: 1 }))
      );
      const total = results.reduce((sum, res) => {
        if (res.data.code === 0) return sum + res.data.data.length;
        return sum;
      }, 0);
      setVendingCount(total);
    } catch (error) {
      console.error("Failed to fetch vending devices:", error);
    } finally {
      setVendingLoading(false);
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
    if (!acceptedTerms) {
      alert("Musisz zaakceptować Regulamin.");
      return;
    }
    if (vendingCount === 0) {
      alert(t('subscription.noDevicesError'));
      return;
    }
    setLoading(true);
    try {
      const response = await api.post('/subscription/checkout', {
        devicesCount: vendingCount,
        period, // передаём период
      });
      window.location.href = response.data.url;
    } catch {
      alert(t('subscription.checkoutError'));
    } finally {
      setLoading(false);
    }
  };

  if (settingsLoading || vendingLoading) {
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
                ×{vendingCount}
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

          {vendingCount === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                {t("subscription.addDevicesFirst") || "Please add at least one device before subscribing."}
              </p>
            </div>
          )}
{/* Period selector */}
<div className="grid grid-cols-3 gap-3 mb-4">
  {periodOptions.map(opt => {
    const monthly = basePrice * vendingCount;
    const total = monthly * opt.months * (1 - opt.discount / 100);
    const isSelected = period === opt.value;
    return (
      <button
        key={opt.value}
        onClick={() => setPeriod(opt.value)}
        className={`relative p-3 rounded-lg border-2 text-left transition-all ${
          isSelected
            ? 'border-[#4A90E2] bg-blue-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        {opt.discount > 0 && (
          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
            -{opt.discount}%
          </span>
        )}
        <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {(total / opt.months).toFixed(2)} zł/mo
        </p>
        <p className="text-base font-bold text-[#4A90E2] mt-1">
          {total.toFixed(2)} zł
        </p>
      </button>
    );
  })}
</div>

{/* Updated price display */}
<div className="p-4 bg-gray-50 rounded-lg mb-4">
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600">{t('subscription.basePricePerDevice')}:</span>
    <span className="font-semibold">{basePrice.toFixed(2)} zł</span>
  </div>
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600">{t('subscription.devicesCount')}:</span>
    <span className="font-semibold">×{vendingCount}</span>
  </div>
  {periodOptions.find(o => o.value === period)!.discount > 0 && (
    <div className="flex justify-between items-center mb-2 text-green-600">
      <span>{t('subscription.discount')}:</span>
      <span className="font-semibold">-{periodOptions.find(o => o.value === period)!.discount}%</span>
    </div>
  )}
  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between items-center">
    <span className="text-lg font-semibold text-gray-900">{t('subscription.totalMonthly')}:</span>
    <div className="text-right">
      <div className="text-2xl font-bold text-[#4A90E2]">
        {calculatePrice().toFixed(2)} zł
      </div>
      {period !== 'month' && (
        <div className="text-xs text-gray-500">
          {calculateMonthly().toFixed(2)} zł/mo
        </div>
      )}
    </div>
  </div>
</div>
<div className="flex items-start gap-3 mb-4">
  <input
    id="terms"
    type="checkbox"
    checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    className="mt-1 h-4 w-4"
  />

  <label htmlFor="terms" className="text-sm text-gray-600">
    Oświadczam, że zapoznałem się z
    {" "}
    <a
      href="/doc.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      Regulaminem świadczenia usług
    </a>
    {" "}
    i akceptuję jego warunki.
  </label>
</div>
          <button
            onClick={handleCheckout}
            disabled={
              loading ||
              vendingCount === 0 ||
              !acceptedTerms
            }            className="w-full px-6 py-3 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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