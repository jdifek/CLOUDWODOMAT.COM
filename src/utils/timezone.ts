// utils/timezone.ts
// API китайский — всё время хранится в UTC+8.
// Польша — Europe/Warsaw (UTC+1 зима, UTC+2 лето).
// Для запросов к API нужно передавать UTC+8 время.

const pad = (n: number) => String(n).padStart(2, "0");

/** Текущая дата в Warsaw timezone → "YYYY-MM-DD" */
export function todayWarsaw(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date());
}

/**
 * Конвертирует строку времени API (UTC+8) → Date в реальном UTC.
 * Используется для отображения времени в Polish timezone через Intl.
 */
export function apiTimeToUtc(str: string): Date {
  const parts = str.split(" ");
  if (parts.length < 2) return new Date(str);
  const [datePart, timePart] = parts;
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second = 0] = timePart.split(":").map(Number);
  // UTC+8 → UTC: вычитаем 8 часов
  return new Date(Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000);
}

/**
 * Возвращает смещение Warsaw от UTC в минутах для заданного момента.
 * +60 зимой (UTC+1), +120 летом (UTC+2).
 */
function getWarsawOffsetMinutes(date: Date): number {
  const utcStr = date.toLocaleString("en-US", { timeZone: "UTC" });
  const warsawStr = date.toLocaleString("en-US", { timeZone: "Europe/Warsaw" });
  return (new Date(warsawStr).getTime() - new Date(utcStr).getTime()) / 60000;
}

/**
 * Дата "YYYY-MM-DD" (по-польски) → { begin, end } в формате UTC+8 для API.
 *
 * Логика:
 *   Warsaw 00:00 → UTC = Warsaw 00:00 - warsawOffset
 *   UTC+8 = UTC + 8h
 *   Итого: API begin = Warsaw 00:00 - warsawOffset + 8h
 */
export function warsawDayToApiRange(dateStr: string): { begin: string; end: string } {
  const [y, m, d] = dateStr.split("-").map(Number);

  // Полночь этого дня по Warsaw — находим UTC moment
  // Используем середину дня как референс для определения летнего/зимнего времени
  const noon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const warsawOffsetMin = getWarsawOffsetMinutes(noon);

  // Warsaw 00:00 в UTC (миллисекунды)
  const warsawMidnightUtcMs = Date.UTC(y, m - 1, d, 0, 0, 0) - warsawOffsetMin * 60 * 1000;

  // Конвертируем в UTC+8 (добавляем 8 часов)
  const beginUtc8Ms = warsawMidnightUtcMs + 8 * 60 * 60 * 1000;
  const endUtc8Ms = warsawMidnightUtcMs + (24 * 60 * 60 - 1) * 1000 + 8 * 60 * 60 * 1000;

  return {
    begin: msToApiString(beginUtc8Ms),
    end: msToApiString(endUtc8Ms),
  };
}

/** Миллисекунды → строка "YYYY-MM-DD HH:mm:ss" */
function msToApiString(ms: number): string {
  const d = new Date(ms);
  return [
    `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`,
  ].join(" ");
}

/**
 * Аналог для дашборда: N дней назад по Warsaw → API beginTime.
 * daysAgo=0 → сегодня, daysAgo=6 → 6 дней назад.
 */
export function warsawDaysAgoToApiRange(daysAgo: number): { begin: string; end: string } {
  const today = todayWarsaw();
  const [y, m, d] = today.split("-").map(Number);
  const targetDate = new Date(Date.UTC(y, m - 1, d - daysAgo));
  const targetStr = targetDate.toISOString().slice(0, 10);
  return warsawDayToApiRange(targetStr);
}

/**
 * Диапазон для последних N дней (от N дней назад до сегодня включительно).
 */
export function warsawRangeApiDates(daysBack: number): { begin: string; end: string } {
  const today = todayWarsaw();
  const [y, m, d] = today.split("-").map(Number);

  const noon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const warsawOffsetMin = getWarsawOffsetMinutes(noon);

  // Начало: N дней назад, полночь Warsaw → UTC+8
  const beginWarsawMidnightMs = Date.UTC(y, m - 1, d - daysBack, 0, 0, 0) - warsawOffsetMin * 60 * 1000;
  const beginUtc8Ms = beginWarsawMidnightMs + 8 * 60 * 60 * 1000;

  // Конец: сегодня 23:59:59 Warsaw → UTC+8
  const endWarsawMs = Date.UTC(y, m - 1, d, 23, 59, 59) - warsawOffsetMin * 60 * 1000;
  const endUtc8Ms = endWarsawMs + 8 * 60 * 60 * 1000;

  return {
    begin: msToApiString(beginUtc8Ms),
    end: msToApiString(endUtc8Ms),
  };
}

/**
 * Форматирует дату в Warsaw timezone для отображения.
 * "05.03" для графика, полная дата для UI.
 */
export function formatWarsawDate(date: Date, format: "short" | "full" = "full"): string {
  if (format === "short") {
    return new Intl.DateTimeFormat("pl-PL", {
      timeZone: "Europe/Warsaw",
      day: "2-digit",
      month: "2-digit",
    }).format(date);
  }
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}