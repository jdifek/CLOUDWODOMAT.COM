import { VendingMachinesPage } from './VendingMachinesPage';
import { useLanguage } from '../../contexts/LanguageContext';

export function WaterControlDevices() {
  const { t } = useLanguage();
  return (
    <VendingMachinesPage
      deviceType="shop_water"
      title={t('nav.waterControlDevices')}
    />
  );
}