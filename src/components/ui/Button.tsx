import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dashed' | 'ghost' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeClasses = {
    sm: variant === 'icon' ? 'p-2 rounded-full' : 'text-xs px-3.5 py-1.5 rounded-full gap-1.5',
    md: variant === 'icon' ? 'p-2.5 rounded-full' : 'text-sm px-5 py-3 rounded-full gap-2',
    lg: variant === 'icon' ? 'p-3.5 rounded-full' : 'text-base px-6 py-3.5 rounded-full gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-forest text-cream hover:bg-forest-light active:scale-[0.99] shadow-sm shadow-forest/20 font-semibold',
    secondary:
      'bg-cream-surface text-charcoal hover:bg-sage border border-sand-border active:scale-[0.99]',
    outline:
      'bg-transparent text-charcoal border border-sand-border hover:bg-cream-surface active:scale-[0.99]',
    dashed:
      'w-full bg-cream-surface/60 hover:bg-cream-surface text-charcoal-muted hover:text-charcoal border-2 border-dashed border-sand-border rounded-2xl py-3.5 font-medium active:scale-[0.99]',
    ghost:
      'bg-transparent text-charcoal-muted hover:text-charcoal hover:bg-cream-surface/60 rounded-full',
    icon:
      'bg-cream-card text-charcoal border border-sand-border/80 hover:bg-cream-surface hover:text-forest shadow-xs active:scale-95',
  }[variant];

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${widthClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
