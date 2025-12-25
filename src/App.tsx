import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WaterVendingMachines } from './pages/equipment/WaterVendingMachines';
import { LiquidVendingMachines } from './pages/equipment/LiquidVendingMachines';
import { PaymentDevices } from './pages/equipment/PaymentDevices';
import { WaterControlDevices } from './pages/equipment/WaterControlDevices';
import { EquipmentModels } from './pages/home/EquipmentModels';
import { EquipmentList } from './pages/home/EquipmentList';
import { PackageSettings } from './pages/home/PackageSettings';
import { PackageZones } from './pages/home/PackageZones';
import { CloudDevices } from './pages/CloudDevices';
import { IndustrialEquipment } from './pages/IndustrialEquipment';
import { FilterTypes } from './pages/filters/FilterTypes';
import { AllFilters } from './pages/filters/AllFilters';
import { SimCardList } from './pages/sim/SimCardList';
import { SimCardOrders } from './pages/sim/SimCardOrders';
import MemberCardsList from './pages/user-management/MemberCardsList';
import CardTransfer from './pages/user-management/CardTransfer';
import RechargeRegular from './pages/user-management/RechargeRegular';
import RechargeBatch from './pages/user-management/RechargeBatch';
import BulkRecharge from './pages/user-management/BulkRecharge';
import RechargeImportRegular from './pages/user-management/RechargeImportRegular';
import CardOpening from './pages/user-management/CardOpening';
import ConsumptionLog from './pages/data-center/ConsumptionLog';
import RechargeLog from './pages/data-center/RechargeLog';
import OperationsLog from './pages/data-center/OperationsLog';
import DownloadCenter from './pages/data-center/DownloadCenter';
import ThreeLevelConfig from './pages/online-sales/ThreeLevelConfig';
import GiftConfig from './pages/online-sales/GiftConfig';
import CoinPaymentConfig from './pages/online-sales/CoinPaymentConfig';
import PackageManagement from './pages/online-sales/PackageManagement';
import SalesPackageZones from './pages/user-management/SalesPackageZones';
import RechargePackages from './pages/user-management/RechargePackages';
import RechargeZones from './pages/user-management/RechargeZones';
import QRProducts from './pages/user-management/QRProducts';
import QRGroups from './pages/user-management/QRGroups';
import PromoActivities from './pages/user-management/PromoActivities';
import CouponsConfig from './pages/user-management/CouponsConfig';
import EmployeeList from './pages/employee-management/EmployeeList';
import AuthorizationDetails from './pages/employee-management/AuthorizationDetails';
import PerformanceRecords from './pages/employee-management/PerformanceRecords';
import RoleConfig from './pages/employee-management/RoleConfig';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/equipment/water-vending" element={<WaterVendingMachines />} />
            <Route path="/equipment/liquid-vending" element={<LiquidVendingMachines />} />
            <Route path="/equipment/payment" element={<PaymentDevices />} />
            <Route path="/equipment/water-control" element={<WaterControlDevices />} />
            <Route path="/home/models" element={<EquipmentModels />} />
            <Route path="/home/list" element={<EquipmentList />} />
            <Route path="/home/packages" element={<PackageSettings />} />
            <Route path="/home/zones" element={<PackageZones />} />
            <Route path="/cloud" element={<CloudDevices />} />
            <Route path="/industrial" element={<IndustrialEquipment />} />
            <Route path="/filters/types" element={<FilterTypes />} />
            <Route path="/filters/all" element={<AllFilters />} />
            <Route path="/sim/list" element={<SimCardList />} />
            <Route path="/sim/orders" element={<SimCardOrders />} />



            <Route path="/user-management/member-cards" element={<MemberCardsList />} />
            <Route path="/user-management/card-transfer" element={<CardTransfer />} />
            <Route path="/user-management/recharge-regular" element={<RechargeRegular />} />
            <Route path="/user-management/recharge-batch" element={<RechargeBatch />} />
            <Route path="/user-management/bulk-recharge" element={<BulkRecharge />} />
            <Route path="/user-management/recharge-import-regular" element={<RechargeImportRegular />} />
            <Route path="/user-management/card-opening" element={<CardOpening />} />
            <Route path="/data-center/consumption-log" element={<ConsumptionLog />} />
            <Route path="/data-center/recharge-log" element={<RechargeLog />} />
            <Route path="/data-center/operations-log" element={<OperationsLog />} />
            <Route path="/data-center/download-center" element={<DownloadCenter />} />
            <Route path="/online-sales/three-level-config" element={<ThreeLevelConfig />} />
            <Route path="/online-sales/gift-config" element={<GiftConfig />} />
            <Route path="/online-sales/coin-payment-config" element={<CoinPaymentConfig />} />
            <Route path="/online-sales/package-management" element={<PackageManagement />} />
            <Route path="/online-sales/package-zones" element={<SalesPackageZones />} />
            <Route path="/online-sales/recharge-packages" element={<RechargePackages />} />
            <Route path="/online-sales/recharge-zones" element={<RechargeZones />} />
            <Route path="/online-sales/qr-products" element={<QRProducts />} />
            <Route path="/online-sales/qr-groups" element={<QRGroups />} />
            <Route path="/online-sales/promo-activities" element={<PromoActivities />} />
            <Route path="/online-sales/coupons" element={<CouponsConfig />} />
            <Route path="/employee-management/employee-list" element={<EmployeeList />} />
            <Route path="/employee-management/authorization-details" element={<AuthorizationDetails />} />
            <Route path="/employee-management/performance-records" element={<PerformanceRecords />} />
            <Route path="/employee-management/role-config" element={<RoleConfig />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;
