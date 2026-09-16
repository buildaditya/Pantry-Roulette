import React, { useState, useEffect } from 'react';
import { X, Clock, Trash2, ArrowRight, BookOpen, Sparkles, Leaf } from 'lucide-react';
import { Recipe } from '../types';
import {
  getSavedRecipes,
  removeSavedRecipe,
  calculateZeroWasteImpact,
  SavedRecipeEntry,
  ZeroWasteImpact,
} from '../utils/recipeStorage';
import { Button } from './ui/Button';

interface SavedRecipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRecipe: (recipe: Recipe) => void;
}

export const SavedRecipesModal: React.FC<SavedRecipesModalProps> = ({
  isOpen,
  onClose,
  onSelectRecipe,
}) => {
  const [savedEntries, setSavedEntries] = useState<SavedRecipeEntry[]>([]);
  const [impact, setImpact] = useState<ZeroWasteImpact>({
    totalRecipesSaved: 0,
    totalIngredientsRescued: 0,
    estimatedFoodKgSaved: 0,
    co2SavedKg: 0,
  });

  const refreshList = () => {
    setSavedEntries(getSavedRecipes());
    setImpact(calculateZeroWasteImpact());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeSavedRecipe(id);
    refreshList();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-cream-card w-full max-w-md rounded-3xl border border-sand-border shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-sand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-forest" />
            <h2 className="font-serif text-lg font-bold text-charcoal">
              Cookbook & Saved ({savedEntries.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-cream-surface text-charcoal-muted hover:text-charcoal cursor-pointer"
            aria-label="Close saved recipes"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zero-Waste Impact Bar */}
        {impact.totalRecipesSaved > 0 && (
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-sage/30 border border-sage-dark/20 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-forest text-cream flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-forest block">
                  {impact.totalIngredientsRescued} pantry items rescued
                </span>
                <span className="text-[11px] text-charcoal-muted">
                  ~{impact.estimatedFoodKgSaved} kg food saved from waste
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-forest bg-cream-card px-2 py-1 rounded-full border border-sand-border">
              -{impact.co2SavedKg}kg CO₂e
            </span>
          </div>
        )}

        {/* Recipe List */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {savedEntries.length === 0 ? (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-semibold text-charcoal">
                No recipes saved yet
              </p>
              <p className="text-xs text-charcoal-muted max-w-xs mx-auto">
                Whenever you spin up a recipe you love, click the bookmark icon to save it for later.
              </p>
            </div>
          ) : (
            savedEntries.map(({ recipe, savedAt }, idx) => (
              <div
                key={recipe.id || `saved-${recipe.title}-${idx}`}
                onClick={() => {
                  onSelectRecipe(recipe);
                  onClose();
                }}
                className="p-3.5 rounded-2xl border border-sand-border bg-cream-surface hover:border-forest/40 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-base font-bold text-charcoal group-hover:text-forest transition-colors">
                    {recipe.title}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, recipe.id)}
                    className="text-charcoal-subtle hover:text-terracotta p-1 rounded transition-colors"
                    title="Remove from saved"
                    aria-label="Remove recipe"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-charcoal-muted line-clamp-2">
                  {recipe.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-charcoal-subtle pt-1 border-t border-sand-border/50">
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-forest" />
                    {recipe.totalTimeMinutes}m • {recipe.difficulty}
                  </span>
                  <span className="text-forest font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                    View Recipe <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-cream-surface border-t border-sand-border flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
