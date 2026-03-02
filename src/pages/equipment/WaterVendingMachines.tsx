import { VendingMachinesPage } from "./VendingMachinesPage";
import { useLanguage } from "../../contexts/LanguageContext";

export function WaterVendingMachines() {
  const { t } = useLanguage();
  return (
    <VendingMachinesPage deviceType="shop" title={t("nav.waterVending")} />
  );
}
