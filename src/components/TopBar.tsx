import { Menu } from "lucide-react";
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const BOT_USERNAME = 'WodomatErrorbot';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();

  const languages = [
    { code: 'en' as const, flag: '🇬🇧', label: 'English' },
    { code: 'ru' as const, flag: '🇷🇺', label: 'Русский' },
    { code: 'pl' as const, flag: '🇵🇱', label: 'Polski' },
  ];

  const botLabels = {
    en: 'Open bot',
    ru: 'Открыть бота',
    pl: 'Otwórz bota',
  };

  const statusLabels = {
    en: 'Monitoring active',
    ru: 'Мониторинг активен',
    pl: 'Monitorowanie aktywne',
  };

  const botLink = user?.appid && user?.saler
    ? `https://t.me/${BOT_USERNAME}?start=APPID_${user.appid}_SALER_${user.saler}`
    : `https://t.me/${BOT_USERNAME}`;

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 h-[52px] flex items-center justify-between">
      
      {/* Левая часть */}
      <div className="flex items-center gap-2">
        
        {/* Burger button (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-md hover:bg-gray-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Статус */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>

        <span className="text-xs text-gray-500 hidden sm:block">
          {statusLabels[language]}
        </span>
      </div>

      {/* Правая часть */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Язык */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ru' | 'pl')}
          className="text-sm px-2 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.flag} {l.label}
            </option>
          ))}
        </select>

        <div className="w-px h-5 bg-gray-200" />

        {/* Кнопка бота */}
        <a
          href={botLink}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="w-[18px] h-[18px] rounded-full bg-[#29B6F6] flex items-center justify-center flex-shrink-0">
            <svg className="w-[11px] h-[11px] fill-white" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
          </div>
          <span>{botLabels[language]}</span>
        </a>
      </div>
    </div>
  );
}