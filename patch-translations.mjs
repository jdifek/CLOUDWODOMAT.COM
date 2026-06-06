// patch-translations.mjs
// Запуск из корня проекта: node patch-translations.mjs
import { readFileSync, writeFileSync, existsSync } from "fs";

const TRANSLATIONS_FILE = "./src/locales/translations.ts";
const IS_CARDS_FILE     = "./src/pages/ISCardsPage.tsx";

// ── Переводы isCards ──────────────────────────────────────────────────────────

const isCardsEn = {
  title: "IC Cards",
  openCards: "Open Cards",
  refresh: "Refresh",
  cardsLoaded: "cards loaded",
  selected: "selected",
  search: "Search by card number, owner, device...",
  all: "All",
  active: "Active",
  lost: "Lost",
  cancelled: "Cancelled",
  assignToDevice: "Assign to Device",
  clear: "Clear",
  loading: "Loading cards...",
  noCards: "No cards found",
  selectAll: "Select all",
  deselectAll: "Deselect all",
  cards: "cards",
  balanceBonus: "Balance (bonus)",
  balanceCash: "Balance (cash)",
  owner: "Owner",
  created: "Created",
  plan: "Plan",
  expires: "Expires",
  lastUsed: "Last device",
  assignedDevices: "Assigned devices",
  noRestrictions: "No device restrictions",
  loadMore: "Load more",
  recharge: "Recharge",
  remoteSwipe: "Remote Swipe",
  assignDevices: "Assign Devices",
  reportLost: "Report Lost",
  restore: "Restore",
  details: "Details",
  clientInfo: "Client info",
  clientName: "Name",
  clientPhone: "Phone",
  clientNote: "Note",
  save: "Save",
  cancel: "Cancel",
  currentBalance: "Current balance",
  cash: "Cash",
  totalAmount: "Total amount (including bonus)",
  negativeDeduction: "Negative = deduction",
  actualCash: "Actual cash received",
  bonusPart: "value minus income = bonus part",
  howItWorks: "How it works",
  notifyDesc: "Sends the card balance to the device, equivalent to physically swiping the card.",
  card: "Card",
  device: "Device",
  selectDevice: "Select device",
  lastUsedAt: "Last used",
  activeOnDevice: "Card active on device",
  stopDispensing: "Stop dispensing",
  sendToDevice: "Send to Device",
  allDevices: "All devices",
  assignToAll: "Assign to all devices",
  cardsToAssign: "Cards to assign",
  searchDevices: "Search devices...",
  noDevices: "No devices",
  allowedPorts: "Allowed ports",
  applyAssignment: "Apply Assignment",
  openCardsTitle: "Open Cards",
  startNumber: "Start Card Number",
  count: "Count",
  maxCards: "Max 200 cards at once",
  deviceOptional: "Device (optional)",
  noDevice: "No device",
  cardDetails: "Card Details",
  deviceAssignmentsCount: "Device assignments",
  blockCard: "Block card",
  unblockCard: "Unblock card",
  limitCreateDesc: "limit-create (3.1.11)",
  remoteSwipeDesc: "Notify device (3.1.9)",
  addDeductBalance: "Add/deduct balance",
};

const isCardsRu = {
  title: "IC-Карты",
  openCards: "Открыть карты",
  refresh: "Обновить",
  cardsLoaded: "карт загружено",
  selected: "выбрано",
  search: "Поиск по номеру, владельцу, устройству...",
  all: "Все",
  active: "Активна",
  lost: "Утеряна",
  cancelled: "Отменена",
  assignToDevice: "Назначить устройство",
  clear: "Очистить",
  loading: "Загрузка карт...",
  noCards: "Карты не найдены",
  selectAll: "Выбрать все",
  deselectAll: "Снять выбор",
  cards: "карт",
  balanceBonus: "Баланс (бонус)",
  balanceCash: "Баланс (нал.)",
  owner: "Владелец",
  created: "Создана",
  plan: "Тариф",
  expires: "Действует до",
  lastUsed: "Последнее устройство",
  assignedDevices: "Назначено устройств",
  noRestrictions: "Нет ограничений по устройствам",
  loadMore: "Загрузить ещё",
  recharge: "Пополнить",
  remoteSwipe: "Удалённое считывание",
  assignDevices: "Назначить устройства",
  reportLost: "Утеря",
  restore: "Восстановить",
  details: "Детали",
  clientInfo: "Данные клиента",
  clientName: "Имя",
  clientPhone: "Телефон",
  clientNote: "Заметка",
  save: "Сохранить",
  cancel: "Отмена",
  currentBalance: "Текущий баланс",
  cash: "Наличные",
  totalAmount: "Сумма (включая бонус)",
  negativeDeduction: "Отрицательное = списание",
  actualCash: "Фактически получено",
  bonusPart: "value минус income = бонусная часть",
  howItWorks: "Как работает",
  notifyDesc: "Отправляет баланс карты на устройство, аналог физического считывания.",
  card: "Карта",
  device: "Устройство",
  selectDevice: "Выберите устройство",
  lastUsedAt: "Последнее использование",
  activeOnDevice: "Карта активна на устройстве",
  stopDispensing: "Остановить выдачу",
  sendToDevice: "Отправить на устройство",
  allDevices: "Все устройства",
  assignToAll: "Назначить на все устройства",
  cardsToAssign: "Карты для назначения",
  searchDevices: "Поиск устройств...",
  noDevices: "Нет устройств",
  allowedPorts: "Разрешённые порты",
  applyAssignment: "Применить назначение",
  openCardsTitle: "Открытие карт",
  startNumber: "Начальный номер карты",
  count: "Количество",
  maxCards: "Максимум 200 карт за раз",
  deviceOptional: "Устройство (опционально)",
  noDevice: "Без устройства",
  cardDetails: "Детали карты",
  deviceAssignmentsCount: "Назначения устройств",
  blockCard: "Заблокировать карту",
  unblockCard: "Разблокировать карту",
  limitCreateDesc: "limit-create (3.1.11)",
  remoteSwipeDesc: "Notify device (3.1.9)",
  addDeductBalance: "Добавить/списать баланс",
};

const isCardsPl = {
  title: "Karty IC",
  openCards: "Otwórz karty",
  refresh: "Odśwież",
  cardsLoaded: "kart załadowanych",
  selected: "zaznaczonych",
  search: "Szukaj po numerze, właścicielu, urządzeniu...",
  all: "Wszystkie",
  active: "Aktywna",
  lost: "Zgubiona",
  cancelled: "Anulowana",
  assignToDevice: "Przypisz do urządzenia",
  clear: "Wyczyść",
  loading: "Ładowanie kart...",
  noCards: "Nie znaleziono kart",
  selectAll: "Zaznacz wszystkie",
  deselectAll: "Odznacz wszystkie",
  cards: "kart",
  balanceBonus: "Saldo (bonus)",
  balanceCash: "Saldo (gotówka)",
  owner: "Właściciel",
  created: "Utworzono",
  plan: "Plan",
  expires: "Ważna do",
  lastUsed: "Ostatnie urządzenie",
  assignedDevices: "Przypisane urządzenia",
  noRestrictions: "Brak ograniczeń urządzeń",
  loadMore: "Załaduj więcej",
  recharge: "Doładuj",
  remoteSwipe: "Zdalne odczytanie",
  assignDevices: "Przypisz urządzenia",
  reportLost: "Zgubienie",
  restore: "Przywróć",
  details: "Szczegóły",
  clientInfo: "Dane klienta",
  clientName: "Imię",
  clientPhone: "Telefon",
  clientNote: "Notatka",
  save: "Zapisz",
  cancel: "Anuluj",
  currentBalance: "Aktualne saldo",
  cash: "Gotówka",
  totalAmount: "Kwota (z bonusem)",
  negativeDeduction: "Ujemna = odliczenie",
  actualCash: "Faktycznie otrzymano",
  bonusPart: "value minus income = część bonusowa",
  howItWorks: "Jak to działa",
  notifyDesc: "Wysyła saldo karty do urządzenia, odpowiednik fizycznego przyłożenia.",
  card: "Karta",
  device: "Urządzenie",
  selectDevice: "Wybierz urządzenie",
  lastUsedAt: "Ostatnie użycie",
  activeOnDevice: "Karta aktywna na urządzeniu",
  stopDispensing: "Zatrzymaj wydawanie",
  sendToDevice: "Wyślij do urządzenia",
  allDevices: "Wszystkie urządzenia",
  assignToAll: "Przypisz do wszystkich urządzeń",
  cardsToAssign: "Karty do przypisania",
  searchDevices: "Szukaj urządzeń...",
  noDevices: "Brak urządzeń",
  allowedPorts: "Dozwolone porty",
  applyAssignment: "Zastosuj przypisanie",
  openCardsTitle: "Otwieranie kart",
  startNumber: "Początkowy numer karty",
  count: "Ilość",
  maxCards: "Maksymalnie 200 kart naraz",
  deviceOptional: "Urządzenie (opcjonalnie)",
  noDevice: "Bez urządzenia",
  cardDetails: "Szczegóły karty",
  deviceAssignmentsCount: "Przypisania urządzeń",
  blockCard: "Zablokuj kartę",
  unblockCard: "Odblokuj kartę",
  limitCreateDesc: "limit-create (3.1.11)",
  remoteSwipeDesc: "Notify device (3.1.9)",
  addDeductBalance: "Dodaj/odlicz saldo",
};

// ── Утилита: объект → TS-строка ───────────────────────────────────────────────
function objToTs(obj, indent) {
  const pad = " ".repeat(indent);
  const inner = Object.entries(obj)
    .map(([k, v]) => `${pad}${k}: "${v}",`)
    .join("\n");
  return `{\n${inner}\n${" ".repeat(indent - 2)}}`;
}

// ── Вставить блок перед закрывающей } языкового раздела ──────────────────────
function insertBlock(src, lang, blockName, blockTs) {
  if (new RegExp(`\\b${blockName}:`).test(src)) {
    console.log(`  skip: ${lang}.${blockName} already exists`);
    return src;
  }
  const startIdx = src.indexOf(`  ${lang}: {`);
  if (startIdx === -1) {
    console.warn(`  WARN: section "${lang}:" not found`);
    return src;
  }
  let depth = 0, i = startIdx;
  while (i < src.length) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        const insertion = `    ${blockName}: ${blockTs},\n  `;
        return src.slice(0, i) + insertion + src.slice(i);
      }
    }
    i++;
  }
  console.warn(`  WARN: could not find end of section "${lang}"`);
  return src;
}

// ── Вставить один ключ в section внутри lang ─────────────────────────────────
function insertKey(src, lang, section, key, value) {
  const snippet = `${key}: "`;
  if (src.includes(snippet)) {
    console.log(`  skip: key "${key}" already exists`);
    return src;
  }
  const langStart = src.indexOf(`  ${lang}: {`);
  if (langStart === -1) return src;
  const sectionMarker = `    ${section}: {`;
  const secIdx = src.indexOf(sectionMarker, langStart);
  if (secIdx === -1) {
    console.warn(`  WARN: ${lang}.${section} not found`);
    return src;
  }
  let depth = 0, i = secIdx;
  while (i < src.length) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) {
        const insertion = `      ${key}: "${value}",\n    `;
        return src.slice(0, i) + insertion + src.slice(i);
      }
    }
    i++;
  }
  return src;
}

// ── 1. Патч translations.ts ───────────────────────────────────────────────────
console.log("\n=== translations.ts ===");
if (!existsSync(TRANSLATIONS_FILE)) {
  console.error("ERROR: not found: " + TRANSLATIONS_FILE);
  process.exit(1);
}
let tSrc = readFileSync(TRANSLATIONS_FILE, "utf-8");

for (const [lang, obj] of [["en", isCardsEn], ["ru", isCardsRu], ["pl", isCardsPl]]) {
  console.log(`  -> ${lang}.isCards`);
  tSrc = insertBlock(tSrc, lang, "isCards", objToTs(obj, 8));
}

const todayPayments = { en: "Payment types (today)", ru: "Типы оплат (сег.)", pl: "Typy płatności (dziś)" };
for (const [lang, val] of Object.entries(todayPayments)) {
  console.log(`  -> ${lang}.dashboard.todayPayments`);
  tSrc = insertKey(tSrc, lang, "dashboard", "todayPayments", val);
}

writeFileSync(TRANSLATIONS_FILE, tSrc, "utf-8");
console.log("  OK: translations.ts saved\n");

// ── 2. Патч ISCardsPage.tsx ───────────────────────────────────────────────────
console.log("=== ISCardsPage.tsx ===");
if (!existsSync(IS_CARDS_FILE)) {
  console.error("ERROR: not found: " + IS_CARDS_FILE);
  process.exit(1);
}
let pSrc = readFileSync(IS_CARDS_FILE, "utf-8");

// Добавить импорт useLanguage если нет
if (!pSrc.includes("useLanguage")) {
  pSrc = pSrc.replace(
    /^(import \{[^}]+\} from ["']react["'];)/m,
    `$1\nimport { useLanguage } from "../contexts/LanguageContext";`
  );
  console.log("  -> added useLanguage import");
}

// Добавить хук если нет
if (!pSrc.includes("const { t }") && !pSrc.includes("const {t}")) {
  pSrc = pSrc.replace(
    /export function ISCardsPage\(\) \{/,
    `export function ISCardsPage() {\n  const { t } = useLanguage();`
  );
  console.log("  -> added const { t } = useLanguage()");
}

// Замены хардкода
const replacements = [
  // JSX children
  [">IC Cards<",                              `>{t("isCards.title")}<`],
  [">Open Cards<",                            `>{t("isCards.openCards")}<`],
  [">Refresh<",                               `>{t("isCards.refresh")}<`],
  [">Load more<",                             `>{t("isCards.loadMore")}<`],
  [">Loading cards...<",                      `>{t("isCards.loading")}<`],
  [">No cards found<",                        `>{t("isCards.noCards")}<`],
  [">Deselect all<",                          `>{t("isCards.deselectAll")}<`],
  [">Select all<",                            `>{t("isCards.selectAll")}<`],
  [">Assign to Device<",                      `>{t("isCards.assignToDevice")}<`],
  [">Clear<",                                 `>{t("isCards.clear")}<`],
  [">Assigned to devices<",                   `>{t("isCards.assignedDevices")}<`],
  [">No device restrictions — works on all devices<", `>{t("isCards.noRestrictions")}<`],
  [">Current balance<",                       `>{t("isCards.currentBalance")}<`],
  [">Negative = deduction<",                  `>{t("isCards.negativeDeduction")}<`],
  [">value − income = bonus part<",           `>{t("isCards.bonusPart")}<`],
  [">Card active on device<",                 `>{t("isCards.activeOnDevice")}<`],
  [">Stop dispensing<",                       `>{t("isCards.stopDispensing")}<`],
  [">Send to Device<",                        `>{t("isCards.sendToDevice")}<`],
  [">All devices<",                           `>{t("isCards.allDevices")}<`],
  [">Cards to assign:<",                      `>{t("isCards.cardsToAssign")}:<`],
  [">No devices<",                            `>{t("isCards.noDevices")}<`],
  [">Apply Assignment<",                      `>{t("isCards.applyAssignment")}<`],
  [">Max 200 cards at once<",                 `>{t("isCards.maxCards")}<`],
  [">Card Details<",                          `>{t("isCards.cardDetails")}<`],
  [">How it works:<",                         `>{t("isCards.howItWorks")}:<`],
  [">Stop dispensing<",                       `>{t("isCards.stopDispensing")}<`],

  // placeholder
  [`placeholder="Search by card number, owner, device..."`, `placeholder={t("isCards.search")}`],
  [`placeholder="Search devices..."`,         `placeholder={t("isCards.searchDevices")}`],

  // title атрибуты
  [`title="Details"`,                         `title={t("isCards.details")}`],
  [`title="Recharge"`,                        `title={t("isCards.recharge")}`],
  [`title="Remote swipe (notify)"`,           `title={t("isCards.remoteSwipe")}`],
  [`title="Assign to device (limit)"`,        `title={t("isCards.assignDevices")}`],
  [`title="Report lost"`,                     `title={t("isCards.reportLost")}`],
  [`title="Restore"`,                         `title={t("isCards.restore")}`],
  [`title="Client notes"`,                    `title={t("isCards.clientInfo")}`],

  // label атрибуты (Field / InfoCell)
  [`label="Balance (bonus)"`,                 `label={t("isCards.balanceBonus")}`],
  [`label="Balance (cash)"`,                  `label={t("isCards.balanceCash")}`],
  [`label="Total balance"`,                   `label={t("isCards.balanceBonus")}`],
  [`label="Cash balance"`,                    `label={t("isCards.balanceCash")}`],
  [`label="Owner"`,                           `label={t("isCards.owner")}`],
  [`label="Created"`,                         `label={t("isCards.created")}`],
  [`label="Plan"`,                            `label={t("isCards.plan")}`],
  [`label="Expires"`,                         `label={t("isCards.expires")}`],
  [`label="Last used at"`,                    `label={t("isCards.lastUsed")}`],
  [`label="Last device"`,                     `label={t("isCards.lastUsed")}`],
  [`label="Assigned to devices"`,             `label={t("isCards.assignedDevices")}`],
  [`label="Total amount (including bonus)"`,  `label={t("isCards.totalAmount")}`],
  [`label="Actual cash received"`,            `label={t("isCards.actualCash")}`],
  [`label="Card"`,                            `label={t("isCards.card")}`],
  [`label="Device"`,                          `label={t("isCards.device")}`],
  [`label="Start Card Number"`,               `label={t("isCards.startNumber")}`],
  [`label="Count"`,                           `label={t("isCards.count")}`],
  [`label="Device (optional — opening device)"`, `label={t("isCards.deviceOptional")}`],
  [`label="Allowed ports:"`,                  `label={t("isCards.allowedPorts")}`],

  // select option
  [`<option value="">Select device</option>`, `<option value="">{t("isCards.selectDevice")}</option>`],
  [`<option value="">No device</option>`,     `<option value="">{t("isCards.noDevice")}</option>`],

  // ActionCard props (desc=)
  [`desc="Add/deduct balance"`,               `desc={t("isCards.addDeductBalance")}`],
  [`desc="Notify device (3.1.9)"`,            `desc={t("isCards.remoteSwipeDesc")}`],
  [`desc="limit-create (3.1.11)"`,            `desc={t("isCards.limitCreateDesc")}`],
  [`desc="Block card"`,                       `desc={t("isCards.blockCard")}`],
  [`desc="Unblock card"`,                     `desc={t("isCards.unblockCard")}`],

  // ActionCard label=
  [`label="Recharge"`,                        `label={t("isCards.recharge")}`],
  [`label="Remote Swipe"`,                    `label={t("isCards.remoteSwipe")}`],
  [`label="Assign Devices"`,                  `label={t("isCards.assignDevices")}`],
  [`label="Report Lost"`,                     `label={t("isCards.reportLost")}`],
  [`label="Restore"`,                         `label={t("isCards.restore")}`],
  [`label="Details"`,                         `label={t("isCards.details")}`],

  // Тексты внутри p / span
  [`cards loaded`,                            `{t("isCards.cardsLoaded")}`],
  [`· {selected.size} selected`,              `· {selected.size} {t("isCards.selected")}`],
  [`{cards.length} cards loaded`,             `{cards.length} {t("isCards.cardsLoaded")}`],
  [`{filtered.length} cards`,                 `{filtered.length} {t("isCards.cards")}`],
  [`selected: {selected.size}`,               `{t("isCards.selected")}: {selected.size}`],

  // STATUS_CONFIG labels
  [`label: "Active"`,                         `label: t("isCards.active")`],
  [`label: "Lost"`,                           `label: t("isCards.lost")`],
  [`label: "Cancelled"`,                      `label: t("isCards.cancelled")`],

  // Modal titles и тексты
  [`title="Recharge"`,                        `title={t("isCards.recharge")}`],
  [">Recharge<",                              `>{t("isCards.recharge")}<`],
  [`>Refresh<`,                               `>{t("isCards.refresh")}<`],
];

let changed = 0;
for (const [from, to] of replacements) {
  const before = pSrc;
  if (typeof from === "string") {
    pSrc = pSrc.split(from).join(to);
  } else {
    pSrc = pSrc.replace(from, to);
  }
  if (pSrc !== before) changed++;
}

writeFileSync(IS_CARDS_FILE, pSrc, "utf-8");
console.log(`  OK: ISCardsPage.tsx saved (${changed} replacements)\n`);
console.log("Done! Run: npm run build  (or your dev server)");
