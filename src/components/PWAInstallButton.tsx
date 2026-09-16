import React, { useState } from 'react';
import { Download, Share, X, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone PWA, suppress
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Chromium / Android / Desktop button */}
      {isInstallable && (
        <button
          type="button"
          onClick={install}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-forest text-cream border border-forest/80 shadow-xs hover:bg-forest-light transition-all cursor-pointer select-none active:scale-95"
          title="Install Pantry Roulette as an App"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      )}

      {/* iOS Safari button */}
      {isIOS && (
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-cream-card/90 backdrop-blur-xs text-charcoal border border-sand-border shadow-xs hover:bg-cream-surface transition-colors cursor-pointer select-none"
          title="Add to Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5 text-forest" />
          <span>Install</span>
        </button>
      )}

      {/* iOS Installation Instructions Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-cream-card rounded-3xl max-w-sm w-full p-6 border border-sand-border shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-charcoal">
                  Install on iOS
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1.5 rounded-full hover:bg-sand-light text-charcoal-muted transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-charcoal-muted leading-relaxed">
              Install Pantry Roulette on your iPhone or iPad for fast, full-screen, offline-ready kitchen access without the browser address bar:
            </p>

            <ol className="space-y-2.5 text-xs text-charcoal">
              <li className="flex items-start gap-2.5 bg-cream-surface/70 p-2.5 rounded-xl border border-sand-border">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Tap the <strong className="text-forest">Share</strong> button{' '}
                  <Share className="w-3.5 h-3.5 inline mx-0.5 text-forest" /> at the bottom of Safari.
                </span>
              </li>
              <li className="flex items-start gap-2.5 bg-cream-surface/70 p-2.5 rounded-xl border border-sand-border">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Scroll down and tap <strong className="text-forest">Add to Home Screen</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2.5 bg-cream-surface/70 p-2.5 rounded-xl border border-sand-border">
                <span className="w-5 h-5 rounded-full bg-forest/10 text-forest font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Tap <strong className="text-forest">Add</strong> in the top right corner.
                </span>
              </li>
            </ol>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-xl bg-forest text-cream text-xs font-semibold hover:bg-forest-light transition-colors cursor-pointer text-center"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
