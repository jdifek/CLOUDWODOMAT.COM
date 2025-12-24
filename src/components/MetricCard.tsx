import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: LucideIcon;
}

export function MetricCard({ title, value, change, icon: Icon }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 text-sm">{title}</span>
        <Icon className="w-5 h-5 text-[#4A90E2]" />
      </div>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
        <div className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
}
