import React from 'react';
import { ArrowRight, Sparkles, ChefHat, Dices } from 'lucide-react';
import { Button } from './ui/Button';
import { getRandomPantryCombination } from '../data/ingredients';
import { HeroSkilletVisual } from './CulinaryGraphics';

interface LandingPageProps {
  onStartCooking: (initialIngredients?: string[]) => void;
}

const EXAMPLE_PANTRY_ITEMS = [
  { name: 'Onion', emoji: '🧅' },
  { name: 'Chickpeas', emoji: '🧆' },
  { name: 'Greek yogurt', emoji: '🥣' },
  { name: 'Tomatoes', emoji: '🍅' },
  { name: 'Garlic', emoji: '🧄' },
  { name: 'Eggs', emoji: '🥚' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onStartCooking }) => {
  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-sage selection:text-forest">
      {/* Container constrained for mobile-first feel and elegant desktop centering */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between items-center text-center">
        {/* Top Branding */}
        <header className="space-y-2 pt-2 sm:pt-4">
          <div className="inline-flex items-center justify-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-forest text-cream flex items-center justify-center shadow-sm">
              <ChefHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-extrabold tracking-tight text-forest">
              Pantry Roulette
            </h1>
          </div>
          <p className="text-sm sm:text-base text-charcoal-muted max-w-xs mx-auto font-normal">
            Turn random ingredients into real meals.
          </p>
        </header>

        {/* Center Visual: The Skillet with Floating Ingredients (Screen 1 Spec) */}
        <div className="relative my-4 sm:my-6 w-full max-w-[340px] aspect-square flex items-center justify-center">
          {/* Handwritten script annotation matching the spec */}
          <div className="absolute -top-1 -right-2 sm:-right-6 z-20 transform rotate-3 pointer-events-none max-w-[140px] text-right">
            <p className="font-script text-2xl sm:text-3xl text-charcoal/85 leading-tight drop-shadow-2xs">
              Same ingredients.
              <br />
              <span className="text-terracotta">New possibilities.</span>
            </p>
            <svg
              className="w-8 h-8 text-charcoal/60 ml-auto transform -rotate-12 translate-y-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M19 5 C14 10, 8 12, 5 18 M5 18 L9 18 M5 18 L6 14" />
            </svg>
          </div>

          <HeroSkilletVisual />
        </div>

        {/* Ingredient Input Preview / Quick Inspiration */}
        <div className="w-full space-y-3 px-2">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-semibold text-charcoal-muted uppercase tracking-wider text-[11px]">
              Sample Pantry Staples
            </span>
            <span className="text-terracotta font-medium text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick start
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {EXAMPLE_PANTRY_ITEMS.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onStartCooking([item.name])}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-cream-card hover:bg-sage border border-sand-border text-charcoal shadow-xs hover:border-sage-dark/30 active:scale-95 transition-all cursor-pointer"
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom CTA & Tagline */}
        <div className="w-full pt-8 pb-4 space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => onStartCooking()}
            id="lets-cook-btn"
            className="text-base sm:text-lg py-4 shadow-md shadow-forest/20 group"
          >
            <span>Let&apos;s cook</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={() => {
              const combo = getRandomPantryCombination();
              onStartCooking(combo.map((c) => c.name));
            }}
            id="surprise-me-landing-btn"
            className="text-sm py-3 border-sand-border hover:border-forest/40 text-charcoal flex items-center justify-center gap-2"
          >
            <Dices className="w-4 h-4 text-terracotta" />
            <span>Surprise Me with random items</span>
          </Button>

          <p className="text-xs text-charcoal-subtle font-normal pt-1">
            A little creativity. A lot less food waste.
          </p>
        </div>
      </div>
    </div>
  );
};
