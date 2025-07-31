import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300',
    outline: 'border-2 border-amber-500 text-amber-600 hover:bg-amber-50',
    ghost: 'text-amber-600 hover:bg-amber-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl'
  };
  
  const sizes = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-base min-h-[44px]', // Touch-friendly minimum
    lg: 'px-6 py-4 text-lg min-h-[52px]'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};