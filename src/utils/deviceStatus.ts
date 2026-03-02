const STATUS_MAP: Record<string, Record<string, string>> = {
  ru: {
    离线: "Офлайн",
    在线: "Онлайн",
    正常: "Нормально",
    异常: "Ошибка",
    水满: "Бак полный",
    缺水: "Нет воды",
    低压: "Низкое давление",
    高压: "Высокое давление",
    制水: "Подготовка воды",
    冲洗: "Промывка",
    水箱水量: "Объём бака",
  },
  pl: {
    离线: "Offline",
    在线: "Online",
    正常: "Normalny",
    异常: "Błąd",
    水满: "Zbiornik pełny",
    缺水: "Brak wody",
    低压: "Niskie ciśnienie",
    高压: "Wysokie ciśnienie",
    制水: "Przygotowanie wody",
    冲洗: "Płukanie",
    水箱水量: "Poziom wody",
  },
  en: {
    离线: "Offline",
    在线: "Online",
    正常: "Normal",
    异常: "Error",
    水满: "Tank full",
    缺水: "No water",
    低压: "Low pressure",
    高压: "High pressure",
    制水: "Producing water",
    冲洗: "Flushing",
    水箱水量: "Tank level",
  },
};

export function translateStatusCn(
  status: string | null,
  language: string
): string {
  if (!status) return "—";
  const map = STATUS_MAP[language] ?? STATUS_MAP["en"];
  let result = status;
  for (const [cn, translated] of Object.entries(map)) {
    result = result.split(cn).join(translated);
  }
  return result;
}
