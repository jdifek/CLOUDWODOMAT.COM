interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'active' | 'inactive' | 'warning';
  label?: string;
}

export function StatusIndicator({ status, label }: StatusIndicatorProps) {
  const colors = {
    online: 'bg-green-500',
    offline: 'bg-red-500',
    active: 'bg-blue-500',
    inactive: 'bg-gray-400',
    warning: 'bg-yellow-500'
  };

  const textColors = {
    online: 'text-green-700',
    offline: 'text-red-700',
    active: 'text-blue-700',
    inactive: 'text-gray-700',
    warning: 'text-yellow-700'
  };

  return (
    <div className="flex items-center">
      <div className={`w-2 h-2 rounded-full ${colors[status]} mr-2`} />
      {label && <span className={`text-sm ${textColors[status]}`}>{label}</span>}
    </div>
  );
}
