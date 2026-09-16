import React from 'react';
import { ArrowLeft, Sparkles, ChefHat } from 'lucide-react';
import { Button } from './ui/Button';

interface IngredientEntryPlaceholderProps {
  initialIngredients?: string[];
  onBackToLanding: () => void;
}

export const IngredientEntryPlaceholder: React.FC<IngredientEntryPlaceholderProps> = ({
  initialIngredients = [],
  onBackToLanding,
}) => {
  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-sage selection:text-forest">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between">
        {/* Top bar with back button */}
        <div className="flex items-center justify-between pb-4">
          <Button
            variant="icon"
            size="md"
            onClick={onBackToLanding}
            aria-label="Back to landing"
            id="back-to-landing-btn"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </Button>
          <span className="text-xs font-semibold text-charcoal-muted">
            Screen B · Prompt 3 Next
          </span>
        </div>

        {/* Placeholder notice */}
        <div className="my-auto text-center space-y-4 py-12 px-6 bg-cream-card rounded-3xl border border-sand-border shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-sage text-sage-dark mx-auto flex items-center justify-center">
            <ChefHat className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest">
            Ingredient Entry Screen
          </h2>
          <p className="text-sm text-charcoal-muted leading-relaxed">
            Navigation from Screen A is verified!
            {initialIngredients.length > 0 && (
              <span className="block mt-2 font-medium text-forest">
                Pre-selected starter: {initialIngredients.join(', ')}
              </span>
            )}
          </p>
          <div className="p-3 bg-sage/40 rounded-2xl border border-sage-dark/15 text-xs text-sage-dark flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-terracotta" />
            <span>Ready for <strong>Prompt 3 — Ingredient entry (Screen B)</strong></span>
          </div>
        </div>

        {/* Back action */}
        <div className="pt-6">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onBackToLanding}
          >
            ← Return to Landing Page
          </Button>
        </div>
      </div>
    </div>
  );
};
