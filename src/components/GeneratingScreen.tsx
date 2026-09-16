import React, { useEffect, useState, useRef } from 'react';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/Button';
import { IngredientSubmission } from './IngredientEntryScreen';
import { Recipe, GenerateRecipeResponse } from '../types';
import {
  SlicedRedOnion,
  GreekYogurtBowl,
  RoastedChickpeas,
  ParsleySprig,
} from './CulinaryGraphics';

interface GeneratingScreenProps {
  submission: IngredientSubmission;
  onRecipeReady: (recipe: Recipe) => void;
  onNoResults?: () => void;
  onCancel: () => void;
}

export const GeneratingScreen: React.FC<GeneratingScreenProps> = ({
  submission,
  onRecipeReady,
  onNoResults,
  onCancel,
}) => {
  const [progress, setProgress] = useState(18);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Smooth simulated progress bar (moves towards 92% while waiting)
  useEffect(() => {
    if (error) return;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 90) {
          return prev + Math.floor(Math.random() * 6) + 3;
        }
        return prev;
      });
    }, 450);

    return () => clearInterval(progressInterval);
  }, [error]);

  const fetchRecipe = async () => {
    setError(null);
    setIsRetrying(true);
    setProgress(20);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const payload = {
        ingredients: submission.ingredients.map((i) => i.name),
        preferences: submission.preferences,
      };

      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.message || errJson?.error || `Server returned ${response.status}`);
      }

      const data: GenerateRecipeResponse = await response.json();

      if (!data.recipe) {
        if (onNoResults) {
          onNoResults();
          return;
        }
        throw new Error('No recipe returned from culinary engine.');
      }

      setProgress(100);
      // Brief completion pause for smooth feel
      setTimeout(() => {
        onRecipeReady(data.recipe);
      }, 400);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('[GeneratingScreen] Generation error:', err);
      setError(err instanceof Error ? err.message : 'Unable to find matching recipe right now.');
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    fetchRecipe();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleCancelClick = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    onCancel();
  };

  return (
    <div className="min-h-screen bg-[#132219] text-cream flex flex-col justify-between items-center px-4 py-6 sm:py-10 selection:bg-sage selection:text-forest">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between items-center text-center">
        {/* Top Header */}
        <div className="w-full flex items-center justify-start pb-2">
          <Button
            variant="icon"
            size="md"
            onClick={handleCancelClick}
            aria-label="Cancel and go back"
            className="bg-[#1b3325] text-cream border-[#284835] hover:bg-[#234330]"
          >
            <ArrowLeft className="w-5 h-5 text-cream" />
          </Button>
        </div>

        {/* Center Content (Matching Screen 3 Mockup) */}
        <div className="w-full my-auto flex flex-col items-center justify-center space-y-8 py-4">
          {!error ? (
            <>
              {/* Floating Ingredients Composition with Sketch Motion Lines */}
              <div className="relative w-64 h-56 flex items-center justify-center select-none">
                {/* Motion swirl sketch lines */}
                <svg
                  viewBox="0 0 240 200"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M60 40 C75 25, 95 35, 85 55 C78 70, 55 65, 52 50"
                    stroke="#E3EDE4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />
                  <path
                    d="M175 45 C190 60, 185 85, 165 90 C150 95, 140 80, 150 70"
                    stroke="#E3EDE4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />
                  <path
                    d="M110 120 C130 140, 160 135, 155 115"
                    stroke="#E3EDE4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray="3 3"
                    opacity="0.5"
                  />
                  {/* Little motion stars */}
                  <path d="M125 35 L129 35 M127 33 L127 37" stroke="#E3EDE4" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M45 105 L49 105 M47 103 L47 107" stroke="#E3EDE4" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M195 130 L199 130 M197 128 L197 132" stroke="#E3EDE4" strokeWidth="1.5" strokeLinecap="round" />
                </svg>

                {/* Red Onion Slice (top left) */}
                <div className="absolute top-2 left-6 transform -rotate-12 animate-bounce [animation-duration:3.2s]">
                  <SlicedRedOnion size={74} />
                </div>

                {/* Greek Yogurt bowl (top right) */}
                <div className="absolute top-3 right-6 transform rotate-8 animate-pulse [animation-duration:2.8s]">
                  <GreekYogurtBowl size={70} />
                </div>

                {/* Roasted Chickpeas (floating cluster center-right) */}
                <div className="absolute top-28 right-12 transform -rotate-6 animate-bounce [animation-duration:2.6s]">
                  <RoastedChickpeas size={52} />
                </div>
                <div className="absolute top-36 right-24 transform rotate-20">
                  <RoastedChickpeas size={36} />
                </div>

                {/* Fresh Parsley Leaves */}
                <div className="absolute bottom-4 left-10 transform rotate-45 animate-pulse [animation-duration:3.6s]">
                  <ParsleySprig size={46} />
                </div>
                <div className="absolute top-16 left-26 transform -rotate-30">
                  <ParsleySprig size={34} />
                </div>
              </div>

              {/* Headings */}
              <div className="space-y-2">
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream tracking-tight">
                  Cooking up something good...
                </h2>
                <p className="text-sm text-sage/80 font-normal">
                  Finding the best recipe with your ingredients
                </p>
              </div>

              {/* Handwritten Quote matching Screen 3 */}
              <p className="font-script text-2xl sm:text-3xl text-cream/90 pt-2">
                &ldquo;Good food wastes nothing.&rdquo;
              </p>
            </>
          ) : (
            /* Error Fallback Card */
            <div className="bg-[#1f3729] border border-terracotta/40 rounded-3xl p-6 space-y-4 w-full text-center">
              <div className="w-12 h-12 rounded-full bg-terracotta/20 text-terracotta flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-bold text-cream">
                Couldn&apos;t generate recipe
              </h3>
              <p className="text-xs sm:text-sm text-sage/80 leading-relaxed">
                {error}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelClick}
                  className="border-sage/30 text-cream hover:bg-forest-light"
                >
                  Go Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isRetrying}
                  onClick={fetchRecipe}
                  className="gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                  <span>Try Again</span>
                </Button>
                {onNoResults && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNoResults}
                    className="text-sage hover:text-cream text-xs"
                  >
                    View Tips
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Horizontal Progress Bar (Matching Screen 3) */}
        <div className="w-full max-w-xs mx-auto pb-4">
          <div className="w-full h-1 bg-[#1b3325] rounded-full overflow-hidden">
            <div
              className="h-full bg-cream rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
