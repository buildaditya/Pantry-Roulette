import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Plus, Sparkles, Zap, Leaf, AlertCircle, Search, Dices } from 'lucide-react';
import { Button } from './ui/Button';
import { Chip } from './ui/Chip';
import { IngredientSlot } from './ui/Card';
import {
  COMMON_INGREDIENTS,
  SuggestedIngredient,
  getEmojiForIngredient,
  getRandomPantryCombination,
} from '../data/ingredients';

export interface IngredientSubmission {
  ingredients: Array<{ id: string; name: string; emoji: string }>;
  preferences: string[];
}

interface IngredientEntryScreenProps {
  initialIngredients?: string[];
  onBack: () => void;
  onSpin: (data: IngredientSubmission) => void;
}

type IngredientCategory = 'all' | 'produce' | 'dairy' | 'protein' | 'grain' | 'canned';

const CATEGORIES: Array<{ id: IngredientCategory; label: string; icon: string }> = [
  { id: 'all', label: 'All', icon: '✨' },
  { id: 'produce', label: 'Produce', icon: '🥬' },
  { id: 'dairy', label: 'Dairy & Eggs', icon: '🧀' },
  { id: 'protein', label: 'Protein', icon: '🍗' },
  { id: 'grain', label: 'Grains', icon: '🍚' },
  { id: 'canned', label: 'Canned', icon: '🥫' },
];

export const IngredientEntryScreen: React.FC<IngredientEntryScreenProps> = ({
  initialIngredients = [],
  onBack,
  onSpin,
}) => {
  // Slots state (2 to 3 ingredients)
  const [ingredients, setIngredients] = useState<
    Array<{ id: string; name: string; emoji: string }>
  >(() => {
    if (initialIngredients.length > 0) {
      return initialIngredients.slice(0, 3).map((name, index) => ({
        id: `init-${index}-${Date.now()}`,
        name: name.trim(),
        emoji: getEmojiForIngredient(name),
      }));
    }
    // Default demo starter matching the spec UI: Onion, Greek yogurt, Chickpeas
    return [
      { id: 'item-1', name: 'Onion', emoji: '🧅' },
      { id: 'item-2', name: 'Greek yogurt', emoji: '🥣' },
      { id: 'item-3', name: 'Chickpeas', emoji: '🧆' },
    ];
  });

  // Modal / input drawer for adding ingredients
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // Dietary preferences state
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    'quick',
    'vegetarian',
  ]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  // Clear validation error after 4 seconds
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

  const togglePreference = (id: string) => {
    setSelectedPreferences((prev) => {
      if (id === 'any') {
        return prev.includes('any') ? [] : ['any'];
      }
      const filtered = prev.filter((p) => p !== 'any');
      return filtered.includes(id)
        ? filtered.filter((p) => p !== id)
        : [...filtered, id];
    });
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
    setValidationError(null);
  };

  const addIngredient = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) {
      setValidationError('Please enter an ingredient name.');
      return;
    }

    if (ingredients.length >= 3) {
      setValidationError('You can add up to 3 ingredients only.');
      setIsAdding(false);
      return;
    }

    // Check duplicate
    const isDuplicate = ingredients.some(
      (item) => item.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setValidationError(`"${trimmed}" is already in your pantry.`);
      return;
    }

    const newEmoji = getEmojiForIngredient(trimmed);
    setIngredients((prev) => [
      ...prev,
      {
        id: `ing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: trimmed,
        emoji: newEmoji,
      },
    ]);

    setSearchQuery('');
    setIsAdding(false);
    setValidationError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient(searchQuery);
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setSearchQuery('');
    }
  };

  const handleSurpriseMe = () => {
    setIsRolling(true);
    setValidationError(null);

    setTimeout(() => {
      const randomItems = getRandomPantryCombination();
      setIngredients(
        randomItems.map((item, idx) => ({
          id: `roulette-${idx}-${Date.now()}`,
          name: item.name,
          emoji: item.emoji,
        }))
      );
      setIsRolling(false);
    }, 350);
  };

  const handleSpinClick = () => {
    // Validate count: must be between 2 and 3
    if (ingredients.length < 2) {
      setValidationError('Please add at least 2 ingredients to spin the pantry.');
      return;
    }
    if (ingredients.length > 3) {
      setValidationError('Maximum 3 ingredients allowed.');
      return;
    }

    onSpin({
      ingredients,
      preferences: selectedPreferences,
    });
  };

  // Filter suggestions by active category tray and search query
  const filteredSuggestions = COMMON_INGREDIENTS.filter((item) => {
    const isChosen = ingredients.some(
      (chosen) => chosen.name.toLowerCase() === item.name.toLowerCase()
    );
    if (isChosen) return false;

    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }

    if (!searchQuery) return true;
    return item.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
  }).slice(0, 8);

  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between items-center px-4 py-6 sm:py-10 selection:bg-sage selection:text-forest">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between space-y-6">
        {/* Top Bar Navigation & Counter */}
        <div>
          <div className="flex items-center justify-between pb-4">
            <Button
              variant="icon"
              size="md"
              onClick={onBack}
              aria-label="Back to previous screen"
              id="back-btn"
            >
              <ArrowLeft className="w-5 h-5 text-charcoal" />
            </Button>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSurpriseMe}
                disabled={isRolling}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-terracotta/10 hover:bg-terracotta/20 text-terracotta border border-terracotta/20 transition-all cursor-pointer select-none active:scale-95"
                title="Randomize ingredients with a surprise combination"
              >
                <Dices className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Surprise</span>
              </button>

              <span className="text-xs sm:text-sm font-semibold text-charcoal-muted font-sans">
                {ingredients.length} / 3 ingredients
              </span>
            </div>
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-1.5 pt-1">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-charcoal">
              What do you have in your fridge?
            </h1>
            <p className="text-sm text-charcoal-muted leading-relaxed">
              Add 2 or 3 ingredients. Be as specific or vague as you want.
            </p>
          </div>
        </div>

        {/* Validation Notice Banner */}
        {validationError && (
          <div className="flex items-center gap-2 p-3 bg-terracotta-light text-terracotta border border-terracotta/30 rounded-2xl text-xs font-semibold animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Section: Ingredient Slots */}
        <div className="space-y-3">
          <div className="space-y-2.5">
            {ingredients.map((item) => (
              <IngredientSlot
                key={item.id}
                name={item.name}
                emoji={item.emoji}
                onRemove={() => removeIngredient(item.id)}
              />
            ))}
          </div>

          {/* Add Another Slot Button (Max 3) */}
          {ingredients.length < 3 && !isAdding && (
            <Button
              variant="dashed"
              size="md"
              onClick={() => {
                setIsAdding(true);
                setValidationError(null);
              }}
              id="add-ingredient-btn"
              className="py-4"
            >
              <Plus className="w-4 h-4 text-charcoal-muted" />
              <span>Add another (max 3)</span>
            </Button>
          )}

          {/* Inline Add / Search Card with Category Trays */}
          {isAdding && (
            <div className="bg-cream-card rounded-2xl border-2 border-forest/40 p-4 shadow-sm space-y-3">
              <div className="flex items-center gap-2 bg-cream-surface/70 px-3 py-2 rounded-xl border border-sand-border">
                <Search className="w-4 h-4 text-charcoal-subtle shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Tomatoes, Garlic, Pasta..."
                  className="w-full bg-transparent text-sm text-charcoal focus:outline-none placeholder:text-charcoal-subtle"
                  maxLength={40}
                  id="ingredient-search-input"
                />
              </div>

              {/* Category Trays Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-forest text-cream border-forest'
                        : 'bg-cream-surface text-charcoal-muted border-sand-border hover:bg-cream-card'
                    }`}
                  >
                    <span className="mr-1">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Picks from Category Tray */}
              {filteredSuggestions.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                    <span>Quick picks</span>
                    <span className="text-charcoal-subtle lowercase">
                      {filteredSuggestions.length} available
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {filteredSuggestions.map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => addIngredient(item.name)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-cream-surface hover:bg-sage border border-sand-border text-charcoal cursor-pointer active:scale-95 transition-all"
                      >
                        <span>{item.emoji}</span>
                        <span>{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm / Cancel row */}
              <div className="flex items-center justify-end gap-2 pt-1 border-t border-sand-border/60">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAdding(false);
                    setSearchQuery('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!searchQuery.trim()}
                  onClick={() => addIngredient(searchQuery)}
                >
                  Add Ingredient
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Optional Preferences Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
              Optional preferences
            </h2>
            {selectedPreferences.length > 0 && (
              <button
                type="button"
                onClick={() => setSelectedPreferences([])}
                className="text-[11px] text-charcoal-subtle hover:text-charcoal cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Chip
              label="Quick (< 30 min)"
              icon={<Zap className="w-3.5 h-3.5 text-sage-dark" />}
              active={selectedPreferences.includes('quick')}
              onClick={() => togglePreference('quick')}
            />
            <Chip
              label="Vegetarian"
              icon={<Leaf className="w-3.5 h-3.5 text-sage-dark" />}
              active={selectedPreferences.includes('vegetarian')}
              onClick={() => togglePreference('vegetarian')}
            />
            <Chip
              label="Vegan"
              active={selectedPreferences.includes('vegan')}
              onClick={() => togglePreference('vegan')}
            />
            <Chip
              label="Gluten-free"
              active={selectedPreferences.includes('gluten-free')}
              onClick={() => togglePreference('gluten-free')}
            />
            <Chip
              label="Any"
              active={selectedPreferences.includes('any')}
              onClick={() => togglePreference('any')}
            />
          </div>
        </div>

        {/* Bottom Spin CTA */}
        <div className="pt-4 pb-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSpinClick}
            disabled={ingredients.length < 2 || ingredients.length > 3}
            id="spin-the-pantry-btn"
            className="text-base sm:text-lg py-4 shadow-md shadow-forest/20 group"
          >
            <span>Spin the Pantry</span>
            <Sparkles className="w-4 h-4 text-terracotta-light group-hover:rotate-12 transition-transform" />
          </Button>

          {ingredients.length < 2 && (
            <p className="text-center text-xs text-charcoal-subtle mt-2">
              Add at least {2 - ingredients.length} more ingredient to spin
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
