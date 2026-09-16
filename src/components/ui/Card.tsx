import React from 'react';
import { X, Check } from 'lucide-react';
import { IngredientMiniature } from '../CulinaryGraphics';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-cream-card rounded-2xl border border-sand-border p-4 shadow-xs ${
        onClick ? 'cursor-pointer hover:border-forest/30 transition-colors' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

interface IngredientSlotProps {
  name: string;
  emoji?: string;
  onRemove?: () => void;
  className?: string;
}

export const IngredientSlot: React.FC<IngredientSlotProps> = ({
  name,
  emoji = '🥗',
  onRemove,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between px-3.5 py-3 bg-cream-card rounded-2xl border border-sand-border/80 shadow-2xs hover:border-sand-border transition-all ${className}`}
    >
      <div className="flex items-center gap-3">
        <IngredientMiniature name={name} fallbackEmoji={emoji} size={30} />
        <span className="text-sm font-bold text-charcoal tracking-tight capitalize">{name}</span>
      </div>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="w-8 h-8 flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-cream-surface rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

interface MatchBannerProps {
  text: string;
  subtext?: string;
  className?: string;
}

export const MatchBanner: React.FC<MatchBannerProps> = ({
  text,
  subtext,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center justify-between p-3.5 bg-sage/60 rounded-2xl border border-sage-dark/15 text-sage-dark ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-sage-dark text-cream flex items-center justify-center shrink-0">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
        <div>
          <p className="text-xs font-semibold text-sage-dark">{text}</p>
          {subtext && <p className="text-[11px] text-sage-dark/80 font-normal">{subtext}</p>}
        </div>
      </div>
      <Check className="w-4 h-4 text-sage-dark opacity-80 shrink-0" />
    </div>
  );
};
