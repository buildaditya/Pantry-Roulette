import React from 'react';
import { ArrowLeft, Sparkles, ChefHat } from 'lucide-react';
import { Button } from './ui/Button';
import { IngredientSubmission } from './IngredientEntryScreen';

interface GeneratingScreenStubProps {
  submission: IngredientSubmission;
  onBack: () => void;
}

export const GeneratingScreenStub: React.FC<GeneratingScreenStubProps> = ({
  submission,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-forest text-cream flex flex-col justify-between items-center px-4 py-8 sm:py-12 selection:bg-sage selection:text-forest">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between items-center text-center">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between pb-4">
          <Button
            variant="icon"
            size="md"
            onClick={onBack}
            aria-label="Back to ingredient entry"
            className="bg-forest-light text-cream border-forest-light/60 hover:bg-forest-dark"
          >
            <ArrowLeft className="w-5 h-5 text-cream" />
          </Button>
          <span className="text-xs font-semibold text-sage/80">
            Prompt 3 Verified · Ready for Prompt 4 Backend
          </span>
        </div>

        {/* Center state stub */}
        <div className="space-y-6 my-auto py-8">
          <div className="w-16 h-16 rounded-3xl bg-forest-light text-sage flex items-center justify-center mx-auto shadow-inner">
            <ChefHat className="w-9 h-9 stroke-[2]" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-cream">
              Cooking up something good...
            </h2>
            <p className="text-sm text-sage/80 max-w-xs mx-auto">
              Ready to hand off to the recipe generation backend.
            </p>
          </div>

          {/* Submitted payload summary */}
          <div className="bg-forest-light/60 rounded-2xl border border-forest-light p-4 text-left space-y-3">
            <span className="text-[11px] font-semibold text-sage/70 uppercase tracking-wider">
              Validated Ingredients ({submission.ingredients.length})
            </span>
            <div className="flex flex-wrap gap-2">
              {submission.ingredients.map((ing) => (
                <span
                  key={ing.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest text-xs font-medium text-cream border border-forest-light"
                >
                  <span>{ing.emoji}</span>
                  <span>{ing.name}</span>
                </span>
              ))}
            </div>

            {submission.preferences.length > 0 && (
              <div className="pt-2 border-t border-forest-light/40">
                <span className="text-[11px] font-semibold text-sage/70 uppercase tracking-wider block mb-1">
                  Preferences
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {submission.preferences.map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 rounded-full bg-sage/20 text-[11px] font-medium text-sage capitalize"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="font-script text-2xl text-sage/90">
            &ldquo;Good food wastes nothing.&rdquo;
          </p>
        </div>

        {/* Back control */}
        <div className="w-full pt-6">
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={onBack}
            className="text-cream border-forest-light hover:bg-forest-light"
          >
            ← Modify Ingredients
          </Button>
        </div>
      </div>
    </div>
  );
};
