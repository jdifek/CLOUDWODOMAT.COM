/* eslint-disable @typescript-eslint/no-empty-object-type */
import { apiHappy as $api } from "./api";

// ============================================
// БАЗОВЫЕ ПАРАМЕТРЫ
// ============================================
interface BaseParams {
  
}

// ============================================
// 3.1 МОДУЛЬ ЧЛЕНСКИХ КАРТ
// ============================================

// 3.1.1 Пополнение членской карты
interface CardRechargeRequest extends BaseParams {
  card: string; // Номер членской карты
  value: number; // Сумма пополнения (отрицательное значение = списание)
  income: number; // Реальная сумма оплаты (value - income = подарочная сумма)
  password?: string; // Пароль аккаунта продавца
  recharge_secret?: string; // Секретный ключ пополнения (альтернатива паролю)
  trad_id: string; // Уникальный ID транзакции
  type?: "addvalue" | "policy"; // Тип пополнения: обычное или по тарифу
  id?: string; // ID тарифа (если type указан)
}

interface CardRechargeResponse {
  error: string; // "0" = успех
  addvalue: string; // Сумма пополнения
  value: string; // Баланс после пополнения
  cash: string; // Реальный баланс (без подарков)
  number: string; // Номер карты
}

// 3.1.2 Получить историю потребления карты
interface CardConsumeHistoryRequest extends BaseParams {
  card: string; // Номер членской карты
}

interface ConsumeRecord {
  card_num: string; // Номер карты
  after_value: string; // Баланс после потребления
  saler: string; // Аккаунт продавца
  value: string; // Сумма потребления
  location: string; // Адрес устройства
  time: string; // Время загрузки
  device: string; // ID устройства
  cost_value: string; // Фактически списанная сумма
}

interface CardConsumeHistoryResponse {
  error: string;
  data: ConsumeRecord[];
}

// 3.1.3 Получить детали карты
interface CardInfoRequest extends BaseParams {
  card: string; // Номер членской карты
}

interface CardInfoResponse {
  error: string;
  data: {
    status: "normal" | "lost" | "cancel"; // Статус: нормальный/утерян/отменён
    shopname: string; // ID последнего использованного устройства
    saler: string; // Аккаунт продавца
    number: string; // Номер карты
    value: number; // Баланс карты
    cash: number; // Реальный баланс (без подарков)
    last_day: string | null; // Дата окончания тарифа
    owner: string; // Владелец карты (телефон)
    owner_name: string; // Имя владельца
    card_policy: string | null; // ID тарифа
  };
}

// 3.1.4 Получить историю пополнений карты
interface CardRechargeHistoryRequest extends BaseParams {
  card: string;
}

interface RechargeRecord {
  card_num: string;
  saler: string;
  value: number; // Сумма пополнения
  operater: string; // Оператор
  time: string; // Время пополнения
  value_afterdiscount: number; // Фактически зачисленная сумма
}

interface CardRechargeHistoryResponse {
  error: string;
  data: RechargeRecord[];
}

// 3.1.5 Открыть карту
interface CardOpenRequest extends BaseParams {
  deviceId?: string; // ID устройства (опционально)
  number: string; // Номер карты
  userid: string; // Продавец, которому принадлежит карта
  totalNumber?: number; // Количество карт для массового открытия (макс. 200)
}

interface CardOpenResponse {
  code: number; // 0 = успех
  msg: string;
  data: Array<{
    number: number;
    err: string;
  }>; // Только неудачные карты
}

// 3.1.6 Получить список членских карт
interface CardListRequest extends BaseParams {
  page: number; // Номер страницы (20 карт на страницу)
  phone?: string; // Телефон пользователя (опционально)
}

interface PolicyData {
  id: string;
  number: string;
  policy_id: string;
  name: string;
  type: string;
  value: number;
  period: string;
  balance: string;
  saler: string;
  expire_time: string;
  silent_time: string;
  start_time: string;
  last_consume_time: string;
  create_time: string;
  active_mode: string;
  remark: string | null;
  extend_data: {
    next_time: string;
    total_amount: string;
  };
  next_time: string;
  total_amount: string;
  renew: number;
}

interface CardListItem {
  index: string;
  owner: string; // Владелец (телефон)
  owner_name: string; // Имя владельца
  number: string; // Номер карты
  value: string; // Баланс (подарочная часть)
  cash: string; // Баланс (реальная часть)
  status: "normal" | "lost" | "cancel";
  shopname: string | null;
  create_time: string;
  card_policy: string;
  last_day: string;
  name: string;
  policy_data: PolicyData[] | string;
}

interface CardListResponse {
  code: number;
  msg: string;
  data: CardListItem[];
}

// 3.1.7 Получить диапазон номеров карт
interface CardSectionRequest extends BaseParams {}

interface CardSectionResponse {
  code: number;
  msg: string;
  data: Array<{
    card_start: string; // Начальный номер
    card_end: string; // Конечный номер
  }>;
}

// 3.1.8 Блокировка/разблокировка карты
interface CardLossReportRequest extends BaseParams {
  card: string; // Номер карты
  action: "normal" | "lost"; // normal = разблокировать, lost = заблокировать
}

interface CardLossReportResponse {
  code: number;
  msg: string;
  data: [];
}

// 3.1.9 Уведомление устройства для потребления без карты (удаленное считывание)
interface CardNotifyRequest extends BaseParams {
  card: string; // Номер карты
  password: string; // Пароль аккаунта продавца
  device: string; // ID устройства
}

interface CardNotifyResponse {
  data: string; // "通知成功" = успешно уведомлено
  error: string;
}

// 3.1.10 Удаленная остановка розлива для членской карты
interface CardStopRequest extends BaseParams {
  deviceId: string; // ID устройства
  number: string; // Номер карты
  ch?: "0" | "1" | "2" | "3"; // Канал устройства (опционально)
}

interface CardStopResponse {
  message: string;
  status: string; // "1" = успех, "0" = ошибка
}

// 3.1.11 Добавить ограничение на потребление для членской карты
interface CardLimitCreateRequest extends BaseParams {
  cardStart: string; // Начальный номер карты (макс. 200 карт)
  cardEnd: string; // Конечный номер карты
  deviceId: string; // ID устройства
  remark?: string; // Примечание
  port1?: "0" | "1"; // Порт 1: 1=можно, 0=нельзя (по умолчанию 1)
  port2?: "0" | "1"; // Порт 2
  port3?: "0" | "1"; // Порт 3
  port4?: "0" | "1"; // Порт 4
}

interface CardLimitCreateResponse {
  code: number;
  msg: string;
  data: Array<{
    cardNum: string;
    deviceId: string;
    msg: string; // "成功" или причина ошибки
  }>;
}

// ============================================
// 3.2 МОДУЛЬ ОНЛАЙН МАРКЕТИНГА
// ============================================

// 3.2.1 Создание заказа наличными
interface QRCreateRequest extends BaseParams {
  deviceId: string; // ID устройства
  value: number; // Сумма платежа (юань, минимум 0.1)
  userid: string; // Уникальный ID пользователя
  ch?: "0" | "1" | "2" | "3"; // Канал устройства
  location: string; // Адрес устройства
  salerOrderId: string; // Уникальный ID заказа продавца
}

interface QRCreateResponse {
  code: string; // "0" = успех, "1008" = нужно повторить
  msg: string;
  data: [];
}

// 3.2.2 Запрос заказа наличными
interface TradeQueryRequest extends BaseParams {
  deviceId: string;
  salerOrderId: string; // ID заказа продавца
}

interface TradeQueryResponse {
  code: number;
  msg: string;
  data: {
    key_id: string;
    card_num: string;
    alipay_number: string;
    operater: string;
    saler: string;
    value: string;
    value_afterdiscount: string;
    card_aftervalue: string;
    status:
      | "success"
      | "finished"
      | "refunding"
      | "refund"
      | "refund_p"
      | "failed"
      | "cancel";
    device: string;
    location: string;
    type: string;
    remark: string;
    time: string;
    balance: string; // Сумма к возврату
  };
}

// 3.2.3 Получить список записей потребления
interface RecordListRequest extends BaseParams {
  page?: number; // Номер страницы (по умолчанию 1, 20 записей на страницу)
  year?: number; // Год (по умолчанию текущий)
  beginTime?: string; // Начальное время (формат: Y-m-d H:i:s)
  endTime?: string; // Конечное время
}

interface ConsumeRecordItem {
  key_id: string;
  card_num: string;
  shop_num: string;
  value: string;
  path: string;
  time: string;
  pay_id: string;
  location: string;
  after_value: string;
  cost_value: string;
  water1: string; // Объем воды порт 1 (литры)
  water2: string; // Объем воды порт 2 (литры)
}

interface RecordListResponse {
  code: number;
  msg: string;
  data: ConsumeRecordItem[];
}

// 3.2.4 Получить список записей пополнений
interface AddValueListRequest extends BaseParams {
  page?: number;
  year?: number; // Год запроса
  beginTime?: string;
  endTime?: string;
}

interface AddValueRecordItem {
  key_id: string;
  card_num: string;
  alipay_number: string;
  operater: string;
  value: string;
  value_afterdiscount: string;
  card_aftervalue: string;
  status: string;
  device: string;
  location: string;
  type: string;
  is_openapi: number; // 0=не из Open API, 1=из Open API
  time: string;
}

interface AddValueListResponse {
  code: number;
  msg: string;
  data: AddValueRecordItem[];
}

// 3.2.5 Получить список тарифов пополнения
interface ProductsRequest extends BaseParams {}

interface PolicyProduct {
  status: number;
  index: number;
  sub_name: string;
  name: string;
  pay_type: number;
  price: number;
  default_days: number;
  period: number;
  limit_times: number;
  marking_price: number;
  type: string;
  silent_day: number;
  day_value: number;
}

interface RechargeProduct {
  status: number;
  index: number;
  name: string;
  price: number;
  value: string;
  marking_price: number;
  type: string;
  limit_times: number;
}

interface ProductsResponse {
  error: string;
  policy: PolicyProduct[]; // Тарифы с временным ограничением
  recharge: RechargeProduct[]; // Обычные тарифы пополнения
}

// ============================================
// 3.3 МОДУЛЬ УСТРОЙСТВ
// ============================================

// 3.3.1 Добавить устройство
interface AddDeviceRequest extends BaseParams {
  deviceId: string; // ID устройства
  location: string; // Адрес устройства
  type: "shop" | "shop_liquid" | "shop_happyfu" | "shop_water"; // Тип устройства
}

interface AddDeviceResponse {
  code: number;
  msg: string;
  data: [];
}

// 3.3.2 Удалить устройство
interface DelDeviceRequest extends BaseParams {
  deviceId: string;
}

interface DelDeviceResponse {
  code: number;
  msg: string;
  data: [];
}

// 3.3.3 Получить список устройств
interface DeviceListRequest extends BaseParams {
  type: "shop" | "shop_liquid" | "shop_happyfu" | "shop_water";
  page: number; // Номер страницы (20 устройств на страницу)
}

interface DeviceListItem {
  id: string; // ID устройства
  location: string; // Адрес
  water_time?: string; // Параметр для HappyFu
  price_time?: string; // Параметр для HappyFu
  port2_pricetime?: number; // Параметр для HappyFu
  create_time: string;
  is_online?: string; // Статус онлайн (устарело)
  is_onlie?: string; // Статус онлайн (устарело)
}

interface DeviceListResponse {
  code: number;
  msg: string;
  data: DeviceListItem[];
}

// 3.3.4 Получить детали устройства (новая версия)
interface DeviceDetailRequest extends BaseParams {
  deviceId: string;
}

interface DeviceExtraData {
  support_dual_port: string; // "0" или "1"
  latitude: string; // Широта (gcj02)
  longitude: string; // Долгота (gcj02)
  device_latitude: string; // Широта от устройства (WGS84)
  device_longitude: string; // Долгота от устройства (WGS84)
}

interface DeviceDetailResponse {
  code: number;
  msg: string;
  data: {
    id: string;
    saler: string;
    lastconnect: string | null;
    day_limit: string;
    flow_para: string;
    water_time: number; // Базовое время для 1 литра воды (порт 1)
    port2_waterlen: number; // Базовое время для 1 литра воды (порт 2)
    port2_water: number; // Базовое время (водоконтроль)
    location: string;
    status: string | null;
    status_cn: string; // Статус на китайском
    pay_status: string;
    version: string | null;
    limit: string; // Лимит на одну транзакцию (порт 1)
    limit2: string; // Лимит на одну транзакцию (порт 2)
    tds: string;
    signal: string;
    price_time: string;
    price_1: string;
    water_1: string;
    price_2: string;
    water_2: string;
    temp: number; // Температура устройства
    port_1_price: string; // Цена за литр (порт 1)
    port_2_price: string; // Цена за литр (порт 2)
    create_time: string;
    extra: DeviceExtraData | string;
  };
}

// 3.3.5 Изменить параметры устройства HappyFu
interface EditHappyFuParamsRequest extends BaseParams {
  type: "shop_happyfu";
  deviceId: string;
  water_time: "1" | "2"; // Количество импульсов на юань
  price_time: string; // Ширина импульса (мс)
  port2_pricetime: string; // Время открытия клапана на импульс (сек)
}

interface EditParamsResponse {
  code: string;
  msg: string;
  data: [];
}

// 3.3.6 Изменить параметры автомата по продаже воды/жидкости
interface EditShopParamsRequest extends BaseParams {
  deviceId: string;
  location: string;
  light_on_time: string; // Время включения подсветки (HH:mm:ss)
  light_off_time: string; // Время выключения подсветки
  O3_on_time: number; // Время работы озона (сек)
  O3_off_time: number; // Цикл озона (сек)
  temp_low: number; // Температура запуска терморегулятора (°C)
  temp_high: number; // Температура остановки терморегулятора (°C)
  day_limit: number; // Дневной лимит потребления (юань)
  limit: number; // Лимит на одну транзакцию (юань)
  temp_alert: number; // Температура предупреждения
  high_level_delaytime?: number;
  first_clean?: number;
  full_clean?: number;
  interval_clean?: number;
  error_clean?: number;
  make_water_delay?: number;
  interval_second?: number;
  capacity?: number;
  making_timeout?: number;
  w_cln_t?: number;
  making_flush_period?: number;
  clean_time?: number;
}

// 3.3.7 Изменить параметры водоконтроля
interface EditWaterParamsRequest extends BaseParams {
  deviceId: string;
  location: string;
  day_limit: number; // Дневной лимит (юань)
  limit: number; // Лимит на одну транзакцию (юань)
}

// 3.3.8 Калибровка цены автомата по продаже воды
interface CheckShopPriceRequest extends BaseParams {
  deviceId: string;
  flow_mode: "计时模式" | "流量计参数设置" | "流量计校准";
  price_1: string; // Цена воды порт 1 (юань)
  water_1: string; // Объем воды порт 1 (литры)
  flow_para: string; // Параметр расходомера
  price_2: string; // Цена воды порт 2
  water_2: string; // Объем воды порт 2
  status: "calibrate_timer" | "calibrate" | "calibrate_flow";
}

// 3.3.9 Калибровка цены водоконтроля
interface CheckWaterPriceRequest extends BaseParams {
  deviceId: string;
  flow_mode: "计时模式" | "流量计参数设置" | "流量计校准";
  price_1: string;
  water_1: string;
  flow_params_1: string;
  price_2: string;
  water_2: string;
  status: "calibrate_timer" | "calibrate" | "calibrate_flow";
  flow_params_2: string;
}

// 3.3.10 Удаленное включение/выключение устройства
interface PowerControlRequest extends BaseParams {
  deviceId: string;
  action: "on" | "off"; // on = включить, off = выключить
}

interface PowerControlResponse {
  code: string;
  msg: string;
  data: [];
}

// 3.3.11 Настройка голоса
interface VoiceSetRequest extends BaseParams {
  deviceId: string;
  welcome?: string; // Приветствие (по умолчанию: "欢迎光临")
  moneyEmpty?: string; // Сообщение о недостатке средств
  thanks?: string; // Прощание (по умолчанию: "谢谢使用欢迎下次光临")
  isAnnounceBalance: 0 | 1; // Озвучивать баланс
  isAnnounceConsume: 0 | 1; // Озвучивать сумму потребления
  isPlayMusic: 0 | 1; // Воспроизводить музыку
}

// 3.3.12 Настройка громкости голоса
interface VolSetRequest extends BaseParams {
  deviceId: string;
  vol: "静音" | "低" | "中" | "高"; // Громкость: тихо/низкая/средняя/высокая
}

// 3.3.13 Удаленное открытие замка
interface UnlockRequest extends BaseParams {
  deviceId: string;
}

// 3.3.14 Тонкая настройка цены автомата по продаже воды
interface ShopPriceAdjustRequest extends BaseParams {
  deviceId: string;
  one?: number; // Процент корректировки порт 1 (-100 до 100)
  two?: number; // Процент корректировки порт 2 (-100 до 100)
}

// 3.3.15 Тонкая настройка цены водоконтроля
interface WaterPriceAdjustRequest extends BaseParams {
  deviceId: string;
  one?: number;
  two?: number;
}

// 3.3.16 Получить записи инспекции устройства
interface DeviceCheckupRequest extends BaseParams {
  deviceId: string;
  page?: number; // Номер страницы (по умолчанию 1, 20 записей на страницу)
}

interface CheckupRecord {
  water_meter: string; // Показание счетчика воды
  raw_water: string; // Расход исходной воды (литры)
  sale_water: string; // Очищенная вода (литры)
  recovery_rate: string; // Коэффициент восстановления
  ele_meter: string; // Показание счетчика электроэнергии
  use_ele: string; // Потребление электроэнергии (кВт·ч)
  days: string; // Интервал дней
  day_use_ele: string; // Дневное потребление электроэнергии
  operator: string; // Инспектор
  remark: string; // Примечание
  create_time: string;
}

interface DeviceCheckupResponse {
  code: number;
  msg: string;
  data: CheckupRecord[];
}

// 3.3.17 Статистика проблемных устройств
interface ExceptionStatusCountRequest extends BaseParams {
  type: "shop" | "shop_liquid" | "shop_water";
}

interface ExceptionStatusCountResponse {
  code: number;
  msg: string;
  data: {
    total: string; // Общее количество проблемных устройств
  };
}

// 3.3.18 Запрос списка проблемных устройств
interface ExceptionStatusQueryRequest extends BaseParams {
  type: "shop" | "shop_liquid" | "shop_water";
  page?: number;
  num?: number; // Количество на страницу (по умолчанию 10)
}

interface ExceptionDevice {
  deviceId: string;
  name: string;
  status: string;
  temp: string;
  lastConnect: string;
  statusMsg: string;
  waterLevel: string;
  waterPressure: string; // Только для автоматов по продаже воды
}

interface ExceptionStatusQueryResponse {
  code: number;
  msg: string;
  data: {
    total: string;
    items: ExceptionDevice[];
  };
}

// ============================================
// 3.4 МОДУЛЬ SIM-КАРТ
// ============================================

// 3.4.1 Получить список SIM-карт
interface SimCardListRequest extends BaseParams {
  page: number;
}

interface SimCardItem {
  iccid: string; // Номер SIM-карты
  imei: string; // ID устройства
  vendor: string; // Оператор
  status: string; // Статус SIM-карты
  valid_date: string; // Дата истечения
  location: string; // Адрес устройства
  precharge_effect_date: string | null;
  used: string; // Использованный трафик (МБ)
}

interface SimCardListResponse {
  code: number;
  msg: string;
  data: SimCardItem[];
}

// 3.4.2 Получить ссылку на пополнение SIM-карты (только WeChat)
interface SimCardChargeLinkRequest extends BaseParams {
  iccid: string;
}

interface SimCardChargeLinkResponse {
  code: number;
  msg: string;
  data: {
    link: string; // Ссылка на пополнение
  };
}

// ============================================
// 3.5 МОДУЛЬ ЗАРЯДНЫХ СТАНЦИЙ
// ============================================

// 3.5.1 Получить детали устройства (зарядная станция)
interface ChargerDetailRequest extends BaseParams {
  deviceId: string;
}

interface ConsumeStandard {
  unit_price: number; // Цена (фэнь/час)
  power: string; // Максимальная мощность текущего уровня
  gear: string; // Уровень
  time: number; // В час (секунды)
  origin_time: number; // Исходное время (секунды)
  origin_price: number; // Исходная цена (фэнь)
  min_power: number; // Минимальная мощность текущего уровня
}

interface ChargePolicyInfo {
  id: string;
  name: string;
  model: "power" | "time"; // Режим: по мощности или по времени
  consume_standard: ConsumeStandard[];
  show_content: string; // JSON массив сумм для отображения (фэнь)
  full_stop: "on" | "off"; // Автоостановка при полной зарядке
  basis: string; // Базовая стоимость (в час/фэнь)
  time_max: string; // Максимальное время зарядки (минуты)
  min_power: string; // Минимальная мощность для остановки
  float_time: string; // Время подзарядки (минуты)
}

interface ChargerDetailResponse {
  code: number;
  msg: string;
  data: {
    id: string;
    saler: string;
    lastconnect: string;
    charge_policy_info: ChargePolicyInfo;
    location: string;
    status: string; // Формат: "0_0.00_2_0.00"
    status_cn: string;
    pay_status: string;
    version: string;
    create_time: string;
    signal: number;
    extra: {
      support_dual_port: string;
    };
    mode: string;
  };
}

// 3.5.2 Создание заказа зарядной станции
interface ChargeCreateRequest extends BaseParams {
  deviceId: string;
  userid: string; // ID пользователя
  ch: string; // Канал
  price: number; // Сумма платежа (юань)
  salerOrderId: string; // Уникальный ID заказа продавца
}

interface ChargeCreateResponse {
  code: string;
  msg: string;
  data: [];
}

// 3.5.3 Оплата картой на зарядной станции
interface ChargeCardPayRequest extends BaseParams {
  deviceId: string;
  userid: string;
  ch: string;
  price: number;
  cardNumber: string; // Номер членской карты
  type: "qrcode_charge_c"; // Фиксированное значение
  salerOrderId: string;
}

// 3.5.4 Запрос заказа зарядной станции
interface ChargeTradeQueryRequest extends BaseParams {
  deviceId: string;
  salerOrderId: string;
}

interface ChargeTradeQueryResponse {
  code: number;
  msg: string;
  data: {
    key_id: string;
    card_num: string;
    alipay_number: string;
    operater: string;
    saler: string;
    value: string;
    value_afterdiscount: string;
    card_aftervalue: string;
    status: "start" | "overload" | "overtime" | "pullout" | "finished"; // Статус зарядки
    device: string;
    location: string;
    type: "qrcode_charge" | "qrcode_charge_c";
    remark: string;
    time: string;
    balance: number; // Сумма к возврату
  };
}

// ============================================
// ОСНОВНОЙ СЕРВИС
// ============================================

export const HappyTiService = {
  // ====== 3.1 ЧЛЕНСКИЕ КАРТЫ ======

  /** 3.1.1 Пополнение членской карты (поддерживает списание отрицательными значениями) */
  cardRecharge(data: CardRechargeRequest) {
    return $api.post<CardRechargeResponse>("/addvalue", data);
  },

  /** 3.1.2 Получить историю потребления по карте */
  cardConsumeHistory(data: CardConsumeHistoryRequest) {
    return $api.get<CardConsumeHistoryResponse>("/getconsume", {
      params: data,
    });
  },

  /** 3.1.3 Получить детальную информацию о карте */
  cardInfo(data: CardInfoRequest) {
    return $api.get<CardInfoResponse>("/cardinfo", { params: data });
  },

  /** 3.1.4 Получить историю пополнений карты */
  cardRechargeHistory(data: CardRechargeHistoryRequest) {
    return $api.get<CardRechargeHistoryResponse>("/getaddvalue", {
      params: data,
    });
  },

  /** 3.1.5 Открыть карту (поддерживает массовое открытие до 200 карт) */
  cardOpen(data: CardOpenRequest) {
    return $api.get<CardOpenResponse>("/card/opencards", { params: data });
  },

  /** 3.1.6 Получить список членских карт (20 карт на страницу) */
  cardList(data: CardListRequest) {
    return $api.get<CardListResponse>("/card/getlist", { params: data });
  },

  /** 3.1.7 Получить диапазон номеров карт продавца */
  cardSection(data: CardSectionRequest) {
    return $api.get<CardSectionResponse>("/card/getsection", { params: data });
  },

  /** 3.1.8 Блокировка или разблокировка карты */
  cardLossReport(data: CardLossReportRequest) {
    return $api.get<CardLossReportResponse>("/card/lossreport", {
      params: data,
    });
  },

  /** 3.1.9 Уведомление устройства для потребления без карты (эквивалент считывания карты) */
  cardNotify(data: CardNotifyRequest) {
    return $api.post<CardNotifyResponse>("/notify", data);
  },

  /** 3.1.10 Удаленная остановка розлива для членской карты */
  cardStop(data: CardStopRequest) {
    return $api.get<CardStopResponse>("/card/stop", { params: data });
  },

  /** 3.1.11 Добавить ограничение на потребление для карт (только на указанных устройствах) */
  cardLimitCreate(data: CardLimitCreateRequest) {
    return $api.post<CardLimitCreateResponse>("/card/limit-create", data);
  },

  // ====== 3.2 ОНЛАЙН МАРКЕТИНГ ======

  /** 3.2.1 Создать заказ наличными (уведомляет устройство о платеже) */
  qrCreate(data: QRCreateRequest) {
    return $api.get<QRCreateResponse>("/trade/v2/qrcreate", { params: data });
  },

  /** 3.2.2 Запрос статуса заказа наличными */
  tradeQuery(data: TradeQueryRequest) {
    return $api.get<TradeQueryResponse>("/trade/query", { params: data });
  },

  /** 3.2.3 Получить список записей потребления (20 записей на страницу) */
  recordList(data: RecordListRequest) {
    return $api.get<RecordListResponse>("/record/getlist", { params: data });
  },

  /** 3.2.4 Получить список записей пополнений (20 записей на страницу) */
  addValueList(data: AddValueListRequest) {
    return $api.get<AddValueListResponse>("/addvalue/getlist", {
      params: data,
    });
  },

  /** 3.2.5 Получить список тарифов пополнения и временных тарифов */
  getProducts(data: ProductsRequest) {
    return $api.get<ProductsResponse>("/getproducts", { params: data });
  },

  // ====== 3.3 УСТРОЙСТВА ======

  /** 3.3.1 Добавить устройство */
  addDevice(data: AddDeviceRequest) {
    return $api.get<AddDeviceResponse>("/adddevice", { params: data });
  },

  /** 3.3.2 Удалить устройство */
  delDevice(data: DelDeviceRequest) {
    return $api.get<DelDeviceResponse>("/deldevice", { params: data });
  },

  /** 3.3.3 Получить список устройств (20 устройств на страницу) */
  deviceList(data: DeviceListRequest) {
    return $api.get<DeviceListResponse>("/getdevicelist", { params: data });
  },

  /** 3.3.4 Получить детальную информацию об устройстве (включая температуру) */
  deviceDetail(data: DeviceDetailRequest) {
    return $api.get<DeviceDetailResponse>("/device/getdetail", {
      params: data,
    });
  },

  /** 3.3.5 Изменить параметры устройства HappyFu */
  editHappyFuParams(data: EditHappyFuParamsRequest) {
    return $api.get<EditParamsResponse>("/editparams", { params: data });
  },

  /** 3.3.6 Изменить параметры автомата по продаже воды/жидкости */
  editShopParams(data: EditShopParamsRequest) {
    return $api.get<EditParamsResponse>("/device/editshopparams", {
      params: data,
    });
  },

  /** 3.3.7 Изменить параметры водоконтроля */
  editWaterParams(data: EditWaterParamsRequest) {
    return $api.get<EditParamsResponse>("/device/editwaterparams", {
      params: data,
    });
  },

  /** 3.3.8 Калибровка цены автомата по продаже воды */
  checkShopPrice(data: CheckShopPriceRequest) {
    return $api.get<EditParamsResponse>("/device/checkshopprice", {
      params: data,
    });
  },

  /** 3.3.9 Калибровка цены водоконтроля */
  checkWaterPrice(data: CheckWaterPriceRequest) {
    return $api.get<EditParamsResponse>("/device/checkwaterprice", {
      params: data,
    });
  },

  /** 3.3.10 Удаленное включение/выключение устройства */
  powerControl(data: PowerControlRequest) {
    return $api.get<PowerControlResponse>("/device/powercontrol", {
      params: data,
    });
  },

  /** 3.3.11 Настройка голосовых сообщений устройства */
  voiceSet(data: VoiceSetRequest) {
    return $api.get<PowerControlResponse>("/device/voice/set", {
      params: data,
    });
  },

  /** 3.3.12 Настройка громкости голоса устройства */
  volSet(data: VolSetRequest) {
    return $api.get<PowerControlResponse>("/device/vol/set", { params: data });
  },

  /** 3.3.13 Удаленное открытие замка устройства */
  unlock(data: UnlockRequest) {
    return $api.get<PowerControlResponse>("/device/unlock", { params: data });
  },

  /** 3.3.14 Тонкая настройка цены автомата по продаже воды (±100%) */
  shopPriceAdjust(data: ShopPriceAdjustRequest) {
    return $api.get<PowerControlResponse>("/device/shop-price-adjust", {
      params: data,
    });
  },

  /** 3.3.15 Тонкая настройка цены водоконтроля (±100%) */
  waterPriceAdjust(data: WaterPriceAdjustRequest) {
    return $api.get<PowerControlResponse>("/device/water-price-adjust", {
      params: data,
    });
  },

  /** 3.3.16 Получить записи инспекции устройства (20 записей на страницу) */
  deviceCheckup(data: DeviceCheckupRequest) {
    return $api.get<DeviceCheckupResponse>("/device/get-checkup", {
      params: data,
    });
  },

  /** 3.3.17 Статистика количества проблемных устройств */
  exceptionStatusCount(data: ExceptionStatusCountRequest) {
    return $api.get<ExceptionStatusCountResponse>(
      "/device/exception-status-count",
      { params: data }
    );
  },

  /** 3.3.18 Получить список проблемных устройств */
  exceptionStatusQuery(data: ExceptionStatusQueryRequest) {
    return $api.get<ExceptionStatusQueryResponse>(
      "/device/exception-status-query",
      { params: data }
    );
  },

  // ====== 3.4 SIM-КАРТЫ ======

  /** 3.4.1 Получить список SIM-карт (20 карт на страницу) */
  simCardList(data: SimCardListRequest) {
    return $api.get<SimCardListResponse>("/simcard/getlist", { params: data });
  },

  /** 3.4.2 Получить ссылку на пополнение SIM-карты (только для WeChat) */
  simCardChargeLink(data: SimCardChargeLinkRequest) {
    return $api.get<SimCardChargeLinkResponse>("/simcard/getchargelink", {
      params: data,
    });
  },

  // ====== 3.5 ЗАРЯДНЫЕ СТАНЦИИ ======

  /** 3.5.1 Получить детальную информацию о зарядной станции */
  chargerDetail(data: ChargerDetailRequest) {
    return $api.get<ChargerDetailResponse>("/device/getdetail", {
      params: data,
    });
  },

  /** 3.5.2 Создать заказ зарядной станции */
  chargeCreate(data: ChargeCreateRequest) {
    return $api.get<ChargeCreateResponse>("/charge/create", { params: data });
  },

  /** 3.5.3 Оплата картой на зарядной станции */
  chargeCardPay(data: ChargeCardPayRequest) {
    return $api.get<ChargeCreateResponse>("/charge/cardpay", { params: data });
  },

  /** 3.5.4 Запрос статуса заказа зарядной станции */
  chargeTradeQuery(data: ChargeTradeQueryRequest) {
    return $api.get<ChargeTradeQueryResponse>("/charge/trade/query", {
      params: data,
    });
  },
};
