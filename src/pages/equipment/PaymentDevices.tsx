import { VendingMachinesPage } from './VendingMachinesPage';
import { useLanguage } from '../../contexts/LanguageContext';

export function PaymentDevices() {
  const { t } = useLanguage();
  return (
    <VendingMachinesPage
      deviceType="shop_happyfu"
      title={t('nav.paymentDevices')}
    />
  );
}