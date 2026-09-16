import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  X,
  Clock,
  Flame,
  Leaf,
  CheckCircle2,
  Bookmark,
  Share2,
  Printer,
  Play,
  Pause,
  RotateCcw as ResetIcon,
  ShoppingCart,
  ChefHat,
  Users,
  Check,
  Sparkles,
  ArrowRight,
  Info,
  ListOrdered,
  Lightbulb,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Recipe } from '../types';
import { isRecipeSaved, saveRecipe, removeSavedRecipe } from '../utils/recipeStorage';
import { KitchenPrepChecklistModal } from './KitchenPrepChecklistModal';
import { CookModeModal } from './CookModeModal';
import { ShareRecipeModal } from './ShareRecipeModal';
import { StepThumbnail } from './StepThumbnail';
import { scaleAmount } from '../utils/amountScaler';
import { playTimerChime } from '../utils/audioChime';

interface FullRecipeScreenProps {
  recipe: Recipe;
  onBack: () => void;
  onSpinAgain: () => void;
  onOpenSavedDrawer?: () => void;
}

type RecipeTab = 'overview' | 'ingredients' | 'steps' | 'tips';

export const FullRecipeScreen: React.FC<FullRecipeScreenProps> = ({
  recipe,
  onBack,
  onSpinAgain,
  onOpenSavedDrawer,
}) => {
  const [activeTab, setActiveTab] = useState<RecipeTab>('overview');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [saved, setSaved] = useState(() => isRecipeSaved(recipe.id));
  const [copied, setCopied] = useState(false);
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isCookModeOpen, setIsCookModeOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [servings, setServings] = useState<number>(recipe.servings || 2);

  const baseServings = recipe.servings || 2;
  const scaleFactor = servings / baseServings;

  // Active cooking timer state
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStepIndex, setTimerStepIndex] = useState<number | null>(null);

  useEffect(() => {
    setSaved(isRecipeSaved(recipe.id));
    setServings(recipe.servings || 2);
  }, [recipe.id, recipe.servings]);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev !== null && prev <= 1) {
            playTimerChime();
            setTimerRunning(false);
            return 0;
          }
          return prev !== null ? prev - 1 : 0;
        });
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const toggleIngredient = (id: string) => {
    setCheckedIngredients((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleSave = () => {
    if (saved) {
      removeSavedRecipe(recipe.id);
      setSaved(false);
    } else {
      saveRecipe(recipe);
      setSaved(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const startStepTimer = (stepIdx: number, mins: number) => {
    setTimerStepIndex(stepIdx);
    setTimerSeconds(mins * 60);
    setTimerRunning(true);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const providedIngredients = recipe.ingredients.filter((i) => i.isProvidedIngredient);
  const stapleIngredients = recipe.ingredients.filter((i) => !i.isProvidedIngredient);
  const providedNames = providedIngredients.map((i) => i.name).join(' • ');

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between items-center px-4 py-6 sm:py-10 selection:bg-sage selection:text-forest print:bg-white print:p-0">
      <div className="w-full max-w-md mx-auto flex-1 space-y-4">
        {/* Top Navigation Bar (Matching Screen 5 & Screen 6 Mockup) */}
        <div className="flex items-center justify-between pb-1 print:hidden">
          <Button
            variant="icon"
            size="md"
            onClick={onBack}
            aria-label="Back to overview"
            id="full-recipe-back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsCookModeOpen(true)}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold bg-forest text-cream border border-forest hover:bg-forest-light transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Enter Fullscreen Hands-Free Kitchen Cook Mode"
            >
              <ChefHat className="w-3.5 h-3.5 text-sage" />
              <span className="hidden sm:inline">Cook Mode</span>
            </button>

            <button
              type="button"
              onClick={toggleSave}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                saved
                  ? 'bg-terracotta text-cream border-terracotta'
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

            {/* Screen 5 & 6 Close X Button */}
            <Button
              variant="icon"
              size="md"
              onClick={onBack}
              aria-label="Close full recipe"
              id="full-recipe-close-btn"
              className="text-charcoal-muted hover:text-charcoal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Recipe Title (Matching Screen 5 & Screen 6) */}
        <div className="space-y-1">
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-charcoal leading-tight">
            {recipe.title}
          </h1>
        </div>

        {/* 4 Tabs Row (Overview | Ingredients | Steps | Tips) - Screen 5 & 6 */}
        <div className="flex items-center border-b border-sand-border/80 gap-6 text-sm font-semibold text-charcoal-muted pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'overview'
                ? 'text-charcoal font-bold border-b-2 border-charcoal -mb-[1px]'
                : 'hover:text-charcoal'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ingredients')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'ingredients'
                ? 'text-charcoal font-bold border-b-2 border-charcoal -mb-[1px]'
                : 'hover:text-charcoal'
            }`}
          >
            Ingredients
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'steps'
                ? 'text-charcoal font-bold border-b-2 border-charcoal -mb-[1px]'
                : 'hover:text-charcoal'
            }`}
          >
            Steps
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tips')}
            className={`pb-2.5 transition-colors relative cursor-pointer ${
              activeTab === 'tips'
                ? 'text-charcoal font-bold border-b-2 border-charcoal -mb-[1px]'
                : 'hover:text-charcoal'
            }`}
          >
            Tips
          </button>
        </div>

        {/* TAB 1: OVERVIEW (Screen 5 Mockup) */}
        {activeTab === 'overview' && (
          <div className="space-y-4 pt-1 animate-fade-in">
            {/* About this dish */}
            <div className="space-y-1.5">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                About this dish
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* Meta row (25 min | Easy | Vegetarian) */}
            <div className="flex items-center gap-4 text-xs font-medium text-charcoal-muted py-1 border-y border-sand-border/60">
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

            {/* Green match card: Uses all your ingredients */}
            <div className="bg-[#EBF3ED] rounded-2xl border border-[#D0E2D6] p-3.5 flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-forest text-cream flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-charcoal block">
                    Uses all your ingredients
                  </span>
                  <span className="text-[11px] text-charcoal-muted">
                    {providedNames}
                  </span>
                </div>
              </div>
              <div className="w-5 h-5 rounded-full bg-forest/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-forest" />
              </div>
            </div>

            {/* What you'll need section (Screen 5) */}
            <div className="space-y-3 pt-1">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                What you&apos;ll need
              </h2>

              {/* Your ingredients */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-charcoal-muted block">
                  Your ingredients ({providedIngredients.length})
                </span>
                <div className="space-y-2">
                  {providedIngredients.map((ing, idx) => {
                    const uniqueKey = ing.id || `provided-${ing.name || 'item'}-${idx}`;
                    return (
                      <div
                        key={uniqueKey}
                        className="bg-cream-card rounded-2xl border border-sand-border/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{ing.emoji || '🧅'}</span>
                          <span className="text-xs sm:text-sm font-semibold text-charcoal">
                            {ing.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-charcoal-muted">
                            {scaleAmount(ing.amount, scaleFactor)}
                          </span>
                          <Check className="w-4 h-4 text-forest" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pantry staples */}
              {stapleIngredients.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-charcoal-muted block">
                    Pantry staples (likely have these)
                  </span>
                  <div className="space-y-1.5">
                    {stapleIngredients.map((ing, idx) => {
                      const uniqueKey = ing.id || `staple-${ing.name || 'item'}-${idx}`;
                      return (
                        <div
                          key={uniqueKey}
                          className="bg-cream-card/70 rounded-xl border border-sand-border/60 px-3 py-2 flex items-center justify-between text-xs text-charcoal"
                        >
                          <div className="flex items-center gap-2">
                            <span>{ing.emoji || '🫒'}</span>
                            <span>{ing.name}</span>
                          </div>
                          <span className="font-mono text-charcoal-muted text-[11px]">
                            {scaleAmount(ing.amount, scaleFactor)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Button to Start Cooking Steps */}
            <div className="pt-2 pb-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setActiveTab('steps')}
                className="py-3.5 text-sm sm:text-base shadow-sm group"
              >
                <span>View Cooking Steps</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {/* TAB 2: INGREDIENTS (Detailed checklist + serving scaler) */}
        {activeTab === 'ingredients' && (
          <div className="space-y-4 pt-1 animate-fade-in">
            {/* Yield / Serving Scaler */}
            <div className="bg-cream-card rounded-2xl border border-sand-border p-3.5 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-xs font-bold text-charcoal block">
                  Servings & Portions
                </span>
                <span className="text-[11px] text-charcoal-muted">
                  Quantities auto-scale with yield
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.max(1, s - 1))}
                  className="w-7 h-7 rounded-full bg-cream-surface border border-sand-border flex items-center justify-center text-sm font-bold text-charcoal hover:bg-sand-border/40 transition-colors cursor-pointer"
                  title="Decrease servings"
                >
                  -
                </button>
                <span className="text-sm font-bold text-charcoal min-w-[28px] text-center flex items-center justify-center gap-1">
                  <Users className="w-3.5 h-3.5 text-forest" />
                  {servings}
                </span>
                <button
                  type="button"
                  onClick={() => setServings((s) => Math.min(12, s + 1))}
                  className="w-7 h-7 rounded-full bg-cream-surface border border-sand-border flex items-center justify-center text-sm font-bold text-charcoal hover:bg-sand-border/40 transition-colors cursor-pointer"
                  title="Increase servings"
                >
                  +
                </button>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-charcoal-muted px-1">
                <span>Tap to check off as you prep</span>
                <button
                  type="button"
                  onClick={() => setIsPrepModalOpen(true)}
                  className="text-terracotta hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ShoppingCart className="w-3 h-3" />
                  <span>Shopping list</span>
                </button>
              </div>

              <div className="space-y-2">
                {recipe.ingredients.map((ing, idx) => {
                  const ingKey = ing.id || `ing-${idx}-${ing.name || 'item'}`;
                  const isChecked = !!checkedIngredients[ingKey];
                  return (
                    <button
                      key={ingKey}
                      type="button"
                      onClick={() => toggleIngredient(ingKey)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-sage-light/60 border-sage text-charcoal-subtle line-through'
                          : 'bg-cream-card border-sand-border text-charcoal hover:border-forest/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                            isChecked
                              ? 'bg-forest border-forest text-cream'
                              : 'border-sand-border bg-cream-surface'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">
                          {ing.name}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-charcoal-muted">
                        {scaleAmount(ing.amount, scaleFactor)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STEPS (Screen 6 Mockup) */}
        {activeTab === 'steps' && (
          <div className="space-y-4 pt-1 animate-fade-in">
            {/* Active Step Timer if running */}
            {timerSeconds !== null && (
              <div className="p-3 bg-forest text-cream rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${
                      timerRunning ? 'bg-terracotta animate-pulse' : 'bg-sage/40'
                    }`}
                  />
                  <div>
                    <span className="text-xs font-medium text-sage/80 block">
                      Step {timerStepIndex !== null ? timerStepIndex + 1 : ''} Timer
                    </span>
                    <span className="text-lg font-mono font-bold">
                      {formatTimer(timerSeconds)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimerRunning((r) => !r)}
                    className="p-2 rounded-full bg-forest-light hover:bg-forest-dark border border-sage/20 cursor-pointer"
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTimerRunning(false);
                      setTimerSeconds(null);
                    }}
                    className="p-2 rounded-full bg-forest-light hover:bg-forest-dark border border-sage/20 cursor-pointer"
                  >
                    <ResetIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step list with number badges & thumbnails (Matching Screen 6) */}
            <div className="space-y-3">
              {recipe.instructions.map((step, idx) => {
                const isCompleted = !!completedSteps[idx];
                const stepText = typeof step === 'string' ? step : step.instruction;
                const stepTitle =
                  typeof step === 'string'
                    ? `Step ${idx + 1}`
                    : step.title || `Step ${idx + 1}`;
                const matchMins = stepText.match(/(\d+)\s*(?:-|to)?\s*(\d+)?\s*min/i);
                const stepMins = matchMins ? parseInt(matchMins[1], 10) : null;

                return (
                  <div
                    key={`recipe-step-item-${idx}`}
                    className={`bg-cream-card rounded-2xl border transition-all p-3.5 flex items-start gap-3 shadow-2xs ${
                      isCompleted ? 'border-sage/80 opacity-70' : 'border-sand-border'
                    }`}
                  >
                    {/* Step Number Circle Badge (Screen 6) */}
                    <div className="w-6 h-6 rounded-full bg-charcoal text-cream flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>

                    {/* Step Thumbnail (Screen 6) */}
                    <StepThumbnail stepIndex={idx} title={stepTitle} />

                    {/* Step Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="font-serif text-sm font-bold text-charcoal">
                          {stepTitle}
                        </h3>
                        {stepMins && (
                          <button
                            type="button"
                            onClick={() => startStepTimer(idx, stepMins)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-terracotta/15 text-terracotta hover:bg-terracotta/25 transition-colors cursor-pointer shrink-0"
                            title={`Start ${stepMins}m countdown`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{stepMins}m timer</span>
                          </button>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                        {stepText}
                      </p>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className={`text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                            isCompleted ? 'text-forest font-semibold' : 'text-charcoal-subtle hover:text-charcoal'
                          }`}
                        >
                          <Check className={`w-3 h-3 ${isCompleted ? 'text-forest' : ''}`} />
                          <span>{isCompleted ? 'Step completed' : 'Mark as done'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Cook Mode Launcher */}
            <div className="pt-2 pb-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => setIsCookModeOpen(true)}
                className="py-3.5 text-sm sm:text-base shadow-sm flex items-center justify-center gap-2"
              >
                <ChefHat className="w-4 h-4 text-sage" />
                <span>Launch Hands-Free Cook Mode</span>
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: TIPS (Culinary secrets & zero-waste advice) */}
        {activeTab === 'tips' && (
          <div className="space-y-3 pt-1 animate-fade-in">
            {/* Zero Waste Impact Note */}
            {recipe.wasteSavedNote && (
              <div className="bg-sage-light border border-sage rounded-2xl p-4 space-y-1.5">
                <div className="flex items-center gap-1.5 text-forest font-bold text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Zero Food Waste Impact</span>
                </div>
                <p className="text-xs sm:text-sm text-forest-dark leading-relaxed">
                  {recipe.wasteSavedNote}
                </p>
              </div>
            )}

            {/* Chef Secrets */}
            <div className="bg-cream-card rounded-2xl border border-sand-border p-4 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-charcoal font-bold text-xs">
                <Lightbulb className="w-4 h-4 text-terracotta" />
                <span>Chef&apos;s Pro Tip</span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                {recipe.chefTip ||
                  'Let the chickpeas sit in the warm pan for 2 minutes after turning off the heat — the residual cast-iron heat locks in an irresistible crunch without burning the spices!'}
              </p>
            </div>

            {/* Substitutions */}
            <div className="bg-cream-card rounded-2xl border border-sand-border p-4 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-charcoal font-bold text-xs">
                <Info className="w-4 h-4 text-forest" />
                <span>Flexible Pantry Substitutions</span>
              </div>
              <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
                No Greek yogurt? Sour cream, coconut cream, or a drizzle of tahini with lemon juice works wonders. If you have stale pita or bread, toast it in the same pan for crunchy croutons!
              </p>
            </div>
          </div>
        )}

        {/* Modals */}
        <KitchenPrepChecklistModal
          isOpen={isPrepModalOpen}
          onClose={() => setIsPrepModalOpen(false)}
          recipe={recipe}
          servings={servings}
        />

        <CookModeModal
          isOpen={isCookModeOpen}
          onClose={() => setIsCookModeOpen(false)}
          recipe={recipe}
          servings={servings}
        />

        <ShareRecipeModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          recipe={recipe}
        />
      </div>
    </div>
  );
};
