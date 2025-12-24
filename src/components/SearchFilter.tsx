import { ReactNode } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFilterProps {
  children: ReactNode;
  onSearch: () => void;
  onClear: () => void;
}

export function SearchFilter({ children, onSearch, onClear }: SearchFilterProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
        {children}
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSearch}
          className="flex items-center px-4 py-2 bg-[#4A90E2] text-white rounded hover:bg-[#3A7BC8] transition-colors"
        >
          <Search className="w-4 h-4 mr-2" />
          Поиск
        </button>
        <button
          onClick={onClear}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
        >
          <X className="w-4 h-4 mr-2" />
          Очистить
        </button>
      </div>
    </div>
  );
}

interface FilterFieldProps {
  label: string;
  type?: 'text' | 'select' | 'date';
  value: string;
  onChange: (value: string) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export function FilterField({ label, type = 'text', value, onChange, options, placeholder }: FilterFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'date' ? (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:border-transparent"
        />
      )}
    </div>
  );
}
