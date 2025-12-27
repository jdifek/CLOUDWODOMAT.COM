import { Menu, RefreshCw, Tag, Maximize2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en' as const, flag: '🇬🇧', label: 'English' },
    { code: 'ru' as const, flag: '🇷🇺', label: 'Русский' },
    { code: 'pl' as const, flag: '🇵🇱', label: 'Polski' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 md:space-x-4">
        <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded lg:hidden">
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <RefreshCw className="w-5 h-5 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded">
          <Tag className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4">
        

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'ru' | 'pl')}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.label}
            </option>
          ))}
        </select>

        <button className="p-2 hover:bg-gray-100 rounded">
          <Maximize2 className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
