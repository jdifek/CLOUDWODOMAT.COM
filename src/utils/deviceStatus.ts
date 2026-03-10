const STATUS_MAP: Record<string, Record<string, string>> = {
  ru: {
    // Устройство — базовые статусы
    离线: "Офлайн",
    在线: "Онлайн",
    正常: "Нормально",
    异常: "Ошибка",

    // Вода
    水满: "Бак полный",
    缺水: "Нет воды",
    制水中: "Идёт подготовка воды",
    制水: "Подготовка воды",
    冲洗中: "Идёт промывка",
    冲洗: "Промывка",

    // Давление — сначала длинные (с 报警), потом короткие
    低压报警: "Тревога: низкое давление",
    高压报警: "Тревога: высокое давление",
    低压: "Низкое давление",
    高压: "Высокое давление",

    // Тревоги и предупреждения
    报警: "Тревога",
    告警: "Предупреждение",
    故障: "Неисправность",
    错误: "Ошибка",
    停机: "Остановлено",
    超时: "Таймаут",

    // Бак — числовое значение обрабатывается отдельно ниже
    水箱水量: "Объём бака",
    水位: "Уровень воды",
    水压: "Давление воды",

    // Зарядные станции — розетки
    插座: "Розетка",
    状态: "статус",
    功率: "мощность",
    空闲: "свободна",
    充电中: "заряжается",
    已停止: "остановлено",
    超载: "перегрузка",
    已完成: "завершено",

    // Разделители и служебные слова
    "：": ": ",
    "；": "; ",
    ";": "; ",
  },
  pl: {
    离线: "Offline",
    在线: "Online",
    正常: "Normalny",
    异常: "Błąd",

    水满: "Zbiornik pełny",
    缺水: "Brak wody",
    制水中: "Przygotowanie wody w toku",
    制水: "Przygotowanie wody",
    冲洗中: "Płukanie w toku",
    冲洗: "Płukanie",

    低压报警: "Alarm: niskie ciśnienie",
    高压报警: "Alarm: wysokie ciśnienie",
    低压: "Niskie ciśnienie",
    高压: "Wysokie ciśnienie",

    报警: "Alarm",
    告警: "Ostrzeżenie",
    故障: "Awaria",
    错误: "Błąd",
    停机: "Zatrzymano",
    超时: "Przekroczono czas",

    水箱水量: "Poziom zbiornika",
    水位: "Poziom wody",
    水压: "Ciśnienie wody",

    插座: "Gniazdo",
    状态: "status",
    功率: "moc",
    空闲: "wolne",
    充电中: "ładowanie",
    已停止: "zatrzymano",
    超载: "przeciążenie",
    已完成: "zakończono",

    "：": ": ",
    "；": "; ",
    ";": "; ",
  },
  en: {
    离线: "Offline",
    在线: "Online",
    正常: "Normal",
    异常: "Error",

    水满: "Tank full",
    缺水: "No water",
    制水中: "Producing water",
    制水: "Producing water",
    冲洗中: "Flushing",
    冲洗: "Flushing",

    低压报警: "Alert: low pressure",
    高压报警: "Alert: high pressure",
    低压: "Low pressure",
    高压: "High pressure",

    报警: "Alert",
    告警: "Warning",
    故障: "Fault",
    错误: "Error",
    停机: "Stopped",
    超时: "Timeout",

    水箱水量: "Tank volume",
    水位: "Water level",
    水压: "Water pressure",

    插座: "Socket",
    状态: "status",
    功率: "power",
    空闲: "idle",
    充电中: "charging",
    已停止: "stopped",
    超载: "overload",
    已完成: "completed",

    "：": ": ",
    "；": "; ",
    ";": "; ",
  },
};

// Порядок замен критичен — более длинные/специфичные ключи должны идти первыми.
// Сортируем по убыванию длины ключа при инициализации.
const SORTED_MAPS: Record<string, [string, string][]> = {};
for (const lang of Object.keys(STATUS_MAP)) {
  SORTED_MAPS[lang] = Object.entries(STATUS_MAP[lang]).sort(
    ([a], [b]) => b.length - a.length
  );
}

export function translateStatusCn(
  status: string | null,
  language: string
): string {
  if (!status) return "—";

  const entries = SORTED_MAPS[language] ?? SORTED_MAPS["en"];
  let result = status;

  // 1. Заменяем все известные китайские подстроки
  for (const [cn, translated] of entries) {
    result = result.split(cn).join(translated);
  }

  // 2. Обрабатываем паттерн "Объём бака{N}L" → "Объём бака: {N}L"
  //    (после замены 水箱水量 → "Объём бака" перед числом нет пробела)
  result = result.replace(
    /(Объём бака|Poziom zbiornika|Tank volume)(\d+(?:\.\d+)?)(L|升)/g,
    "$1: $2 L"
  );

  // 3. Убираем дефис-разделитель между переведёнными частями
  //    Пример: "Тревога: низкое давление-Объём бака: 39 L"
  result = result.replace(/-(?=[А-ЯA-ZĄ-Ź])/g, " – ");

  // 4. Удаляем любые оставшиеся китайские символы (страховка)
  result = result.replace(/[\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]+/g, "").trim();

  // 5. Чистим лишние пробелы и артефакты
  result = result.replace(/\s{2,}/g, " ").trim();

  return result || "—";
}