const LOCALE_MAP: Record<string, string> = {
  pl: "pl-PL",
  ru: "ru-RU",
  en: "en-GB",
};

export function formatDate(
  dateStr: string | null | undefined,
  language: string
): string {
  if (!dateStr) return "—";

  const parts = dateStr.split(" ");
  if (parts.length < 2) return dateStr; // вернём как есть если формат неожиданный

  const [datePart, timePart] = parts;
  const dateParts = datePart.split("-").map(Number);
  const timeParts = timePart.split(":").map(Number);

  if (dateParts.length < 3 || timeParts.length < 2) return dateStr;

  const [year, month, day] = dateParts;
  const [hour, minute, second = 0] = timeParts;

  // Проверка что все числа валидны
  if ([year, month, day, hour, minute].some(isNaN)) return dateStr;

  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second) - 8 * 60 * 60 * 1000;

  return new Date(utcMs).toLocaleString(LOCALE_MAP[language] ?? "pl-PL", {
    timeZone: "Europe/Warsaw",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}