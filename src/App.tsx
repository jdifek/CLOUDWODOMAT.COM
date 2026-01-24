import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { WaterVendingMachines } from "./pages/equipment/WaterVendingMachines";
import { LiquidVendingMachines } from "./pages/equipment/LiquidVendingMachines";
import { PaymentDevices } from "./pages/equipment/PaymentDevices";
import { WaterControlDevices } from "./pages/equipment/WaterControlDevices";
import { EquipmentModels } from "./pages/home/EquipmentModels";
import { EquipmentList } from "./pages/home/EquipmentList";
import { PackageSettings } from "./pages/home/PackageSettings";
import { PackageZones } from "./pages/home/PackageZones";
import { CloudDevices } from "./pages/CloudDevices";
import { IndustrialEquipment } from "./pages/IndustrialEquipment";
import { FilterTypes } from "./pages/filters/FilterTypes";
import { AllFilters } from "./pages/filters/AllFilters";
import { SimCardList } from "./pages/sim/SimCardList";
import { SimCardOrders } from "./pages/sim/SimCardOrders";
import MemberCardsList from "./pages/user-management/MemberCardsList";
import CardTransfer from "./pages/user-management/CardTransfer";
import RechargeRegular from "./pages/user-management/RechargeRegular";
import RechargeBatch from "./pages/user-management/RechargeBatch";
import BulkRecharge from "./pages/user-management/BulkRecharge";
import RechargeImportRegular from "./pages/user-management/RechargeImportRegular";
import CardOpening from "./pages/user-management/CardOpening";
import ConsumptionLog from "./pages/data-center/ConsumptionLog";
import RechargeLog from "./pages/data-center/RechargeLog";
import OperationsLog from "./pages/data-center/OperationsLog";
import DownloadCenter from "./pages/data-center/DownloadCenter";
import ThreeLevelConfig from "./pages/online-sales/ThreeLevelConfig";
import GiftConfig from "./pages/online-sales/GiftConfig";
import CoinPaymentConfig from "./pages/online-sales/CoinPaymentConfig";
import PackageManagement from "./pages/online-sales/PackageManagement";
import SalesPackageZones from "./pages/user-management/SalesPackageZones";
import RechargePackages from "./pages/user-management/RechargePackages";
import RechargeZones from "./pages/user-management/RechargeZones";
import QRProducts from "./pages/user-management/QRProducts";
import QRGroups from "./pages/user-management/QRGroups";
import PromoActivities from "./pages/user-management/PromoActivities";
import CouponsConfig from "./pages/user-management/CouponsConfig";
import EmployeeList from "./pages/employee-management/EmployeeList";
import AuthorizationDetails from "./pages/employee-management/AuthorizationDetails";
import PerformanceRecords from "./pages/employee-management/PerformanceRecords";
import RoleConfig from "./pages/employee-management/RoleConfig";
import { Profile } from "./pages/Profile";
import { ChangePassword } from "./pages/ChangePassword";
import { Devices } from "./pages/Devices";
import { Login } from "./pages/Login";
import { Subscription } from "./pages/Subscription";
import { UsersList } from "./pages/admin/UsersList";
import { UserDetails } from "./pages/admin/UserDetails";
import { AdminSettings } from "./pages/AdminSettings";

function ProtectedRoute({ 
  children, 
  adminOnly = false,
  requiresSubscription = false 
}: { 
  children: React.ReactNode; 
  adminOnly?: boolean;
  requiresSubscription?: boolean;
}) {
  const { user, loading, isAdmin, hasActiveSubscription } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  
  // Админы имеют доступ ко всему
  if (!isAdmin && requiresSubscription && !hasActiveSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A90E2]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  return <>{children}</>;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected Routes - Available without subscription */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ChangePassword />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Devices />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Subscription />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Admin Routes - Always accessible for admins */}
            <Route path="/admin/settings" element={
  <ProtectedRoute adminOnly>
      <Layout>

    <AdminSettings />
      </Layout>
  </ProtectedRoute>
} />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <UsersList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute adminOnly>
                  <Layout>
                    <UserDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* CRM Routes - Require active subscription (except for admins) */}
            <Route
              path="/"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/water-vending"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <WaterVendingMachines />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/liquid-vending"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <LiquidVendingMachines />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/payment"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <PaymentDevices />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/equipment/water-control"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <WaterControlDevices />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/models"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <EquipmentModels />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/list"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <EquipmentList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/packages"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <PackageSettings />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/zones"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <PackageZones />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cloud"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <CloudDevices />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/industrial"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <IndustrialEquipment />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/filters/types"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <FilterTypes />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/filters/all"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <AllFilters />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sim/list"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <SimCardList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sim/orders"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <SimCardOrders />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/member-cards"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <MemberCardsList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/card-transfer"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <CardTransfer />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/recharge-regular"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RechargeRegular />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/recharge-batch"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RechargeBatch />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/bulk-recharge"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <BulkRecharge />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/recharge-import-regular"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RechargeImportRegular />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management/card-opening"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <CardOpening />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-center/consumption-log"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <ConsumptionLog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-center/recharge-log"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RechargeLog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-center/operations-log"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <OperationsLog />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/data-center/download-center"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <DownloadCenter />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/three-level-config"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <ThreeLevelConfig />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/gift-config"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <GiftConfig />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/coin-payment-config"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <CoinPaymentConfig />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/package-management"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <PackageManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/package-zones"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <SalesPackageZones />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/recharge-packages"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RechargePackages />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/qr-products"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <QRProducts />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/recharge-zones"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RechargeZones />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/qr-groups"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <QRGroups />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/coupons"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <CouponsConfig />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/online-sales/promo-activities"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <PromoActivities />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-management/employee-list"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <EmployeeList />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-management/authorization-details"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <AuthorizationDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-management/performance-records"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <PerformanceRecords />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee-management/role-config"
              element={
                <ProtectedRoute requiresSubscription>
                  <Layout>
                    <RoleConfig />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;