import { ReactNode } from 'lucide-react';

interface ActionButtonProps {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  onClick?: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function ActionButton({ variant = 'primary', onClick, children, size = 'md' }: ActionButtonProps) {
  const variants = {
    primary: 'bg-[#4A90E2] hover:bg-[#3A7BC8] text-white',
    success: 'bg-[#5CB85C] hover:bg-[#4CA64C] text-white',
    warning: 'bg-[#F0AD4E] hover:bg-[#E09D3E] text-white',
    danger: 'bg-[#D9534F] hover:bg-[#C9433F] text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700'
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      onClick={onClick}
      className={`${variants[variant]} ${sizes[size]} rounded transition-colors font-medium`}
    >
      {children}
    </button>
  );
}
