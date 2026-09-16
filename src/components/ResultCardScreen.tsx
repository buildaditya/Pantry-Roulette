import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Flame,
  Leaf,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Recipe } from '../types';
import { isRecipeSaved, saveRecipe, removeSavedRecipe } from '../utils/recipeStorage';
import { DishIllustration } from './DishIllustration';
import { ShareRecipeModal } from './ShareRecipeModal';

interface ResultCardScreenProps {
  recipe: Recipe;
  onViewFullRecipe: () => void;
  onSpinAgain: () => void;
  onBackToEdit: () => void;
  onOpenSavedDrawer?: () => void;
}

export const ResultCardScreen: React.FC<ResultCardScreenProps> = ({
  recipe,
  onViewFullRecipe,
  onSpinAgain,
  onBackToEdit,
  onOpenSavedDrawer,
}) => {
  const [saved, setSaved] = useState(() => isRecipeSaved(recipe.id));
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    setSaved(isRecipeSaved(recipe.id));
  }, [recipe.id]);

  const toggleSave = () => {
    if (saved) {
      removeSavedRecipe(recipe.id);
      setSaved(false);
    } else {
      saveRecipe(recipe);
      setSaved(true);
    }
  };

  const providedIngredients = recipe.ingredients.filter((i) => i.isProvidedIngredient);
  const providedNames = providedIngredients.map((i) => i.name).join(' • ');

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between items-center px-4 py-6 sm:py-10 selection:bg-sage selection:text-forest">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between space-y-5">
        {/* Top Navigation Bar (Matching Screen 4 Mockup) */}
        <div>
          <div className="flex items-center justify-between pb-2">
            <Button
              variant="icon"
              size="md"
              onClick={onBackToEdit}
              aria-label="Back to ingredient entry"
              id="result-back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-charcoal" />
            </Button>

            <div className="flex items-center gap-2">
              {onOpenSavedDrawer && (
                <button
                  type="button"
                  onClick={onOpenSavedDrawer}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-card text-charcoal border border-sand-border hover:bg-cream-surface transition-colors cursor-pointer"
                >
                  My Recipes
                </button>
              )}
              <button
                type="button"
                onClick={toggleSave}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  saved
                    ? 'bg-terracotta text-cream border-terracotta shadow-xs'
                    : 'bg-cream-card text-charcoal border-sand-border hover:bg-cream-surface'
                }`}
                title={saved ? 'Saved in cookbook' : 'Save to cookbook'}
                aria-label={saved ? 'Saved in cookbook' : 'Save to cookbook'}
              >
                <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="p-2 rounded-full border border-sand-border bg-cream-card text-charcoal hover:bg-cream-surface transition-all cursor-pointer"
                title="Share recipe"
                aria-label="Share recipe"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Perfect Match Pill Badge (Screen 4) */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF4EE] border border-[#D5E7DB] text-forest text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-forest" />
              <span>Perfect match</span>
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="space-y-1 pt-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal leading-tight">
              {recipe.title}
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
              {recipe.subtitle || 'Simple ingredients. Big flavors.'}
            </p>
          </div>
        </div>

        {/* Center Food Photography / Visual with Handwritten Callout */}
        <div className="py-1 sm:py-2 flex items-center justify-center">
          <DishIllustration
            size="lg"
            showNote={true}
            noteText="Your leftovers just leveled up."
            noteRotation="rotate-3"
          />
        </div>

        {/* Meta Chips Row (25 min | Easy | Vegetarian) */}
        <div className="flex items-center justify-center gap-4 text-xs font-medium text-charcoal-muted">
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-charcoal-muted" />
            <span>{recipe.totalTimeMinutes} min</span>
          </span>
          <span className="text-charcoal-subtle">•</span>
          <span className="flex items-center gap-1.5 capitalize">
            <Flame className="w-4 h-4 text-charcoal-muted" />
            <span>{recipe.difficulty}</span>
          </span>
          {recipe.dietaryTags?.[0] && (
            <>
              <span className="text-charcoal-subtle">•</span>
              <span className="flex items-center gap-1.5">
                <Leaf className="w-4 h-4 text-forest" />
                <span>{recipe.dietaryTags[0]}</span>
              </span>
            </>
          )}
        </div>

        {/* Uses all your ingredients - Green Card Banner (Screen 4) */}
        <div className="bg-[#EBF3ED] rounded-2xl border border-[#D0E2D6] p-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-forest text-cream flex items-center justify-center shrink-0 shadow-2xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-charcoal block">
                Uses all your ingredients
              </span>
              <span className="text-[11px] text-charcoal-muted line-clamp-1">
                {providedNames || 'Your pantry selection'}
              </span>
            </div>
          </div>
          <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 text-forest" />
          </div>
        </div>

        {/* Action Buttons (Screen 4) */}
        <div className="space-y-2 pt-1 pb-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onViewFullRecipe}
            id="view-full-recipe-btn"
            className="text-base sm:text-lg py-4 shadow-md shadow-forest/20 group cursor-pointer"
          >
            <span>View full recipe</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <button
            type="button"
            onClick={onSpinAgain}
            id="spin-again-subtle-btn"
            className="w-full text-center text-xs font-medium text-charcoal-muted hover:text-charcoal transition-colors py-1.5 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-terracotta" />
            <span>Not feeling this? Spin for another recipe</span>
          </button>
        </div>
      </div>

      {/* Share Recipe Modal (Screen 7) */}
      <ShareRecipeModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        recipe={recipe}
      />
    </div>
  );
};
