import React, { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  Share2,
  Sparkles,
  Zap,
  Leaf,
  Plus,
  ArrowLeft,
  Clock,
  ChefHat,
  Heart,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Chip } from './ui/Chip';
import { Card, IngredientSlot, MatchBanner } from './ui/Card';

interface StyleGuideProps {
  onClose?: () => void;
}

export const StyleGuide: React.FC<StyleGuideProps> = ({ onClose }) => {
  const [activePreferences, setActivePreferences] = useState<string[]>([
    'quick',
    'vegetarian',
  ]);
  const [ingredients, setIngredients] = useState([
    { id: '1', name: 'Onion', emoji: '🧅' },
    { id: '2', name: 'Greek yogurt', emoji: '🥣' },
    { id: '3', name: 'Chickpeas', emoji: '🧆' },
  ]);
  const [saved, setSaved] = useState(false);

  const togglePreference = (id: string) => {
    setActivePreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const removeIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const resetIngredients = () => {
    setIngredients([
      { id: '1', name: 'Onion', emoji: '🧅' },
      { id: '2', name: 'Greek yogurt', emoji: '🥣' },
      { id: '3', name: 'Chickpeas', emoji: '🧆' },
    ]);
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal p-4 sm:p-8 lg:p-12 font-sans selection:bg-sage selection:text-forest">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="border-b border-sand-border pb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-forest">
              <div className="w-10 h-10 rounded-xl bg-forest text-cream flex items-center justify-center shadow-xs">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                Pantry Roulette
              </span>
            </div>
            {onClose && (
              <Button variant="outline" size="sm" onClick={onClose}>
                Back to App
              </Button>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-serif text-forest mt-4">
            Design System & Component Playground
          </h1>
          <p className="text-charcoal-muted text-sm sm:text-base mt-1">
            Prompt 1 Foundation: Theme tokens, two-typeface system, and core UI component primitives.
          </p>
        </header>

        {/* Section 1: Color Palette */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl sm:text-2xl text-forest font-semibold">
              1. Color Palette Tokens
            </h2>
            <span className="text-xs text-charcoal-subtle uppercase tracking-wider font-semibold">
              Tailwind Theme Tokens
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            <div className="bg-cream-card rounded-2xl border border-sand-border p-3 space-y-2 shadow-xs">
              <div className="h-16 rounded-xl bg-forest flex items-center justify-center text-cream font-mono text-xs font-semibold">
                #132A1E
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Forest Green</p>
                <p className="text-[11px] text-charcoal-muted">Primary / CTAs / Hero</p>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl border border-sand-border p-3 space-y-2 shadow-xs">
              <div className="h-16 rounded-xl bg-cream border border-sand-border flex items-center justify-center text-charcoal font-mono text-xs font-semibold">
                #FAF7F0
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Warm Cream</p>
                <p className="text-[11px] text-charcoal-muted">App Background</p>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl border border-sand-border p-3 space-y-2 shadow-xs">
              <div className="h-16 rounded-xl bg-sage flex items-center justify-center text-sage-dark font-mono text-xs font-semibold">
                #E3EDE4
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Soft Sage</p>
                <p className="text-[11px] text-charcoal-muted">Match / Badges / Pills</p>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl border border-sand-border p-3 space-y-2 shadow-xs">
              <div className="h-16 rounded-xl bg-terracotta flex items-center justify-center text-cream font-mono text-xs font-semibold">
                #D97043
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Muted Orange</p>
                <p className="text-[11px] text-charcoal-muted">Accents & Highlights</p>
              </div>
            </div>

            <div className="bg-cream-card rounded-2xl border border-sand-border p-3 space-y-2 shadow-xs">
              <div className="h-16 rounded-xl bg-charcoal flex items-center justify-center text-cream font-mono text-xs font-semibold">
                #1E2420
              </div>
              <div>
                <p className="text-xs font-bold text-charcoal">Charcoal</p>
                <p className="text-[11px] text-charcoal-muted">Primary High-contrast Text</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Two-Typeface System */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl sm:text-2xl text-forest font-semibold">
              2. Typography System
            </h2>
            <span className="text-xs text-charcoal-subtle uppercase tracking-wider font-semibold">
              Fraunces & Plus Jakarta Sans
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-cream-card rounded-2xl border border-sand-border p-5 space-y-3 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                Display Headings (Fraunces)
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-forest leading-tight">
                Turn random ingredients into real meals.
              </p>
              <p className="font-serif text-lg font-semibold text-charcoal">
                Creamy Chickpea & Onion Bowls
              </p>
              <p className="text-xs text-charcoal-muted font-mono">
                font-serif · 600-800 weight · headings & recipe titles
              </p>
            </div>

            <div className="bg-cream-card rounded-2xl border border-sand-border p-5 space-y-3 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                UI & Body (Plus Jakarta Sans)
              </span>
              <p className="text-sm sm:text-base font-normal text-charcoal leading-relaxed">
                Add 2 or 3 ingredients. Be as specific or vague as you want. Our recipe provider matches the best meal tailored to what you have.
              </p>
              <p className="text-xs font-semibold text-charcoal-muted">
                2 / 3 ingredients · 25 min · Easy · Vegetarian
              </p>
              <p className="text-xs text-charcoal-muted font-mono">
                font-sans · 400-600 weight · body, controls, metadata
              </p>
            </div>

            <div className="bg-cream-card rounded-2xl border border-sand-border p-5 space-y-3 shadow-xs">
              <span className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                Script Accents (Caveat)
              </span>
              <p className="font-script text-2xl text-terracotta leading-snug">
                &ldquo;Same ingredients. New possibilities.&rdquo;
              </p>
              <p className="font-script text-2xl text-forest leading-snug">
                &ldquo;Good food wastes nothing.&rdquo;
              </p>
              <p className="text-xs text-charcoal-muted font-mono">
                font-script · notes, handwritten quotes & callouts
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Buttons */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl sm:text-2xl text-forest font-semibold">
              3. Button Components
            </h2>
          </div>

          <div className="bg-cream-card rounded-2xl border border-sand-border p-6 shadow-xs space-y-6">
            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">
                Action Buttons
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size="lg">
                  Let&apos;s cook <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="primary" size="lg">
                  Spin the Pantry <Sparkles className="w-4 h-4 text-terracotta-light" />
                </Button>
                <Button variant="secondary" size="md">
                  View full recipe <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="md">
                  Go back and edit
                </Button>
                <Button variant="primary" size="md" disabled>
                  Disabled State
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">
                Dashed Add Control
              </p>
              <div className="max-w-sm">
                <Button variant="dashed" size="md">
                  <Plus className="w-4 h-4" />
                  Add another (max 3)
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-3">
                Icon Buttons
              </p>
              <div className="flex items-center gap-3">
                <Button variant="icon" size="md" aria-label="Go back">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="icon"
                  size="md"
                  aria-label="Save recipe"
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark
                    className={`w-4 h-4 ${saved ? 'fill-terracotta text-terracotta' : ''}`}
                  />
                </Button>
                <Button variant="icon" size="md" aria-label="Share recipe">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="icon" size="md" aria-label="Like recipe">
                  <Heart className="w-4 h-4 text-terracotta" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Chips */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl sm:text-2xl text-forest font-semibold">
              4. Chips, Badges & Indicators
            </h2>
          </div>

          <div className="bg-cream-card rounded-2xl border border-sand-border p-6 shadow-xs space-y-6">
            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
                Preference Chips
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  label="Quick (< 30 min)"
                  icon={<Zap className="w-3.5 h-3.5 text-sage-dark" />}
                  active={activePreferences.includes('quick')}
                  onClick={() => togglePreference('quick')}
                />
                <Chip
                  label="Vegetarian"
                  icon={<Leaf className="w-3.5 h-3.5 text-sage-dark" />}
                  active={activePreferences.includes('vegetarian')}
                  onClick={() => togglePreference('vegetarian')}
                />
                <Chip
                  label="Vegan"
                  active={activePreferences.includes('vegan')}
                  onClick={() => togglePreference('vegan')}
                />
                <Chip
                  label="Gluten-free"
                  active={activePreferences.includes('gluten-free')}
                  onClick={() => togglePreference('gluten-free')}
                />
                <Chip
                  label="Any"
                  active={activePreferences.includes('any')}
                  onClick={() => togglePreference('any')}
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider mb-2">
                Match & Status Badges
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  variant="match"
                  label="Perfect match"
                  icon={<Leaf className="w-3.5 h-3.5" />}
                />
                <Chip
                  variant="meta"
                  label="25 min"
                  icon={<Clock className="w-3.5 h-3.5" />}
                />
                <Chip
                  variant="meta"
                  label="Easy"
                  icon={<ChefHat className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Cards */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl sm:text-2xl text-forest font-semibold">
              5. Card Primitives & Slot Components
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-cream-surface/60 rounded-2xl border border-sand-border p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-forest text-base">
                    Ingredient Slot Primitives
                  </h3>
                  <p className="text-xs text-charcoal-muted">
                    {ingredients.length} / 3 ingredients selected
                  </p>
                </div>
                {ingredients.length < 3 && (
                  <button
                    onClick={resetIngredients}
                    className="text-xs text-forest font-semibold hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {ingredients.map((item) => (
                  <IngredientSlot
                    key={item.id}
                    name={item.name}
                    emoji={item.emoji}
                    onRemove={() => removeIngredient(item.id)}
                  />
                ))}

                {ingredients.length < 3 && (
                  <Button
                    variant="dashed"
                    size="md"
                    onClick={() =>
                      setIngredients((prev) => [
                        ...prev,
                        {
                          id: String(Date.now()),
                          name: 'Garlic',
                          emoji: '🧄',
                        },
                      ])
                    }
                  >
                    <Plus className="w-4 h-4" />
                    Add another (max 3)
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-cream-surface/60 rounded-2xl border border-sand-border p-5 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-forest text-base">
                  Match Banner & Recipe Card Stub
                </h3>
              </div>

              <MatchBanner
                text="Uses all your ingredients"
                subtext="Onion · Greek yogurt · Chickpeas"
              />

              <Card className="space-y-3">
                <div className="flex items-center justify-between">
                  <Chip
                    variant="match"
                    label="Perfect match"
                    icon={<Leaf className="w-3.5 h-3.5" />}
                  />
                  <span className="font-script text-lg text-charcoal-muted">
                    &ldquo;Your leftovers just leveled up.&rdquo;
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-lg font-bold text-forest">
                    Creamy Chickpea & Onion Bowls
                  </h4>
                  <p className="text-xs text-charcoal-muted mt-0.5">
                    Simple ingredients. Big flavors.
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Chip
                    variant="meta"
                    label="25 min"
                    icon={<Clock className="w-3.5 h-3.5" />}
                  />
                  <Chip
                    variant="meta"
                    label="Easy"
                    icon={<ChefHat className="w-3.5 h-3.5" />}
                  />
                  <Chip
                    variant="meta"
                    label="Vegetarian"
                    icon={<Leaf className="w-3.5 h-3.5" />}
                  />
                </div>

                <Button variant="primary" size="md" fullWidth className="mt-2">
                  View full recipe <ArrowRight className="w-4 h-4" />
                </Button>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
