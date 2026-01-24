/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, LogOut, Home, Settings, Package, Users, CreditCard, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { language, setLanguage, t } = useLanguage();
  const { logout, isAdmin, hasActiveSubscription } = useAuth();
  const navigate = useNavigate();
  const isImpersonating = localStorage.getItem('impersonating') === 'true';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleStopImpersonating = () => {
    // Восстанавливаем токен админа
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      localStorage.setItem('token', adminToken);
      localStorage.removeItem('adminToken');
    }
    localStorage.removeItem('impersonating');
    
    // Перезагружаем страницу для обновления контекста
    window.location.href = '/admin/users';
  };

  // Основное меню CRM
  const crmMenuItems = [
    { label: t("nav.dashboard"), path: "/", icon: Home },
    {
      label: t("nav.equipment"),
      children: [
        { label: t("nav.waterVending"), path: "/equipment/water-vending" },
        { label: t("nav.liquidVending"), path: "/equipment/liquid-vending" },
        { label: t("nav.paymentDevices"), path: "/equipment/payment" },
        { label: t("nav.waterControl"), path: "/equipment/water-control" },
      ],
    },
    {
      label: t("nav.home"),
      children: [
        { label: t("nav.equipmentModels"), path: "/home/models" },
        { label: t("nav.equipmentList"), path: "/home/list" },
        { label: t("nav.packageSettings"), path: "/home/packages" },
        { label: t("nav.packageZones"), path: "/home/zones" },
      ],
    },
    { label: t("nav.cloudDevices"), path: "/cloud" },
    { label: t("nav.industrialEquipment"), path: "/industrial" },
    {
      label: t("nav.filters"),
      children: [
        { label: t("nav.filterTypes"), path: "/filters/types" },
        { label: t("nav.allFilters"), path: "/filters/all" },
      ],
    },
    {
      label: t("nav.simCards"),
      children: [
        { label: t("nav.simCardList"), path: "/sim/list" },
        { label: t("nav.simCardOrders"), path: "/sim/orders" },
      ],
    },
    {
      label: t("nav.userManagement"),
      children: [
        { label: t("nav.memberCards"), path: "/user-management/member-cards" },
        { label: t("nav.cardTransfer"), path: "/user-management/card-transfer" },
        { label: t("nav.rechargeRegular"), path: "/user-management/recharge-regular" },
        { label: t("nav.rechargeBatch"), path: "/user-management/recharge-batch" },
        { label: t("nav.bulkRecharge"), path: "/user-management/bulk-recharge" },
        { label: t("nav.rechargeImport"), path: "/user-management/recharge-import-regular" },
        { label: t("nav.cardOpening"), path: "/user-management/card-opening" },
      ],
    },
    {
      label: t("nav.dataCenter"),
      children: [
        { label: t("nav.consumptionLog"), path: "/data-center/consumption-log" },
        { label: t("nav.rechargeLog"), path: "/data-center/recharge-log" },
        { label: t("nav.operationsLog"), path: "/data-center/operations-log" },
        { label: t("nav.downloadCenter"), path: "/data-center/download-center" },
      ],
    },
    {
      label: t("nav.onlineSales"),
      children: [
        { label: t("nav.threeLevelConfig"), path: "/online-sales/three-level-config" },
        { label: t("nav.giftConfig"), path: "/online-sales/gift-config" },
        { label: t("nav.coinPaymentConfig"), path: "/online-sales/coin-payment-config" },
        { label: t("nav.packageManagement"), path: "/online-sales/package-management" },
        { label: t("nav.packageZones"), path: "/online-sales/package-zones" },
        { label: t("nav.rechargePackages"), path: "/online-sales/recharge-packages" },
        { label: t("nav.qrProducts"), path: "/online-sales/qr-products" },
        { label: t("nav.rechargeZones"), path: "/online-sales/recharge-zones" },
        { label: t("nav.qrGroups"), path: "/online-sales/qr-groups" },
        { label: t("nav.coupons"), path: "/online-sales/coupons" },
        { label: t("nav.promoActivities"), path: "/online-sales/promo-activities" },
      ],
    },
    {
      label: t("nav.employeeManagement"),
      children: [
        { label: t("nav.employeeList"), path: "/employee-management/employee-list" },
        { label: t("nav.authorizationDetails"), path: "/employee-management/authorization-details" },
        { label: t("nav.performanceRecords"), path: "/employee-management/performance-records" },
        { label: t("nav.roleConfig"), path: "/employee-management/role-config" },
      ],
    },
  ];

  // Меню подписки
  const subscriptionMenuItems = [
    { label: t('profile.title'), path: '/profile', icon: Settings },
    { label: t('password.title'), path: '/change-password', icon: Settings },
    { label: t('devices.title'), path: '/devices', icon: Package },
    { label: t('subscription.title'), path: '/subscription', icon: CreditCard },
  ];

  // Админское меню
  const adminMenuItems = [
    { label: t('admin.usersManagement'), path: '/admin/users', icon: Users },
  ];

  const renderMenuItem = (item: any, index: number) => {
    if (item.children) {
      return (
        <li key={index}>
          <div className="px-4 py-2 text-sm font-semibold text-gray-500 uppercase">
            {item.label}
          </div>
          <ul className="ml-2 space-y-1">
            {item.children.map((child: any, childIndex: number) => (
              <li key={childIndex}>
                <NavLink
                  to={child.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded transition-colors text-sm ${
                      isActive
                        ? "bg-[#4A90E2] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {child.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
      );
    }

    const Icon = item.icon;
    return (
      <li key={index}>
        <NavLink
          to={item.path}
          onClick={onClose}
          className={({ isActive }) =>
            `block px-4 py-2 rounded transition-colors flex items-center gap-2 ${
              isActive
                ? "bg-[#4A90E2] text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          {Icon && <Icon className="w-4 h-4" />}
          {item.label}
        </NavLink>
      </li>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[#4A90E2]">
            {t("nav.menu")}
          </h2>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Индикатор impersonate */}
        {isImpersonating && (
          <div className="p-4 bg-yellow-50 border-b border-yellow-200">
            <p className="text-sm text-yellow-800 mb-2 font-medium">
              {t('admin.impersonatingMode') || 'Impersonating User'}
            </p>
            <button
              onClick={handleStopImpersonating}
              className="w-full px-3 py-2 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors font-medium"
            >
              {t('admin.stopImpersonating') || 'Back to Admin'}
            </button>
          </div>
        )}

        {/* Предупреждение об отсутствии подписки */}
        {!isAdmin && !hasActiveSubscription && (
          <div className="p-4 bg-orange-50 border-b border-orange-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-800 font-medium mb-2">
                  {t('subscription.noActiveSubscription') || 'No Active Subscription'}
                </p>
                <p className="text-xs text-orange-700 mb-3">
                  {t('subscription.subscriptionRequired') || 'Subscribe to access CRM features'}
                </p>
                <NavLink
                  to="/subscription"
                  onClick={onClose}
                  className="block w-full px-3 py-2 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition-colors font-medium text-center"
                >
                  {t('subscription.subscribe') || 'Subscribe Now'}
                </NavLink>
              </div>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-4">
          {/* Админские страницы (только для админа) */}
          {isAdmin && (
            <>
              <div className="mb-4">
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-red-50 rounded">
                  Admin Panel
                </div>
                <ul className="mt-2 space-y-1">
                  {adminMenuItems.map((item, index) => renderMenuItem(item, index))}
                </ul>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
            </>
          )}

          {/* Страницы подписки - всегда доступны */}
          <div className="mb-4">
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-blue-50 rounded">
              {t('subscription.title')}
            </div>
            <ul className="mt-2 space-y-1">
              {subscriptionMenuItems.map((item, index) => renderMenuItem(item, index))}
            </ul>
          </div>

          {/* CRM меню - доступно только с подпиской или для админов */}
          {(isAdmin || hasActiveSubscription) && (
            <>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="mb-4">
                <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-green-50 rounded">
                  CRM System
                </div>
                <ul className="mt-2 space-y-1">
                  {crmMenuItems.map((item, index) => renderMenuItem(item, index))}
                </ul>
              </div>
            </>
          )}
        </nav>

        <div className="p-4 border-t">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("nav.language")}
            </label>
            <select
              value={language}
              onChange={(e) =>
                setLanguage(e.target.value as "en" | "ru" | "pl")
              }
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded hover:border-[#4A90E2] transition-colors cursor-pointer"
            >
              <option value="en">English</option>
              <option value="ru">Русский</option>
              <option value="pl">Polski</option>
            </select>
          </div>

          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            {t('auth.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}