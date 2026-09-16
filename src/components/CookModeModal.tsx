import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Volume2,
  VolumeX,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Utensils,
  Sun,
  List,
} from 'lucide-react';
import { Recipe } from '../types';
import { playTimerChime } from '../utils/audioChime';
import { scaleAmount } from '../utils/amountScaler';

interface CookModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  servings: number;
}

function extractMinutes(text: string): number | null {
  const match = text.match(/(\d+)(?:-(\d+))?\s*(?:minutes|mins|min)\b/i);
  if (match) {
    if (match[2]) return parseInt(match[2], 10);
    return parseInt(match[1], 10);
  }
  return null;
}

export const CookModeModal: React.FC<CookModeModalProps> = ({
  isOpen,
  onClose,
  recipe,
  servings,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const [showIngredientsList, setShowIngredientsList] = useState(false);

  // Active step timer
  const [stepTimerSeconds, setStepTimerSeconds] = useState<number | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);

  const wakeLockRef = useRef<any>(null);

  // Scaling factor for ingredient amounts
  const scaleFactor = servings / (recipe.servings || 2);

  // Screen Wake Lock setup
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          if (isMounted) setWakeLockActive(true);
          wakeLockRef.current.addEventListener('release', () => {
            if (isMounted) setWakeLockActive(false);
          });
        }
      } catch {
        // WakeLock unsupported or rejected
      }
    };

    requestWakeLock();

    return () => {
      isMounted = false;
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // Handle step change: initialize timer if step has minutes
  useEffect(() => {
    if (!isOpen) return;
    const stepRaw = recipe.instructions[currentStepIdx];
    const stepText = typeof stepRaw === 'string' ? stepRaw : stepRaw?.instruction || '';
    const detectedMins = extractMinutes(stepText);
    if (detectedMins) {
      setStepTimerSeconds(detectedMins * 60);
      setTimerRunning(false);
    } else {
      setStepTimerSeconds(null);
      setTimerRunning(false);
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, [currentStepIdx, isOpen, recipe.instructions]);

  // Countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timerRunning && stepTimerSeconds !== null && stepTimerSeconds > 0) {
      interval = setInterval(() => {
        setStepTimerSeconds((prev) => {
          if (prev === null) return null;
          if (prev <= 1) {
            playTimerChime();
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, stepTimerSeconds]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentStepIdx < recipe.instructions.length) {
          setCurrentStepIdx((prev) => Math.min(recipe.instructions.length, prev + 1));
        }
      } else if (e.key === 'ArrowLeft') {
        setCurrentStepIdx((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIdx, recipe.instructions.length, onClose]);

  if (!isOpen) return null;

  const totalSteps = recipe.instructions.length;
  const isFinished = currentStepIdx >= totalSteps;
  const stepRaw = recipe.instructions[currentStepIdx];
  const currentStep = typeof stepRaw === 'string' ? stepRaw : stepRaw?.instruction || '';
  const currentStepTitle = typeof stepRaw === 'object' && stepRaw ? stepRaw.title : null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(
        `Step ${currentStepIdx + 1}. ${currentStep}`
      );
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E2621] text-[#FAF7F2] flex flex-col justify-between select-none animate-in fade-in duration-200">
      {/* Top Controls Bar */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-forest-light text-sage flex items-center justify-center">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-sage/70 uppercase tracking-widest block">
              Kitchen Cook Mode
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-base text-cream truncate max-w-[200px] sm:max-w-xs">
              {recipe.title}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {wakeLockActive && (
            <div
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest text-sage text-[11px] font-semibold border border-sage/20"
              title="Screen Wake Lock is keeping your screen on while cooking"
            >
              <Sun className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Screen On</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowIngredientsList(!showIngredientsList)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              showIngredientsList
                ? 'bg-terracotta text-cream border-terracotta'
                : 'bg-white/10 text-cream border-white/15 hover:bg-white/15'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingredients</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-cream transition-colors cursor-pointer"
            title="Exit Cook Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-white/10 h-1.5">
        <div
          className="bg-terracotta h-full transition-all duration-300"
          style={{
            width: `${((currentStepIdx + 1) / (totalSteps + 1)) * 100}%`,
          }}
        />
      </div>

      {/* Main Focus Area */}
      <div className="flex-1 overflow-y-auto p-6 sm:p-12 flex flex-col justify-center items-center max-w-2xl mx-auto w-full relative">
        {/* Ingredients Quick Reference Slide-Over */}
        {showIngredientsList && (
          <div className="absolute inset-4 z-20 bg-[#253029] rounded-3xl p-6 border border-white/15 shadow-2xl overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h4 className="font-serif font-bold text-base text-cream">
                  Ingredients ({servings} servings)
                </h4>
                <span className="text-xs text-sage/70">Scaled for your yield</span>
              </div>
              <button
                type="button"
                onClick={() => setShowIngredientsList(false)}
                className="p-1 rounded-full bg-white/10 text-cream hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {recipe.ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 border-b border-white/5 text-xs sm:text-sm"
                >
                  <span className={ing.isProvidedIngredient ? 'text-sage font-bold' : 'text-cream/90'}>
                    {ing.isProvidedIngredient ? '🥬 ' : '🧂 '}
                    {ing.name}
                  </span>
                  <span className="font-mono text-terracotta-light">
                    {scaleAmount(ing.amount, scaleFactor)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isFinished ? (
          <div className="w-full space-y-8 text-center sm:text-left">
            {/* Step Counter & TTS Button */}
            <div className="flex items-center justify-between">
              <span className="px-4 py-1.5 rounded-full bg-forest text-sage font-mono text-xs sm:text-sm font-bold tracking-wider border border-sage/30">
                STEP {currentStepIdx + 1} OF {totalSteps}
              </span>

              {'speechSynthesis' in window && (
                <button
                  type="button"
                  onClick={toggleSpeech}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSpeaking
                      ? 'bg-amber-400 text-charcoal border-amber-400 font-bold animate-pulse'
                      : 'bg-white/10 text-cream border-white/15 hover:bg-white/20'
                  }`}
                  title="Read step instructions aloud"
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSpeaking ? 'Stop Audio' : 'Read Aloud'}</span>
                </button>
              )}
            </div>

            {/* Instruction Body - Large Display Typography */}
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-cream font-medium leading-relaxed tracking-tight">
              {currentStep}
            </p>

            {/* Step-specific countdown timer card if detected */}
            {stepTimerSeconds !== null && (
              <div className="p-4 sm:p-5 rounded-3xl bg-[#28362D] border border-sage/20 flex items-center justify-between max-w-md mx-auto sm:mx-0 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-sage">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-mono text-sage/70 block">
                      Step Timer
                    </span>
                    <span className="text-2xl font-mono font-bold text-cream tracking-wider">
                      {formatTimer(stepTimerSeconds)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTimerRunning(!timerRunning)}
                    className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-light text-cream text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{timerRunning ? 'Pause' : 'Start'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const detectedMins = extractMinutes(currentStep);
                      setStepTimerSeconds((detectedMins || 5) * 60);
                      setTimerRunning(false);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-sage transition-colors cursor-pointer"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center space-y-5 py-8 animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-forest mx-auto flex items-center justify-center text-cream shadow-xl border border-sage/30">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-3xl sm:text-4xl font-extrabold text-cream">
                Bon Appétit!
              </h3>
              <p className="text-sm text-sage/80 max-w-sm mx-auto leading-relaxed">
                You&apos;ve completed every step of <strong>{recipe.title}</strong> and rescued delicious food from going to waste.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-terracotta text-cream font-bold hover:bg-terracotta-dark transition-all cursor-pointer text-sm shadow-md"
              >
                Done Cooking
              </button>

              <button
                type="button"
                onClick={() => setCurrentStepIdx(0)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 text-cream font-semibold hover:bg-white/20 transition-all cursor-pointer text-sm"
              >
                Review Steps Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls */}
      <div className="p-4 sm:p-6 border-t border-white/10 flex items-center justify-between bg-[#1A211D]">
        <button
          type="button"
          onClick={() => setCurrentStepIdx((prev) => Math.max(0, prev - 1))}
          disabled={currentStepIdx === 0}
          className={`flex items-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer ${
            currentStepIdx === 0
              ? 'opacity-30 cursor-not-allowed bg-transparent text-white/50'
              : 'bg-white/10 hover:bg-white/20 text-cream'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <span className="text-xs font-mono text-sage/60">
          Tip: Use Left/Right Arrow keys or Space
        </span>

        {!isFinished ? (
          <button
            type="button"
            onClick={() => setCurrentStepIdx((prev) => prev + 1)}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-forest text-cream hover:bg-forest-light transition-all cursor-pointer shadow-lg shadow-black/20"
          >
            <span>{currentStepIdx === totalSteps - 1 ? 'Finish' : 'Next Step'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold bg-terracotta text-cream hover:bg-terracotta-dark transition-all cursor-pointer shadow-lg"
          >
            <span>Finish</span>
          </button>
        )}
      </div>
    </div>
  );
};
