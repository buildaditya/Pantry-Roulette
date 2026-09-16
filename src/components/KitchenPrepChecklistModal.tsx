import React, { useState } from 'react';
import {
  X,
  ShoppingCart,
  Check,
  Copy,
  Share2,
  Printer,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Recipe } from '../types';
import { Button } from './ui/Button';
import { scaleAmount } from '../utils/amountScaler';

interface KitchenPrepChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  servings?: number;
}

export const KitchenPrepChecklistModal: React.FC<KitchenPrepChecklistModalProps> = ({
  isOpen,
  onClose,
  recipe,
  servings,
}) => {
  const currentServings = servings || recipe.servings || 2;
  const scaleFactor = currentServings / (recipe.servings || 2);
  // Map of ingredient index to: 'have' | 'need'
  const [itemStatus, setItemStatus] = useState<Record<number, 'have' | 'need'>>(() => {
    const initial: Record<number, 'have' | 'need'> = {};
    recipe.ingredients.forEach((ing, idx) => {
      // Provided ingredients default to 'have', staples default to 'need'
      initial[idx] = ing.isProvidedIngredient ? 'have' : 'need';
    });
    return initial;
  });

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const toggleStatus = (idx: number) => {
    setItemStatus((prev) => ({
      ...prev,
      [idx]: prev[idx] === 'have' ? 'need' : 'have',
    }));
  };

  const markAllStaplesAsHave = () => {
    const updated = { ...itemStatus };
    recipe.ingredients.forEach((_, idx) => {
      updated[idx] = 'have';
    });
    setItemStatus(updated);
  };

  const markAllStaplesAsNeed = () => {
    const updated = { ...itemStatus };
    recipe.ingredients.forEach((ing, idx) => {
      if (!ing.isProvidedIngredient) {
        updated[idx] = 'need';
      }
    });
    setItemStatus(updated);
  };

  const neededIngredients = recipe.ingredients.filter(
    (_, idx) => itemStatus[idx] === 'need'
  );
  const haveIngredients = recipe.ingredients.filter(
    (_, idx) => itemStatus[idx] === 'have'
  );

  const generateShareText = () => {
    const lines = [
      `🛒 Shopping & Prep List for "${recipe.title}"`,
      `⏱️ Time: ${recipe.totalTimeMinutes}m | Servings: ${currentServings}`,
      '',
    ];

    if (neededIngredients.length > 0) {
      lines.push('📋 NEED TO BUY / MISSING:');
      neededIngredients.forEach((ing) => {
        lines.push(`• [ ] ${ing.name} (${scaleAmount(ing.amount, scaleFactor)})`);
      });
      lines.push('');
    }

    if (haveIngredients.length > 0) {
      lines.push('✅ ALREADY IN PANTRY / FRIDGE:');
      haveIngredients.forEach((ing) => {
        lines.push(`• [x] ${ing.name} (${scaleAmount(ing.amount, scaleFactor)})`);
      });
      lines.push('');
    }

    lines.push('Generated with Pantry Roulette 🍳');
    return lines.join('\n');
  };

  const handleCopyList = async () => {
    const text = generateShareText();
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleShareList = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Shopping List: ${recipe.title}`,
          text,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyList();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4 animate-in fade-in duration-150 print:p-0 print:bg-white">
      <div className="bg-cream-card rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col border border-sand-border shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-h-none">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-sand-border flex items-center justify-between bg-cream-surface/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-forest text-cream flex items-center justify-center shadow-2xs">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-charcoal leading-tight">
                Kitchen Prep & Shopping
              </h2>
              <p className="text-xs text-charcoal-muted truncate max-w-[240px] sm:max-w-xs">
                {recipe.title}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-full border border-sand-border text-charcoal-muted hover:bg-cream-surface transition-colors cursor-pointer"
              title="Print checklist"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full border border-sand-border text-charcoal-muted hover:bg-cream-surface transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Copy Feedback */}
        {copied && (
          <div className="bg-forest text-cream text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-1.5 animate-in slide-in-from-top-1">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Checklist copied to clipboard!</span>
          </div>
        )}

        {/* Action Bar / Quick Filters */}
        <div className="px-5 pt-3 pb-1 flex items-center justify-between text-xs print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-charcoal">
              {neededIngredients.length} to buy
            </span>
            <span className="text-charcoal-subtle">•</span>
            <span className="text-charcoal-muted">
              {haveIngredients.length} in pantry
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={markAllStaplesAsHave}
              className="text-forest font-semibold hover:underline cursor-pointer"
            >
              I have all
            </button>
            <span className="text-sand-border">|</span>
            <button
              type="button"
              onClick={markAllStaplesAsNeed}
              className="text-terracotta font-semibold hover:underline cursor-pointer"
            >
              Reset staples
            </button>
          </div>
        </div>

        {/* Scrollable Checklist Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5">
          {/* Items To Buy Section */}
          {neededIngredients.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-terracotta uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Items to pick up ({neededIngredients.length})</span>
                </span>
                <span className="text-[11px] text-charcoal-subtle">
                  Tap to mark as in pantry
                </span>
              </div>

              <div className="space-y-1.5">
                {recipe.ingredients.map((ing, idx) => {
                  if (itemStatus[idx] !== 'need') return null;
                  return (
                    <button
                      key={`need-${idx}`}
                      type="button"
                      onClick={() => toggleStatus(idx)}
                      className="w-full flex items-center justify-between p-3 rounded-2xl border border-terracotta/30 bg-terracotta/5 hover:bg-terracotta/10 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-lg border-2 border-terracotta/60 bg-cream flex items-center justify-center" />
                        <div>
                          <span className="text-xs sm:text-sm font-semibold text-charcoal block">
                            {ing.name}
                          </span>
                          {!ing.isProvidedIngredient && (
                            <span className="text-[10px] text-charcoal-muted uppercase">
                              Pantry staple
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-mono font-medium text-terracotta shrink-0 pl-2">
                        {scaleAmount(ing.amount, scaleFactor)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items Already In Pantry Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Ready in your kitchen ({haveIngredients.length})</span>
              </span>
              <span className="text-[11px] text-charcoal-subtle">
                Tap to move to shopping list
              </span>
            </div>

            <div className="space-y-1.5">
              {recipe.ingredients.map((ing, idx) => {
                if (itemStatus[idx] !== 'have') return null;
                return (
                  <button
                    key={`have-${idx}`}
                    type="button"
                    onClick={() => toggleStatus(idx)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-sand-border bg-cream-surface/70 hover:bg-cream-surface transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-lg bg-forest text-cream flex items-center justify-center shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-xs sm:text-sm font-medium text-charcoal block">
                          {ing.name}
                        </span>
                        {ing.isProvidedIngredient && (
                          <span className="text-[10px] text-forest font-semibold uppercase">
                            Rescued from fridge
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-charcoal-muted shrink-0 pl-2">
                      {scaleAmount(ing.amount, scaleFactor)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Helpful Pantry Substitution Tip */}
          {recipe.substitutions && recipe.substitutions.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-sage/20 border border-sage/40 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-forest">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                <span>Quick Swaps before shopping:</span>
              </div>
              <ul className="space-y-1 text-charcoal-muted pl-4 list-disc text-[11px]">
                {recipe.substitutions.map((sub, i) => (
                  <li key={i}>
                    No <strong>{sub.original}</strong>? Use <strong>{sub.substitute}</strong> instead.
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-sand-border bg-cream-surface/80 flex items-center gap-2.5 print:hidden">
          <Button
            variant="outline"
            size="md"
            onClick={handleCopyList}
            className="flex-1 border-sand-border hover:bg-cream-card text-charcoal flex items-center justify-center gap-1.5 text-xs py-2.5"
          >
            <Copy className="w-3.5 h-3.5 text-charcoal-muted" />
            <span>Copy Text List</span>
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleShareList}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2.5 shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share / Send List</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
