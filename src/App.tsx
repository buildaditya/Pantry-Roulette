import { useState } from 'react';
import {
  Palette,
  BookMarked,
  Layers,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { LandingPage } from './components/LandingPage';
import {
  IngredientEntryScreen,
  IngredientSubmission,
} from './components/IngredientEntryScreen';
import { GeneratingScreen } from './components/GeneratingScreen';
import { ResultCardScreen } from './components/ResultCardScreen';
import { FullRecipeScreen } from './components/FullRecipeScreen';
import { NoResultsScreen } from './components/NoResultsScreen';
import { StyleGuide } from './components/StyleGuide';
import { SavedRecipesModal } from './components/SavedRecipesModal';
import { PWAInstallButton } from './components/PWAInstallButton';
import { Recipe } from './types';

export type ScreenState =
  | 'landing'
  | 'ingredient-entry'
  | 'generating'
  | 'result-card'
  | 'full-recipe'
  | 'no-results'
  | 'styleguide';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('landing');
  const [starterIngredients, setStarterIngredients] = useState<string[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<IngredientSubmission | null>(null);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isPreviewToolbarOpen, setIsPreviewToolbarOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  const handleStartCooking = (initialIngredients?: string[]) => {
    if (initialIngredients && initialIngredients.length > 0) {
      setStarterIngredients(initialIngredients);
    } else {
      setStarterIngredients([]);
    }
    setCurrentScreen('ingredient-entry');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  const handleSpinPantry = (submission: IngredientSubmission) => {
    setCurrentSubmission(submission);
    setCurrentScreen('generating');
  };

  const handleRecipeReady = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setCurrentScreen('result-card');
  };

  const handleBackToEntry = () => {
    setCurrentScreen('ingredient-entry');
  };

  const handleViewFullRecipe = () => {
    setCurrentScreen('full-recipe');
  };

  const handleBackToResultCard = () => {
    setCurrentScreen('result-card');
  };

  const handleSpinAgain = () => {
    if (currentSubmission) {
      setCurrentScreen('generating');
    } else {
      setCurrentScreen('ingredient-entry');
    }
  };

  const handleSelectSavedRecipe = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
    setCurrentScreen('full-recipe');
  };

  const jumpToScreen = (target: ScreenState) => {
    if (target === 'result-card' || target === 'full-recipe') {
      if (!currentRecipe) {
        import('./data/recipes').then(({ getSampleRecipe }) => {
          setCurrentRecipe(getSampleRecipe(['onion', 'greek yogurt', 'chickpeas']));
        });
      }
    }
    if (target === 'generating' && !currentSubmission) {
      setCurrentSubmission({
        ingredients: [
          { id: '1', name: 'Onion', emoji: '🧅' },
          { id: '2', name: 'Greek yogurt', emoji: '🥣' },
          { id: '3', name: 'Chickpeas', emoji: '🧆' },
        ],
        preferences: ['quick', 'vegetarian'],
      });
    }
    setCurrentScreen(target);
    setIsPreviewToolbarOpen(false);
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'styleguide':
        return <StyleGuide onClose={() => setCurrentScreen('landing')} />;
      case 'landing':
        return <LandingPage onStartCooking={handleStartCooking} />;
      case 'ingredient-entry':
        return (
          <IngredientEntryScreen
            initialIngredients={starterIngredients}
            onBack={handleBackToLanding}
            onSpin={handleSpinPantry}
          />
        );
      case 'generating':
        return (
          currentSubmission && (
            <GeneratingScreen
              submission={currentSubmission}
              onRecipeReady={handleRecipeReady}
              onNoResults={() => setCurrentScreen('no-results')}
              onCancel={handleBackToEntry}
            />
          )
        );
      case 'no-results':
        return (
          <NoResultsScreen
            onBackToEdit={handleBackToEntry}
            searchedIngredients={currentSubmission?.ingredients.map((i) => i.name)}
          />
        );
      case 'result-card':
        return (
          currentRecipe && (
            <ResultCardScreen
              recipe={currentRecipe}
              onViewFullRecipe={handleViewFullRecipe}
              onSpinAgain={handleSpinAgain}
              onBackToEdit={handleBackToEntry}
              onOpenSavedDrawer={() => setIsSavedModalOpen(true)}
            />
          )
        );
      case 'full-recipe':
        return (
          currentRecipe && (
            <FullRecipeScreen
              recipe={currentRecipe}
              onBack={handleBackToResultCard}
              onSpinAgain={handleSpinAgain}
              onOpenSavedDrawer={() => setIsSavedModalOpen(true)}
            />
          )
        );
      default:
        return <LandingPage onStartCooking={handleStartCooking} />;
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F4EFE6] selection:bg-sage selection:text-forest">
      {/* Phone Frame Wrapper (Optional on desktop, toggled via dev pill) */}
      {isPhoneFrame ? (
        <div className="min-h-screen py-6 sm:py-10 px-2 sm:px-4 flex items-center justify-center bg-[#E5DFD4]">
          <div className="w-full max-w-[430px] min-h-[844px] bg-cream rounded-[44px] border-[10px] border-[#222B24] shadow-2xl overflow-hidden relative flex flex-col">
            {/* Status Bar simulation */}
            <div className="h-9 px-6 bg-transparent flex items-center justify-between text-[11px] font-bold text-charcoal/75 shrink-0 select-none z-30">
              <span>9:41</span>
              <div className="w-24 h-4 bg-charcoal/90 rounded-full mx-auto" />
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <div className="w-4 h-2 border border-charcoal/70 rounded-xs p-0.5">
                  <div className="w-full h-full bg-charcoal/70" />
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">{renderActiveScreen()}</div>
          </div>
        </div>
      ) : (
        renderActiveScreen()
      )}

      {/* Floating Collapsible Preview Toolbar (Offset at bottom right, out of primary CTA path) */}
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex flex-col items-end">
        {isPreviewToolbarOpen && (
          <div className="mb-2 p-3 bg-cream-card/95 backdrop-blur-md rounded-2xl border border-sand-border shadow-xl w-64 text-left space-y-2 animate-fade-in text-charcoal">
            <div className="flex items-center justify-between pb-1 border-b border-sand-border/70">
              <span className="text-xs font-bold text-charcoal flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-forest" />
                <span>Screen Navigator</span>
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewToolbarOpen(false)}
                className="text-xs text-charcoal-muted hover:text-charcoal p-1"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1 text-xs">
              <button
                type="button"
                onClick={() => jumpToScreen('landing')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'landing'
                    ? 'bg-forest text-cream font-bold'
                    : 'hover:bg-cream-surface'
                }`}
              >
                1. Landing Page
              </button>
              <button
                type="button"
                onClick={() => jumpToScreen('ingredient-entry')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'ingredient-entry'
                    ? 'bg-forest text-cream font-bold'
                    : 'hover:bg-cream-surface'
                }`}
              >
                2. Ingredient Entry
              </button>
              <button
                type="button"
                onClick={() => jumpToScreen('generating')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'generating'
                    ? 'bg-forest text-cream font-bold'
                    : 'hover:bg-cream-surface'
                }`}
              >
                3. Generating Animation
              </button>
              <button
                type="button"
                onClick={() => jumpToScreen('result-card')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'result-card'
                    ? 'bg-forest text-cream font-bold'
                    : 'hover:bg-cream-surface'
                }`}
              >
                4. Perfect Match Card
              </button>
              <button
                type="button"
                onClick={() => jumpToScreen('full-recipe')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'full-recipe'
                    ? 'bg-forest text-cream font-bold'
                    : 'hover:bg-cream-surface'
                }`}
              >
                5-6. Recipe Tabs (Overview, Steps)
              </button>
              <button
                type="button"
                onClick={() => jumpToScreen('no-results')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  currentScreen === 'no-results'
                    ? 'bg-forest text-cream font-bold'
                    : 'hover:bg-cream-surface'
                }`}
              >
                8. No Results Empty State
              </button>
            </div>

            <div className="pt-2 border-t border-sand-border/70 flex items-center justify-between gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => {
                  setIsSavedModalOpen(true);
                  setIsPreviewToolbarOpen(false);
                }}
                className="flex items-center gap-1 text-charcoal hover:text-forest font-medium cursor-pointer"
              >
                <BookMarked className="w-3 h-3 text-forest" />
                <span>Cookbook</span>
              </button>

              <button
                type="button"
                onClick={() => jumpToScreen('styleguide')}
                className="flex items-center gap-1 text-charcoal hover:text-terracotta font-medium cursor-pointer"
              >
                <Palette className="w-3 h-3 text-terracotta" />
                <span>Design Tokens</span>
              </button>

              <button
                type="button"
                onClick={() => setIsPhoneFrame((prev) => !prev)}
                className={`flex items-center gap-1 font-medium cursor-pointer ${
                  isPhoneFrame ? 'text-forest font-bold' : 'text-charcoal-muted'
                }`}
                title="Toggle Mobile Bezel Frame (Desktop view)"
              >
                <Smartphone className="w-3 h-3" />
                <span>Frame</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <PWAInstallButton />

          <button
            type="button"
            onClick={() => setIsPreviewToolbarOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-card/90 backdrop-blur-md text-charcoal border border-sand-border shadow-md hover:bg-cream-surface transition-all cursor-pointer"
            aria-label="Toggle preview navigator"
          >
            <Layers className="w-3.5 h-3.5 text-forest" />
            <span className="capitalize hidden sm:inline">
              Screen: {currentScreen.replace('-', ' ')}
            </span>
            <span className="sm:hidden">Screens</span>
            {isPreviewToolbarOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Saved Recipes Modal */}
      <SavedRecipesModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        onSelectRecipe={handleSelectSavedRecipe}
      />
    </main>
  );
}
