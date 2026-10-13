// src/components/StatsCoverageBanner.tsx
// Показывает состояние: "сбор запущен" / "история докачивается" / "ошибка" / ничего (всё готово)
import { Loader2, AlertTriangle, Info, RefreshCw } from "lucide-react";
import type { StatsCoverage } from "../services/statsService";

const HISTORY_DAYS = 90;

function minskDay(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw" }).format(new Date(iso));
}

function fmt(day: string): string {
  const [y, m, d] = day.split("-");
  return `${d}.${m}.${y}`;
}

export function StatsCoverageBanner({
  coverage,
  from,
  error,
  onRetry,
}: {
  coverage?: StatsCoverage | null;
  from: string; // начало выбранного периода, YYYY-MM-DD
  error?: string | null;
  onRetry?: () => void;
}) {
  // 1) Запрос к нашему серверу не удался
  if (error) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-3">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span className="flex-1">{error}</span>
        {onRetry && (
          <button onClick={onRetry} className="flex items-center gap-1 font-medium underline">
            <RefreshCw className="w-3 h-3" /> Повторить
          </button>
        )}
      </div>
    );
  }

  if (!coverage) return null;

  // 2) Сбор для этого аккаунта ещё не стартовал / не завершил первый проход
  if (!coverage.loadedTo) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs text-blue-700 mb-3">
        <Loader2 className="w-4 h-4 shrink-0 animate-spin mt-0.5" />
        <span>
          Выполняется первичный сбор данных. Статистика появится в течение нескольких минут,
          история за 90 дней докачивается постепенно.
        </span>
      </div>
    );
  }

  // 3) История ещё докачивается, выбранный период покрыт не полностью
  const loadedFromDay = coverage.loadedFrom ? minskDay(coverage.loadedFrom) : null;
  if (!loadedFromDay || loadedFromDay > from) {
    const days = coverage.loadedFrom
      ? Math.max(0, (Date.now() - new Date(coverage.loadedFrom).getTime()) / 86_400_000)
      : 0;
    const progress = Math.min(100, Math.round((days / HISTORY_DAYS) * 100));
    return (
      <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 mb-3">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          Данные за выбранный период ещё собираются
          {loadedFromDay ? `: загружено с ${fmt(loadedFromDay)} (${progress}% из ${HISTORY_DAYS} дней)` : ""}.
          Цифры могут быть неполными, они дополнятся автоматически.
        </span>
      </div>
    );
  }

  // 4) Всё собрано, но последняя синхронизация упала — статистика может отставать
  if (coverage.lastError) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 mb-3">
        <AlertTriangle className="w-4 h-4 shrink-0 text-gray-400" />
        <span>Последнее обновление данных завершилось с ошибкой — цифры могут слегка отставать.</span>
      </div>
    );
  }

  return null;
}