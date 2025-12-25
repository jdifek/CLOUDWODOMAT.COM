/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Home,
  Settings,
  Building2,
  Cloud,
  Factory,
  Filter,
  Smartphone as Sim,
  Users,
  Database,
  ShoppingCart,
  UserCog,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  key: string;
  icon: any;
  path?: string;
  children?: { key: string; path: string }[];
}

const menuItems: MenuItem[] = [
  { key: "dashboard", icon: Home, path: "/" },
  {
    key: "equipmentManagement",
    icon: Settings,
    children: [
      { key: "waterVendingMachines", path: "/equipment/water-vending" },
      { key: "liquidVendingMachines", path: "/equipment/liquid-vending" },
      { key: "paymentDevices", path: "/equipment/payment" },
      { key: "waterControlDevices", path: "/equipment/water-control" },
    ],
  },
  {
    key: "homeEquipment",
    icon: Building2,
    children: [
      { key: "equipmentModels", path: "/home/models" },
      { key: "equipmentList", path: "/home/list" },
      { key: "packageSettings", path: "/home/packages" },
      { key: "packageZones", path: "/home/zones" },
    ],
  },
  { key: "cloudDevices", icon: Cloud, path: "/cloud" },
  { key: "industrialEquipment", icon: Factory, path: "/industrial" },
  {
    key: "filterManagement",
    icon: Filter,
    children: [
      { key: "filterTypes", path: "/filters/types" },
      { key: "allFilters", path: "/filters/all" },
    ],
  },
  {
    key: "simCardManagement",
    icon: Sim,
    children: [
      { key: "simCardList", path: "/sim/list" },
      { key: "simCardOrders", path: "/sim/orders" },
    ],
  },
  {
    key: "userManagement",
    icon: Users,
    children: [
      { key: "memberCardsList", path: "/user-management/member-cards" },
      { key: "cardTransfer", path: "/user-management/card-transfer" },
      { key: "rechargeRegular", path: "/user-management/recharge-regular" },
      { key: "rechargeBatch", path: "/user-management/recharge-batch" },
      { key: "bulkRecharge", path: "/user-management/bulk-recharge" },
      {
        key: "rechargeImport",
        path: "/user-management/recharge-import-regular",
      },
      { key: "cardOpening", path: "/user-management/card-opening" },
    ],
  },
  {
    key: "dataCenter",
    icon: Database,
    children: [
      { key: "consumptionLog", path: "/data-center/consumption-log" },
      { key: "rechargeLog", path: "/data-center/recharge-log" },
      { key: "operationsLog", path: "/data-center/operations-log" },
      { key: "downloadCenter", path: "/data-center/download-center" },
    ],
  },
  {
    key: "onlineSales",
    icon: ShoppingCart,
    children: [
      { key: "threeLevelConfig", path: "/online-sales/three-level-config" },
      { key: "giftConfig", path: "/online-sales/gift-config" },
      { key: "coinPaymentConfig", path: "/online-sales/coin-payment-config" },
      { key: "packageManagement", path: "/online-sales/package-management" },
      { key: "packageZones", path: "/online-sales/package-zones" },
      { key: "rechargePackages", path: "/online-sales/recharge-packages" },
      { key: "rechargeZones", path: "/online-sales/recharge-zones" },
      { key: "qrProducts", path: "/online-sales/qr-products" },
      { key: "qrGroups", path: "/online-sales/qr-groups" },
      { key: "promoActivities", path: "/online-sales/promo-activities" },
      { key: "coupons", path: "/online-sales/coupons" },
    ],
  },
  {
    key: "employeeManagement",
    icon: UserCog,
    children: [
      { key: "employeeList", path: "/employee-management/employee-list" },
      {
        key: "authorizationDetails",
        path: "/employee-management/authorization-details",
      },
      {
        key: "performanceRecords",
        path: "/employee-management/performance-records",
      },
      { key: "roleConfig", path: "/employee-management/role-config" },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const { t } = useLanguage();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["equipmentManagement"]);

  const toggleMenu = (key: string) => {
    setOpenMenus((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const isActive = (path?: string) => path && location.pathname === path;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
        w-72 bg-[#008dd4] text-white h-screen overflow-y-auto custom-scrollbar flex flex-col
        transition-transform duration-300 ease-in-out
      `}
      >
        <div className=" border-b border-gray-700">
          <img src="/image.png" alt="image.png" />
        </div>

        <nav className="flex-1 p-2">
          {menuItems.map((item) => (
            <div key={item.key}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.key)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#0077b3] rounded transition-colors"
                  >
                    <div className="flex items-center">
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="text-sm">{t(`nav.${item.key}`)}</span>
                    </div>
                    {openMenus.includes(item.key) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {openMenus.includes(item.key) && (
                    <div className="ml-8 mt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.key}
                          to={child.path}
                          className={`block px-4 py-2 text-sm hover:bg-[#0077b3] rounded transition-colors ${
                            isActive(child.path) ? "bg-[#0077b3]" : ""
                          }`}
                        >
                          {t(`nav.${child.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path || "#"}
                  className={`flex items-center px-4 py-3 hover:bg-[#0077b3] rounded transition-colors ${
                    isActive(item.path) ? "bg-[#4A90E2]" : ""
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="text-sm">{t(`nav.${item.key}`)}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 text-center text-xs text-gray-400">
          <p>© Happy-ti 2025</p>
          <p>powered by Happy-ti</p>
        </div>
      </div>
    </>
  );
}
