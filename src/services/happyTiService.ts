/* eslint-disable @typescript-eslint/no-empty-object-type */
import { apiHappy as $api, apiHappyUser as $apiUser } from "./api";

// ============================================
// БАЗОВЫЕ ПАРАМЕТРЫ
// ============================================
interface BaseParams {}

// ============================================
// 3.1 МОДУЛЬ ЧЛЕНСКИХ КАРТ
// ============================================

interface CardRechargeRequest extends BaseParams {
  card: string;
  value: number;
  income: number;
  password?: string;
  recharge_secret?: string;
  trad_id: string;
  type?: "addvalue" | "policy";
  id?: string;
}

interface CardRechargeResponse {
  error: string;
  addvalue: string;
  value: string;
  cash: string;
  number: string;
}

interface CardConsumeHistoryRequest extends BaseParams {
  card: string;
}

interface ConsumeRecord {
  card_num: string;
  after_value: string;
  saler: string;
  value: string;
  location: string;
  time: string;
  device: string;
  cost_value: string;
}

interface CardConsumeHistoryResponse {
  error: string;
  data: ConsumeRecord[];
}

interface CardInfoRequest extends BaseParams {
  card: string;
}

interface CardInfoResponse {
  error: string;
  data: {
    status: "normal" | "lost" | "cancel";
    shopname: string;
    saler: string;
    number: string;
    value: number;
    cash: number;
    last_day: string | null;
    owner: string;
    owner_name: string;
    card_policy: string | null;
  };
}

interface CardRechargeHistoryRequest extends BaseParams {
  card: string;
}

interface RechargeRecord {
  card_num: string;
  saler: string;
  value: number;
  operater: string;
  time: string;
  value_afterdiscount: number;
}

interface CardRechargeHistoryResponse {
  error: string;
  data: RechargeRecord[];
}

interface CardOpenRequest extends BaseParams {
  deviceId?: string;
  number: string;
  userid: string;
  totalNumber?: number;
}

interface CardOpenResponse {
  code: number;
  msg: string;
  data: Array<{ number: number; err: string }>;
}

interface CardListRequest extends BaseParams {
  page: number;
  phone?: string;
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
  extend_data: { next_time: string; total_amount: string };
  next_time: string;
  total_amount: string;
  renew: number;
}

interface CardListItem {
  index: string;
  owner: string;
  owner_name: string;
  number: string;
  value: string;
  cash: string;
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

interface CardSectionRequest extends BaseParams {}

interface CardSectionResponse {
  code: number;
  msg: string;
  data: Array<{ card_start: string; card_end: string }>;
}

interface CardLossReportRequest extends BaseParams {
  card: string;
  action: "normal" | "lost";
}

interface CardLossReportResponse {
  code: number;
  msg: string;
  data: [];
}

interface CardNotifyRequest extends BaseParams {
  card: string;
  password: string;
  device: string;
}

interface CardNotifyResponse {
  data: string;
  error: string;
}

interface CardStopRequest extends BaseParams {
  deviceId: string;
  number: string;
  ch?: "0" | "1" | "2" | "3";
}

interface CardStopResponse {
  message: string;
  status: string;
}

interface CardLimitCreateRequest extends BaseParams {
  cardStart: string;
  cardEnd: string;
  deviceId: string;
  remark?: string;
  port1?: "0" | "1";
  port2?: "0" | "1";
  port3?: "0" | "1";
  port4?: "0" | "1";
}

interface CardLimitCreateResponse {
  code: number;
  msg: string;
  data: Array<{ cardNum: string; deviceId: string; msg: string }>;
}

// ============================================
// 3.2 МОДУЛЬ ОНЛАЙН МАРКЕТИНГА
// ============================================

interface QRCreateRequest extends BaseParams {
  deviceId: string;
  value: number;
  userid: string;
  ch?: "0" | "1" | "2" | "3";
  location: string;
  salerOrderId: string;
}

interface QRCreateResponse {
  code: string;
  msg: string;
  data: [];
}

interface TradeQueryRequest extends BaseParams {
  deviceId: string;
  salerOrderId: string;
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
    status: "success" | "finished" | "refunding" | "refund" | "refund_p" | "failed" | "cancel";
    device: string;
    location: string;
    type: string;
    remark: string;
    time: string;
    balance: string;
  };
}

// year здесь намеренно НЕ экспортируется наружу — он проставляется автоматически внутри сервиса
interface RecordListRequest extends BaseParams {
  page?: number;
  beginTime?: string;
  endTime?: string;
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
  water1: string;
  water2: string;
}

interface RecordListResponse {
  error: number;
  code: number;
  msg: string;
  data: ConsumeRecordItem[];
}

// year здесь намеренно НЕ экспортируется наружу
interface AddValueListRequest extends BaseParams {
  page?: number;
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
  is_openapi: number;
  time: string;
}

interface AddValueListResponse {
  code: number;
  msg: string;
  data: AddValueRecordItem[];
}

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
  policy: PolicyProduct[];
  recharge: RechargeProduct[];
}

// ============================================
// 3.3 МОДУЛЬ УСТРОЙСТВ
// ============================================

interface AddDeviceRequest extends BaseParams {
  deviceId: string;
  location: string;
  type: "shop" | "shop_liquid" | "shop_happyfu" | "shop_water";
}

interface AddDeviceResponse {
  code: number;
  msg: string;
  data: [];
}

interface DelDeviceRequest extends BaseParams {
  deviceId: string;
}

interface DelDeviceResponse {
  code: number;
  msg: string;
  data: [];
}

interface DeviceListRequest extends BaseParams {
  type: "shop" | "shop_liquid" | "shop_happyfu" | "shop_water";
  page: number;
}

interface DeviceListItem {
  id: string;
  location: string;
  water_time?: string;
  price_time?: string;
  port2_pricetime?: number;
  create_time: string;
  is_online?: string;
  is_onlie?: string;
}

interface DeviceListResponse {
  code: number;
  msg: string;
  data: DeviceListItem[];
}

interface DeviceDetailRequest extends BaseParams {
  deviceId: string;
}

interface DeviceExtraData {
  support_dual_port: string;
  latitude: string;
  longitude: string;
  device_latitude: string;
  device_longitude: string;
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
    water_time: number;
    port2_waterlen: number;
    port2_water: number;
    location: string;
    status: string | null;
    status_cn: string;
    pay_status: string;
    version: string | null;
    limit: string;
    limit2: string;
    tds: string;
    signal: string;
    price_time: string;
    price_1: string;
    water_1: string;
    price_2: string;
    water_2: string;
    temp: number;
    port_1_price: string;
    port_2_price: string;
    create_time: string;
    extra: DeviceExtraData | string;
  };
}

interface EditHappyFuParamsRequest extends BaseParams {
  type: "shop_happyfu";
  deviceId: string;
  water_time: "1" | "2";
  price_time: string;
  port2_pricetime: string;
}

interface EditParamsResponse {
  code: string;
  msg: string;
  data: [];
}

interface EditShopParamsRequest extends BaseParams {
  deviceId: string;
  location: string;
  light_on_time: string;
  light_off_time: string;
  O3_on_time: number;
  O3_off_time: number;
  temp_low: number;
  temp_high: number;
  day_limit: number;
  limit: number;
  temp_alert: number;
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

interface EditWaterParamsRequest extends BaseParams {
  deviceId: string;
  location: string;
  day_limit: number;
  limit: number;
}

interface CheckShopPriceRequest extends BaseParams {
  deviceId: string;
  flow_mode: "计时模式" | "流量计参数设置" | "流量计校准";
  price_1: string;
  water_1: string;
  flow_para: string;
  price_2: string;
  water_2: string;
  status: "calibrate_timer" | "calibrate" | "calibrate_flow";
}

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

interface PowerControlRequest extends BaseParams {
  deviceId: string;
  action: "on" | "off";
}

interface PowerControlResponse {
  code: string;
  msg: string;
  data: [];
}

interface VoiceSetRequest extends BaseParams {
  deviceId: string;
  welcome?: string;
  moneyEmpty?: string;
  thanks?: string;
  isAnnounceBalance: 0 | 1;
  isAnnounceConsume: 0 | 1;
  isPlayMusic: 0 | 1;
}

interface VolSetRequest extends BaseParams {
  deviceId: string;
  vol: "静音" | "低" | "中" | "高";
}

interface UnlockRequest extends BaseParams {
  deviceId: string;
}

interface ShopPriceAdjustRequest extends BaseParams {
  deviceId: string;
  one?: number;
  two?: number;
}

interface WaterPriceAdjustRequest extends BaseParams {
  deviceId: string;
  one?: number;
  two?: number;
}

interface DeviceCheckupRequest extends BaseParams {
  deviceId: string;
  page?: number;
}

interface CheckupRecord {
  water_meter: string;
  raw_water: string;
  sale_water: string;
  recovery_rate: string;
  ele_meter: string;
  use_ele: string;
  days: string;
  day_use_ele: string;
  operator: string;
  remark: string;
  create_time: string;
}

interface DeviceCheckupResponse {
  error: number;
  code: number;
  msg: string;
  data: CheckupRecord[];
}

interface ExceptionStatusCountRequest extends BaseParams {
  type: "shop" | "shop_liquid" | "shop_water";
}

interface ExceptionStatusCountResponse {
  code: number;
  msg: string;
  data: { total: string };
}

interface ExceptionStatusQueryRequest extends BaseParams {
  type: "shop" | "shop_liquid" | "shop_water";
  page?: number;
  num?: number;
}

interface ExceptionDevice {
  deviceId: string;
  name: string;
  status: string;
  temp: string;
  lastConnect: string;
  statusMsg: string;
  waterLevel: string;
  waterPressure: string;
}

interface ExceptionStatusQueryResponse {
  code: number;
  msg: string;
  data: { total: string; items: ExceptionDevice[] };
}

// ============================================
// 3.4 МОДУЛЬ SIM-КАРТ
// ============================================

interface SimCardListRequest extends BaseParams {
  page: number;
}

interface SimCardItem {
  iccid: string;
  imei: string;
  vendor: string;
  status: string;
  valid_date: string;
  location: string;
  precharge_effect_date: string | null;
  used: string;
}

interface SimCardListResponse {
  code: number;
  msg: string;
  data: SimCardItem[];
}

interface SimCardChargeLinkRequest extends BaseParams {
  iccid: string;
}

interface SimCardChargeLinkResponse {
  code: number;
  msg: string;
  data: { link: string };
}

// ============================================
// 3.5 МОДУЛЬ ЗАРЯДНЫХ СТАНЦИЙ
// ============================================

interface ChargerDetailRequest extends BaseParams {
  deviceId: string;
}

interface ConsumeStandard {
  unit_price: number;
  power: string;
  gear: string;
  time: number;
  origin_time: number;
  origin_price: number;
  min_power: number;
}

interface ChargePolicyInfo {
  id: string;
  name: string;
  model: "power" | "time";
  consume_standard: ConsumeStandard[];
  show_content: string;
  full_stop: "on" | "off";
  basis: string;
  time_max: string;
  min_power: string;
  float_time: string;
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
    status: string;
    status_cn: string;
    pay_status: string;
    version: string;
    create_time: string;
    signal: number;
    extra: { support_dual_port: string };
    mode: string;
  };
}

interface ChargeCreateRequest extends BaseParams {
  deviceId: string;
  userid: string;
  ch: string;
  price: number;
  salerOrderId: string;
}

interface ChargeCreateResponse {
  code: string;
  msg: string;
  data: [];
}

interface ChargeCardPayRequest extends BaseParams {
  deviceId: string;
  userid: string;
  ch: string;
  price: number;
  cardNumber: string;
  type: "qrcode_charge_c";
  salerOrderId: string;
}

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
    status: "start" | "overload" | "overtime" | "pullout" | "finished";
    device: string;
    location: string;
    type: "qrcode_charge" | "qrcode_charge_c";
    remark: string;
    time: string;
    balance: number;
  };
}

// ============================================
// УТИЛИТЫ
// ============================================

/**
 * Извлекает год из строки beginTime ("YYYY-MM-DD HH:mm:ss" или "YYYY-MM-DD").
 * Если beginTime не передан — возвращает текущий год.
 */
function yearFromTime(beginTime?: string): number {
  if (beginTime && beginTime.length >= 4) {
    const y = Number(beginTime.slice(0, 4));
    if (!isNaN(y)) return y;
  }
  return new Date().getFullYear();
}

// ============================================
// ОСНОВНОЙ СЕРВИС
// ============================================

export const HappyTiService = {
  // ====== 3.1 ЧЛЕНСКИЕ КАРТЫ ======
  // Эти эндпоинты требуют параметр user= (не saler=)

  /** 3.1.1 Пополнение членской карты */
  cardRecharge(data: CardRechargeRequest) {
    return $apiUser.post<CardRechargeResponse>("/addvalue", data);
  },

  /** 3.1.2 Получить историю потребления по карте */
  cardConsumeHistory(data: CardConsumeHistoryRequest) {
    return $apiUser.get<CardConsumeHistoryResponse>("/getconsume", { params: data });
  },

  /** 3.1.3 Получить детальную информацию о карте */
  cardInfo(data: CardInfoRequest) {
    return $apiUser.get<CardInfoResponse>("/cardinfo", { params: data });
  },

  /** 3.1.4 Получить историю пополнений карты */
  cardRechargeHistory(data: CardRechargeHistoryRequest) {
    return $apiUser.get<CardRechargeHistoryResponse>("/getaddvalue", { params: data });
  },

  /** 3.1.5 Открыть карту */
  cardOpen(data: CardOpenRequest) {
    return $api.get<CardOpenResponse>("/card/opencards", { params: data });
  },

  /** 3.1.6 Получить список членских карт */
  cardList(data: CardListRequest) {
    return $api.get<CardListResponse>("/card/getlist", { params: data });
  },

  /** 3.1.7 Получить диапазон номеров карт продавца */
  cardSection(data: CardSectionRequest) {
    return $api.get<CardSectionResponse>("/card/getsection", { params: data });
  },

  /** 3.1.8 Блокировка или разблокировка карты */
  cardLossReport(data: CardLossReportRequest) {
    return $api.get<CardLossReportResponse>("/card/lossreport", { params: data });
  },

  /** 3.1.9 Уведомление устройства (удаленное считывание карты) */
  cardNotify(data: CardNotifyRequest) {
    return $apiUser.post<CardNotifyResponse>("/notify", data);
  },

  /** 3.1.10 Удаленная остановка розлива */
  cardStop(data: CardStopRequest) {
    return $api.get<CardStopResponse>("/card/stop", { params: data });
  },

  /** 3.1.11 Добавить ограничение на потребление */
  cardLimitCreate(data: CardLimitCreateRequest) {
    return $api.post<CardLimitCreateResponse>("/card/limit-create", data);
  },

  // ====== 3.2 ОНЛАЙН МАРКЕТИНГ ======

  /** 3.2.1 Создать заказ наличными */
  qrCreate(data: QRCreateRequest) {
    return $api.get<QRCreateResponse>("/trade/v2/qrcreate", { params: data });
  },

  /** 3.2.2 Запрос статуса заказа наличными */
  tradeQuery(data: TradeQueryRequest) {
    return $api.get<TradeQueryResponse>("/trade/query", { params: data });
  },

  /**
   * 3.2.3 Получить список записей потребления.
   * year проставляется автоматически из beginTime — снаружи передавать не нужно.
   */
  recordList(data: RecordListRequest) {
    return $api.get<RecordListResponse>("/record/getlist", {
      params: { ...data, year: yearFromTime(data.beginTime) },
    });
  },

  /**
   * 3.2.4 Получить список записей пополнений.
   * year проставляется автоматически из beginTime — снаружи передавать не нужно.
   */
  addValueList(data: AddValueListRequest) {
    return $api.get<AddValueListResponse>("/addvalue/getlist", {
      params: { ...data, year: yearFromTime(data.beginTime) },
    });
  },

  /** 3.2.5 Получить список тарифов */
  getProducts(data: ProductsRequest) {
    return $apiUser.get<ProductsResponse>("/getproducts", { params: data });
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

  /** 3.3.3 Получить список устройств */
  deviceList(data: DeviceListRequest) {
    return $api.get<DeviceListResponse>("/getdevicelist", { params: data });
  },

  /** 3.3.4 Получить детали устройства */
  deviceDetail(data: DeviceDetailRequest) {
    return $api.get<DeviceDetailResponse>("/device/getdetail", { params: data });
  },

  /** 3.3.5 Изменить параметры HappyFu */
  editHappyFuParams(data: EditHappyFuParamsRequest) {
    return $api.get<EditParamsResponse>("/editparams", { params: data });
  },

  /** 3.3.6 Изменить параметры售水机/售液机 */
  editShopParams(data: EditShopParamsRequest) {
    return $api.get<EditParamsResponse>("/device/editshopparams", { params: data });
  },

  /** 3.3.7 Изменить параметры водоконтроля */
  editWaterParams(data: EditWaterParamsRequest) {
    return $api.get<EditParamsResponse>("/device/editwaterparams", { params: data });
  },

  /** 3.3.8 Калибровка цены售水机 */
  checkShopPrice(data: CheckShopPriceRequest) {
    return $api.get<EditParamsResponse>("/device/checkshopprice", { params: data });
  },

  /** 3.3.9 Калибровка цены водоконтроля */
  checkWaterPrice(data: CheckWaterPriceRequest) {
    return $api.get<EditParamsResponse>("/device/checkwaterprice", { params: data });
  },

  /** 3.3.10 Удаленное включение/выключение */
  powerControl(data: PowerControlRequest) {
    return $api.get<PowerControlResponse>("/device/powercontrol", { params: data });
  },

  /** 3.3.11 Настройка голоса */
  voiceSet(data: VoiceSetRequest) {
    return $api.get<PowerControlResponse>("/device/voice/set", { params: data });
  },

  /** 3.3.12 Настройка громкости */
  volSet(data: VolSetRequest) {
    return $api.get<PowerControlResponse>("/device/vol/set", { params: data });
  },

  /** 3.3.13 Удаленное открытие замка */
  unlock(data: UnlockRequest) {
    return $api.get<PowerControlResponse>("/device/unlock", { params: data });
  },

  /** 3.3.14 Микронастройка цены售水机 */
  shopPriceAdjust(data: ShopPriceAdjustRequest) {
    return $api.get<PowerControlResponse>("/device/shop-price-adjust", { params: data });
  },

  /** 3.3.15 Микронастройка цены водоконтроля */
  waterPriceAdjust(data: WaterPriceAdjustRequest) {
    return $api.get<PowerControlResponse>("/device/water-price-adjust", { params: data });
  },

  /** 3.3.16 Записи инспекции устройства */
  deviceCheckup(data: DeviceCheckupRequest) {
    return $api.get<DeviceCheckupResponse>("/device/get-checkup", { params: data });
  },

  /** 3.3.17 Статистика проблемных устройств */
  exceptionStatusCount(data: ExceptionStatusCountRequest) {
    return $api.get<ExceptionStatusCountResponse>("/device/exception-status-count", { params: data });
  },

  /** 3.3.18 Список проблемных устройств */
  exceptionStatusQuery(data: ExceptionStatusQueryRequest) {
    return $api.get<ExceptionStatusQueryResponse>("/device/exception-status-query", { params: data });
  },

  // ====== 3.4 SIM-КАРТЫ ======

  /** 3.4.1 Список SIM-карт */
  simCardList(data: SimCardListRequest) {
    return $api.get<SimCardListResponse>("/simcard/getlist", { params: data });
  },

  /** 3.4.2 Ссылка на пополнение SIM-карты */
  simCardChargeLink(data: SimCardChargeLinkRequest) {
    return $api.get<SimCardChargeLinkResponse>("/simcard/getchargelink", { params: data });
  },

  // ====== 3.5 ЗАРЯДНЫЕ СТАНЦИИ ======

  /** 3.5.1 Детали зарядной станции */
  chargerDetail(data: ChargerDetailRequest) {
    return $api.get<ChargerDetailResponse>("/device/getdetail", { params: data });
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
    return $api.get<ChargeTradeQueryResponse>("/charge/trade/query", { params: data });
  },
};