import React from 'react';

interface ChipProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  variant?: 'preference' | 'match' | 'meta' | 'warning';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  active = false,
  onClick,
  variant = 'preference',
  className = '',
}) => {
  const isClickable = !!onClick;

  if (variant === 'match') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-sage text-sage-dark border border-sage-dark/20 ${className}`}
      >
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'meta') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cream-surface text-charcoal-muted border border-sand-border/70 ${className}`}
      >
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  if (variant === 'warning') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-terracotta-light text-terracotta border border-terracotta/20 ${className}`}
      >
        {icon}
        <span>{label}</span>
      </span>
    );
  }

  // preference chip (toggleable)
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!isClickable}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-150 border ${
        isClickable ? 'cursor-pointer select-none active:scale-95' : 'cursor-default'
      } ${
        active
          ? 'bg-sage text-sage-dark border-sage-dark/30 shadow-xs font-semibold'
          : 'bg-cream-surface text-charcoal-muted border-sand-border hover:bg-cream-surface/80 hover:text-charcoal'
      } ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};
