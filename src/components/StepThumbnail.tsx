import React from 'react';

interface StepThumbnailProps {
  stepIndex: number;
  title: string;
}

export const StepThumbnail: React.FC<StepThumbnailProps> = ({ stepIndex, title }) => {
  // SVG vector illustration per step
  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-cream-surface border border-sand-border/80 flex items-center justify-center shrink-0 shadow-2xs select-none">
      {stepIndex === 0 && (
        /* Step 1: Slicing / Caramelizing Onions in pan */
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          <rect width="80" height="80" fill="#243028" />
          {/* Pan rim */}
          <circle cx="40" cy="40" r="34" stroke="#48564E" strokeWidth="4" />
          {/* Olive oil base */}
          <circle cx="40" cy="40" r="30" fill="#2E3B33" />
          <ellipse cx="40" cy="40" rx="26" ry="24" fill="#695D28" opacity="0.3" />
          {/* Golden caramelized onion strands */}
          <path
            d="M22 36 C30 25, 45 28, 56 38"
            stroke="#C97834"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M26 48 C36 38, 48 42, 58 52"
            stroke="#9C5221"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 28 C42 22, 52 32, 54 44"
            stroke="#E08B42"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M20 44 C28 54, 42 56, 50 48"
            stroke="#B8662B"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}

      {stepIndex === 1 && (
        /* Step 2: Crisping Chickpeas in skillet */
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          <rect width="80" height="80" fill="#222C25" />
          <circle cx="40" cy="40" r="34" stroke="#45544B" strokeWidth="4" />
          <circle cx="40" cy="40" r="30" fill="#2A362D" />
          {/* Chickpeas */}
          <circle cx="28" cy="34" r="6" fill="#ECA642" />
          <circle cx="42" cy="30" r="6.5" fill="#D98E32" />
          <circle cx="54" cy="38" r="5.5" fill="#ECA642" />
          <circle cx="34" cy="46" r="6.5" fill="#F2B452" />
          <circle cx="48" cy="48" r="6" fill="#C97F28" />
          <circle cx="26" cy="48" r="5" fill="#BA7320" />
          {/* Paprika specks */}
          <circle cx="32" cy="30" r="1" fill="#A83218" />
          <circle cx="45" cy="44" r="1.2" fill="#A83218" />
          <circle cx="50" cy="34" r="1" fill="#A83218" />
        </svg>
      )}

      {stepIndex === 2 && (
        /* Step 3: Greek yogurt sauce in ramekin */
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          <rect width="80" height="80" fill="#EAE5D9" />
          {/* Ceramic bowl */}
          <circle cx="40" cy="40" r="30" fill="#544337" />
          {/* Creamy yogurt filling */}
          <circle cx="40" cy="40" r="26" fill="#FFFFFF" />
          {/* Swirl shadow */}
          <path
            d="M30 38 C35 32, 48 34, 46 44 C44 50, 36 48, 35 42"
            stroke="#EDE6D8"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Olive oil drop & herbs */}
          <circle cx="42" cy="38" r="2.5" fill="#D4AF37" opacity="0.8" />
          <path
            d="M36 36 C34 33, 31 34, 32 37 Z"
            fill="#387A49"
          />
          <path
            d="M45 44 C47 42, 49 43, 48 46 Z"
            fill="#387A49"
          />
          <circle cx="42" cy="45" r="0.8" fill="#387A49" />
        </svg>
      )}

      {stepIndex >= 3 && (
        /* Step 4+: Plated dish assembly */
        <svg viewBox="0 0 80 80" className="w-full h-full" fill="none">
          <rect width="80" height="80" fill="#DFD7C7" />
          <circle cx="40" cy="40" r="32" fill="#423023" />
          {/* Flatbread */}
          <path d="M52 22 C64 32, 62 48, 54 58 Z" fill="#E2C799" />
          {/* Onions */}
          <path d="M26 30 C34 24, 44 26, 48 32" stroke="#A75A24" strokeWidth="2.5" strokeLinecap="round" />
          {/* Chickpeas */}
          <circle cx="28" cy="46" r="4.5" fill="#ECA642" />
          <circle cx="36" cy="50" r="4.5" fill="#D98E32" />
          <circle cx="24" cy="38" r="4" fill="#C97F28" />
          {/* Yogurt dollop */}
          <circle cx="42" cy="40" r="9" fill="#FFFFFF" />
          <circle cx="43" cy="41" r="1.5" fill="#D4AF37" />
          <circle cx="41" cy="39" r="1" fill="#387A49" />
        </svg>
      )}
    </div>
  );
};
