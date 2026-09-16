import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  Check,
  MoreHorizontal,
  ChefHat,
  Clock,
  Sparkles,
  Share2,
} from 'lucide-react';
import { Recipe } from '../types';
import { DishIllustration } from './DishIllustration';

interface ShareRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
}

export const ShareRecipeModal: React.FC<ShareRecipeModalProps> = ({
  isOpen,
  onClose,
  recipe,
}) => {
  const [copied, setCopied] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const appUrl = window.location.href;
  const ingredientsSummary = recipe.ingredients
    .filter((i) => i.isProvidedIngredient)
    .map((i) => i.name)
    .join(', ');

  const shareText = `🍳 Just turned random ingredients into "${recipe.title}" on Pantry Roulette!\nMade with: ${ingredientsSummary}\nCheck it out: ${appUrl}`;

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 2500);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      showToast('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast('Could not copy link');
    }
  };

  const handleShareX = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Turned leftover ingredients into ${recipe.title} with Pantry Roulette! 🥘✨`
    )}&url=${encodeURIComponent(appUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareInstagram = () => {
    // Copies story text & prompts user
    handleCopyLink();
    showToast('Recipe link copied for your Instagram Story or bio!');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
          url: appUrl,
        });
      } catch {
        // User dismissed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#112017]/90 backdrop-blur-md overflow-y-auto animate-fade-in"
    >
      <div className="relative w-full max-w-sm mx-auto flex flex-col items-center text-center space-y-5 my-auto">
        {/* Top bar with Close Button */}
        <div className="w-full flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="w-9 h-9 rounded-full bg-forest-light/80 text-cream/90 hover:text-cream hover:bg-forest flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Header */}
        <div className="space-y-1">
          <h2
            id="share-modal-title"
            className="font-serif text-2xl sm:text-3xl font-extrabold text-cream tracking-tight"
          >
            Recipe ready!
          </h2>
          <p className="text-xs sm:text-sm text-sage/80 max-w-xs mx-auto">
            Share your creation and inspire others to waste less.
          </p>
        </div>

        {/* Center Shareable Polaroid Card (Matching Screen 7) */}
        <div className="w-full bg-cream-card rounded-3xl p-5 shadow-2xl border border-sand-border/80 text-charcoal text-center space-y-3.5 transform transition-transform hover:scale-[1.01]">
          {/* Card Header: Brand */}
          <div className="flex items-center justify-center gap-1.5 text-forest">
            <ChefHat className="w-4 h-4 stroke-[2.5]" />
            <span className="font-serif font-bold text-xs tracking-tight uppercase">
              Pantry Roulette
            </span>
          </div>

          {/* Dish Visual with Leftovers Quote */}
          <div className="py-1">
            <DishIllustration
              size="md"
              showNote={true}
              noteText="Leftovers taste better together."
              noteRotation="-rotate-3"
            />
          </div>

          {/* Recipe Title */}
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-charcoal leading-snug">
              {recipe.title}
            </h3>

            {/* Meta tags */}
            <div className="flex items-center justify-center gap-3 text-xs text-charcoal-muted font-medium pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-forest" />
                {recipe.totalTimeMinutes} min
              </span>
              <span>•</span>
              <span className="capitalize">{recipe.difficulty}</span>
              {recipe.dietaryTags?.[0] && (
                <>
                  <span>•</span>
                  <span>{recipe.dietaryTags[0]}</span>
                </>
              )}
            </div>
          </div>

          {/* Made with footer badge */}
          <div className="bg-cream-surface/90 rounded-xl px-3 py-2 text-[11px] text-charcoal-muted font-medium border border-sand-border/60">
            <span className="font-semibold text-charcoal">Made with:</span>{' '}
            {ingredientsSummary || 'Pantry ingredients'}
          </div>
        </div>

        {/* Toast Feedback */}
        {feedbackMsg && (
          <div className="px-4 py-2 rounded-full bg-sage-dark text-cream text-xs font-semibold shadow-md flex items-center gap-1.5 animate-bounce">
            <Check className="w-3.5 h-3.5 text-sage" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Social Share Buttons Row (Matching Screen 7) */}
        <div className="w-full pt-2 flex items-center justify-center gap-3 sm:gap-4">
          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Copy link"
          >
            <div className="w-12 h-12 rounded-full bg-forest-light border border-sage/20 text-cream flex items-center justify-center group-hover:bg-forest transition-colors shadow-sm">
              {copied ? (
                <Check className="w-5 h-5 text-sage" />
              ) : (
                <LinkIcon className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] text-sage/80 font-medium">
              {copied ? 'Copied' : 'Copy link'}
            </span>
          </button>

          {/* Instagram */}
          <button
            type="button"
            onClick={handleShareInstagram}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Share to Instagram"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white flex items-center justify-center group-hover:opacity-90 transition-opacity shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <span className="text-[10px] text-sage/80 font-medium">Instagram</span>
          </button>

          {/* X / Twitter */}
          <button
            type="button"
            onClick={handleShareX}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Share to X (Twitter)"
          >
            <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center group-hover:bg-charcoal transition-colors shadow-sm">
              <span className="font-bold text-base">𝕏</span>
            </div>
            <span className="text-[10px] text-sage/80 font-medium">X (Twitter)</span>
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="Share on WhatsApp"
          >
            <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:opacity-90 transition-opacity shadow-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <span className="text-[10px] text-sage/80 font-medium">WhatsApp</span>
          </button>

          {/* Native / More */}
          <button
            type="button"
            onClick={handleNativeShare}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="More options"
          >
            <div className="w-12 h-12 rounded-full bg-forest-light border border-sage/20 text-cream flex items-center justify-center group-hover:bg-forest transition-colors shadow-sm">
              <MoreHorizontal className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-sage/80 font-medium">More</span>
          </button>
        </div>
      </div>
    </div>
  );
};
