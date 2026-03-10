/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, LogOut, Home, Settings, Users, CreditCard, AlertCircle } from "lucide-react";
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
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      localStorage.setItem('token', adminToken);
      localStorage.removeItem('adminToken');
    }
    localStorage.removeItem('impersonating');
    window.location.href = '/admin/users';
  };

  const supportMessages: Record<string, { text: string; hours: string }> = {
    en: {
      text: "To contact our technical support chat, please click the button below 💬👇",
      hours: "Working hours: 09:00 – 18:00 Warsaw time",
    },
    ru: {
      text: "Чтобы связаться с чатом технической поддержки, воспользуйтесь кнопкой ниже 💬👇",
      hours: "Часы работы: 9:00 – 18:00 Варшава",
    },
    pl: {
      text: "Aby skontaktować się z czatem wsparcia technicznego, skorzystaj z przycisku poniżej 💬👇",
      hours: "Godziny pracy: 9:00 – 18:00 Warszawa",
    },
  };

  const support = supportMessages[language] ?? supportMessages.en;

  const crmMenuItems = [
    { label: t("nav.dashboard"), path: "/", icon: Home },
    {
      label: t("nav.equipment"),
      children: [
        { label: t("nav.waterVending"), path: "/equipment/water-vending" },
      ],
    },
  ];

  const subscriptionMenuItems = [
    { label: t('profile.title'), path: '/profile', icon: Settings },
    { label: t('password.title'), path: '/change-password', icon: Settings },
    { label: t('subscription.title'), path: '/subscription', icon: CreditCard },
  ];

  const adminMenuItems = [
    { label: t('admin.usersManagement'), path: '/admin/users', icon: Users },
    { label: t('admin.systemSettings'), path: '/admin/settings', icon: Settings },
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-[#4A90E2]">
            {t("nav.menu")}
          </h2>
          <button onClick={onClose} className="lg:hidden">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Impersonate banner */}
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

        {/* No subscription warning */}
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

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4">
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

          <div className="mb-4">
            <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase bg-blue-50 rounded">
              {t('subscription.title')}
            </div>
            <ul className="mt-2 space-y-1">
              {subscriptionMenuItems.map((item, index) => renderMenuItem(item, index))}
            </ul>
          </div>

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

        {/* Bottom section */}
        <div className="p-4 border-t space-y-3">

          {/* Language selector — compact pill row (replaces dropdown) */}
          <div className="flex items-center justify-center gap-1 bg-gray-100 rounded-lg p-1">
            {(["en", "ru", "pl"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all duration-150 ${
                  language === lang
                    ? "bg-white text-[#4A90E2] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {lang === "en" ? "EN" : lang === "ru" ? "RU" : "PL"}
              </button>
            ))}
          </div>

          {/* Telegram Support Card */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
            <div className="px-3 py-3 text-center">
              <p className="text-xs font-bold text-gray-700 mb-0.5">
                {language === "ru" ? "Техническая поддержка" : language === "pl" ? "Wsparcie techniczne" : "Technical Support"}
              </p>
              <p className="text-[11px] text-gray-500">
                {support.hours}
              </p>
            </div>
            <div className="px-3 pb-3">
              <a
                href="https://t.me/ZdrowaWodaSupportPLBot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#229ED9] hover:bg-[#1a8bbf] active:bg-[#157a9f] transition-colors text-white text-sm font-semibold shadow-sm"
              >
                {/* Telegram plane icon (SVG) */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            {t('auth.logout')}
          </button>
        </div>
      </aside>
    </>
  );
}