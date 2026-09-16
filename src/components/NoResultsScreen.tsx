import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

interface NoResultsScreenProps {
  onBackToEdit: () => void;
  searchedIngredients?: string[];
}

export const NoResultsScreen: React.FC<NoResultsScreenProps> = ({
  onBackToEdit,
  searchedIngredients = [],
}) => {
  return (
    <div className="min-h-screen bg-cream text-charcoal flex flex-col justify-between items-center px-4 py-6 sm:py-10 selection:bg-sage selection:text-forest">
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between text-center space-y-6">
        {/* Top bar with back navigation */}
        <div className="w-full flex items-center justify-start">
          <Button
            variant="icon"
            size="md"
            onClick={onBackToEdit}
            aria-label="Go back and edit ingredients"
            id="no-results-back-btn"
          >
            <ArrowLeft className="w-5 h-5 text-charcoal" />
          </Button>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-charcoal tracking-tight">
            No results found
          </h1>
        </div>

        {/* Fridge Vector Illustration (Matching Screen 8 Mockup) */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center my-1">
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full drop-shadow-sm"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Floor shadow */}
            <ellipse cx="120" cy="215" rx="85" ry="12" fill="#E6DFD1" />

            {/* Refrigerator Body Outer */}
            <rect
              x="60"
              y="45"
              width="90"
              height="155"
              rx="12"
              fill="#F4EFE6"
              stroke="#2E3830"
              strokeWidth="2.5"
            />

            {/* Top Freezer Divider Line */}
            <line
              x1="60"
              y1="95"
              x2="150"
              y2="95"
              stroke="#2E3830"
              strokeWidth="2"
            />

            {/* Shelves inside fridge */}
            <line
              x1="65"
              y1="130"
              x2="145"
              y2="130"
              stroke="#D8D0C2"
              strokeWidth="2"
              strokeDasharray="3 3"
            />
            <line
              x1="65"
              y1="165"
              x2="145"
              y2="165"
              stroke="#D8D0C2"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Jar / Bottle on shelf */}
            <rect
              x="75"
              y="110"
              width="14"
              height="18"
              rx="3"
              fill="#E18E66"
              stroke="#2E3830"
              strokeWidth="1.5"
            />
            <rect
              x="96"
              y="114"
              width="10"
              height="14"
              rx="2"
              fill="#6B9D78"
              stroke="#2E3830"
              strokeWidth="1.5"
            />

            {/* Crisp drawer */}
            <rect
              x="68"
              y="172"
              width="74"
              height="22"
              rx="4"
              fill="#E9E2D4"
              stroke="#2E3830"
              strokeWidth="1.5"
            />

            {/* Open Fridge Door Swung Out to the Right */}
            <path
              d="M150 48 L195 65 L195 200 L150 198 Z"
              fill="#FFFFFF"
              stroke="#2E3830"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Door handle */}
            <rect
              x="185"
              y="105"
              width="4"
              height="25"
              rx="2"
              fill="#2E3830"
            />

            {/* Vegetable on the Counter / Floor beside fridge */}
            {/* Cabbage / Lettuce head */}
            <circle cx="48" cy="195" r="16" fill="#75A682" stroke="#2E3830" strokeWidth="2" />
            <path
              d="M40 188 C45 182, 55 185, 58 192"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M42 198 C48 202, 54 200, 56 195"
              stroke="#FFFFFF"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Red Onion */}
            <circle cx="178" cy="195" r="13" fill="#B34B68" stroke="#2E3830" strokeWidth="2" />
            <path
              d="M178 182 L180 176"
              stroke="#2E3830"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="178" cy="195" r="8" fill="#C96582" opacity="0.6" />

            {/* Scattered Carrot & Herbs */}
            <path
              d="M152 208 L170 216"
              stroke="#E8743B"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M148 206 L144 204"
              stroke="#4E8C5C"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Sparkles / Little playful sketch stars */}
            <path
              d="M35 155 L40 155 M37.5 152 L37.5 158"
              stroke="#8E9791"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M210 120 L216 120 M213 117 L213 123"
              stroke="#8E9791"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Subtext */}
        <p className="text-sm sm:text-base text-charcoal-muted max-w-xs mx-auto">
          We couldn&apos;t find a good match with those ingredients
          {searchedIngredients.length > 0 && (
            <span className="font-semibold text-charcoal">
              {' '}({searchedIngredients.join(', ')})
            </span>
          )}
          .
        </p>

        {/* Checklist: "Try these instead:" */}
        <div className="bg-cream-card rounded-3xl border border-sand-border/80 p-5 text-left space-y-3 shadow-2xs">
          <h2 className="text-xs font-bold text-charcoal-muted uppercase tracking-wider">
            Try these instead:
          </h2>

          <div className="space-y-2.5 text-xs sm:text-sm text-charcoal">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <span>Use more common ingredient names (e.g. &ldquo;onion&rdquo; instead of &ldquo;red onion&rdquo;)</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <span>Try a different combination</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-forest shrink-0 mt-0.5" />
              <span>Check for typos</span>
            </div>
          </div>
        </div>

        {/* Action Button & Handwritten Footer */}
        <div className="space-y-4 pt-2 pb-4">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={onBackToEdit}
            id="no-results-go-back-btn"
            className="text-base py-4 shadow-md shadow-forest/20"
          >
            Go back and edit
          </Button>

          <p className="font-script text-xl sm:text-2xl text-charcoal-muted leading-tight">
            Every ingredient has potential. Keep experimenting! ♡
          </p>
        </div>
      </div>
    </div>
  );
};
