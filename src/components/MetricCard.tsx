import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  prefix,
  suffix,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm">{title}</span>
        <Icon className="w-5 h-5 text-[#4A90E2]" />
      </div>

      <div className="flex items-center gap-1 text-3xl font-bold text-gray-900">
        {prefix && (
          <span className="text-[#4A90E2] text-2xl font-semibold">{prefix}</span>
        )}
        <span>{value}</span>
        {suffix && (
          <span className="text-[#4A90E2] text-2xl font-semibold">{suffix}</span>
        )}
      </div>
    </div>
  );
}