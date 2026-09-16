import React from 'react';

// Sliced Red Onion Illustration
export const SlicedRedOnion: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="onionSkin" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#872341" />
        <stop offset="50%" stopColor="#A82855" />
        <stop offset="100%" stopColor="#571128" />
      </linearGradient>
      <linearGradient id="onionFlesh" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF9F5" />
        <stop offset="100%" stopColor="#F5E3E8" />
      </linearGradient>
      <filter id="onionShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#22050E" floodOpacity="0.25" />
      </filter>
    </defs>

    {/* Outer Skin Rim */}
    <ellipse cx="50" cy="50" rx="44" ry="42" fill="url(#onionSkin)" filter="url(#onionShadow)" />
    
    {/* Outer Layer Ring */}
    <ellipse cx="50" cy="50" rx="41" ry="39" fill="url(#onionFlesh)" />
    <ellipse cx="50" cy="50" rx="38" ry="36" stroke="#9E224D" strokeWidth="2.5" fill="none" />

    {/* Secondary Layer Ring */}
    <ellipse cx="50" cy="50" rx="34" ry="32" fill="#FFFBF8" />
    <ellipse cx="50" cy="50" rx="31" ry="29" stroke="#B83262" strokeWidth="2" fill="none" />

    {/* Tertiary Layer Ring */}
    <ellipse cx="50" cy="50" rx="27" ry="25" fill="url(#onionFlesh)" />
    <ellipse cx="50" cy="50" rx="23" ry="22" stroke="#C94474" strokeWidth="1.8" fill="none" />

    {/* Core Layer Rings */}
    <ellipse cx="50" cy="50" rx="19" ry="18" fill="#FFFDFB" />
    <ellipse cx="50" cy="50" rx="15" ry="14" stroke="#D85986" strokeWidth="1.5" fill="none" />
    <ellipse cx="50" cy="50" rx="10" ry="9" fill="#E6EEBE" stroke="#8A9E38" strokeWidth="1.5" />
    <circle cx="50" cy="50" r="4" fill="#A4B848" />

    {/* Natural radiating cell fiber striations */}
    <path d="M50 12 L50 25 M50 75 L50 88 M12 50 L25 50 M75 50 L88 50" stroke="#872341" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
    <path d="M24 24 L33 33 M67 67 L76 76 M76 24 L67 33 M24 76 L33 67" stroke="#A82855" strokeWidth="1" opacity="0.35" strokeLinecap="round" />
  </svg>
);

// Roasted Chickpeas Illustration
export const RoastedChickpeas: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <radialGradient id="chickpeaMain" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#FEE4A6" />
        <stop offset="35%" stopColor="#E5A642" />
        <stop offset="85%" stopColor="#B26C1F" />
        <stop offset="100%" stopColor="#7E4711" />
      </radialGradient>
      <radialGradient id="chickpeaDark" cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="#F9D788" />
        <stop offset="40%" stopColor="#CE8B2A" />
        <stop offset="90%" stopColor="#965215" />
        <stop offset="100%" stopColor="#633209" />
      </radialGradient>
    </defs>

    {/* Back Chickpea */}
    <g transform="translate(48, 16) scale(0.65)">
      <circle cx="25" cy="25" r="22" fill="url(#chickpeaDark)" />
      <path d="M22 10 C27 22, 22 36, 17 44" stroke="#7E4711" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
      <circle cx="18" cy="18" r="3" fill="#FFF2CC" opacity="0.6" />
    </g>

    {/* Left Lower Chickpea */}
    <g transform="translate(8, 38) scale(0.75)">
      <circle cx="25" cy="25" r="22" fill="url(#chickpeaDark)" />
      <path d="M20 10 C25 24, 21 37, 16 44" stroke="#633209" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <circle cx="17" cy="17" r="3.5" fill="#FFF2CC" opacity="0.5" />
      {/* Roasted spice fleck */}
      <circle cx="28" cy="30" r="1.5" fill="#881B0E" />
    </g>

    {/* Main Foreground Chickpea */}
    <g transform="translate(30, 32)">
      {/* Organic chickpea shape with slight beak/point */}
      <path
        d="M26 6 C38 6, 48 16, 48 29 C48 42, 37 50, 24 50 C11 50, 4 41, 4 28 C4 18, 12 6, 26 6 Z"
        fill="url(#chickpeaMain)"
      />
      {/* Natural cleft seam */}
      <path
        d="M24 10 C29 20, 26 34, 18 44"
        stroke="#7E4711"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Cleft shadow accent */}
      <path
        d="M26 12 C30 21, 28 32, 21 41"
        stroke="#FEE4A6"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Highlight glow */}
      <ellipse cx="19" cy="18" rx="6" ry="4" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 19 18)" />
      {/* Paprika spice flecks */}
      <circle cx="34" cy="22" r="1.8" fill="#992312" />
      <circle cx="37" cy="34" r="1.5" fill="#992312" />
      <circle cx="15" cy="36" r="1.2" fill="#781708" />
    </g>
  </svg>
);

// Greek Yogurt Bowl Illustration
export const GreekYogurtBowl: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <linearGradient id="ramekinRim" x1="15" y1="20" x2="85" y2="80" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F5EFEB" />
        <stop offset="60%" stopColor="#DFD5CB" />
        <stop offset="100%" stopColor="#B3A596" />
      </linearGradient>
      <linearGradient id="yogurtGrad" x1="30" y1="25" x2="70" y2="65" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FAF7F2" />
        <stop offset="100%" stopColor="#E9E0D4" />
      </linearGradient>
    </defs>

    {/* Ceramic Bowl Base */}
    <ellipse cx="50" cy="54" rx="42" ry="32" fill="#9E8F7F" />
    <path
      d="M8 52 C8 74, 26 88, 50 88 C74 88, 92 74, 92 52 Z"
      fill="url(#ramekinRim)"
    />
    <ellipse cx="50" cy="50" rx="42" ry="28" fill="url(#ramekinRim)" stroke="#8A7A6B" strokeWidth="1.5" />

    {/* Yogurt Pool with Thick Swirl */}
    <ellipse cx="50" cy="48" rx="36" ry="23" fill="url(#yogurtGrad)" />

    {/* Creamy Swirl Texture */}
    <path
      d="M30 46 C36 38, 56 36, 62 48 C66 56, 46 60, 38 54 C34 50, 36 44, 44 42"
      stroke="#DDD3C5"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M48 42 C54 39, 62 42, 60 48"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />

    {/* Golden Olive Oil Pool */}
    <ellipse cx="56" cy="46" rx="6" ry="4" fill="#D9B134" opacity="0.85" transform="rotate(15 56 46)" />
    <ellipse cx="55" cy="45" rx="3" ry="1.8" fill="#FFF0A3" opacity="0.9" />

    {/* Fresh Chopped Parsley Garnish */}
    <path d="M40 43 C38 39, 34 40, 36 44 Z" fill="#2E703D" />
    <path d="M43 45 C46 43, 48 45, 46 48 Z" fill="#3D8A4E" />
    <circle cx="50" cy="52" r="1.2" fill="#2E703D" />
  </svg>
);

// Glossy Ripe Red Tomato Illustration
export const RipeRedTomato: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-md select-none ${className}`}
  >
    <defs>
      <radialGradient id="tomatoGrad" cx="38%" cy="36%" r="62%">
        <stop offset="0%" stopColor="#FF6B59" />
        <stop offset="25%" stopColor="#EB3324" />
        <stop offset="75%" stopColor="#B31A12" />
        <stop offset="100%" stopColor="#6E0B07" />
      </radialGradient>
    </defs>

    {/* Tomato Body */}
    <path
      d="M50 20 C68 18, 90 28, 90 54 C90 76, 72 90, 50 90 C28 90, 10 76, 10 54 C10 28, 32 18, 50 20 Z"
      fill="url(#tomatoGrad)"
    />

    {/* Specular Highlight Sheen */}
    <ellipse cx="36" cy="38" rx="14" ry="8" fill="#FFFFFF" opacity="0.45" transform="rotate(-30 36 38)" />
    <ellipse cx="32" cy="34" rx="6" ry="3" fill="#FFFFFF" opacity="0.8" transform="rotate(-30 32 34)" />

    {/* Leafy Green Calyx & Stem */}
    <path d="M50 22 C49 14, 52 8, 56 4" stroke="#3A723D" strokeWidth="4" strokeLinecap="round" />
    {/* Calyx Leaves */}
    <path d="M50 20 C42 12, 34 16, 32 24 C38 22, 44 21, 50 20 Z" fill="#4B8D4E" />
    <path d="M50 20 C58 12, 66 16, 68 24 C62 22, 56 21, 50 20 Z" fill="#3D7540" />
    <path d="M50 20 C46 26, 42 32, 36 34 C38 28, 44 24, 50 20 Z" fill="#3D7540" />
    <path d="M50 20 C54 26, 58 32, 64 34 C62 28, 56 24, 50 20 Z" fill="#4B8D4E" />
    <path d="M50 20 C50 28, 50 34, 50 36 C48 30, 48 24, 50 20 Z" fill="#2F5C32" />
  </svg>
);

// Fresh Green Parsley Sprig Illustration
export const ParsleySprig: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-sm select-none ${className}`}
  >
    {/* Stems */}
    <path d="M20 70 C30 55, 45 40, 55 25" stroke="#376E3C" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M38 46 C48 40, 56 42, 64 36" stroke="#376E3C" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 56 C24 48, 20 42, 14 38" stroke="#376E3C" strokeWidth="2" strokeLinecap="round" />

    {/* Leaf Clusters */}
    {/* Top Cluster */}
    <g transform="translate(48, 12)">
      <path
        d="M8 12 C4 4, 14 0, 18 6 C24 0, 30 8, 26 14 C32 18, 24 26, 18 22 C14 26, 6 20, 8 12 Z"
        fill="#4EA856"
      />
      <path
        d="M10 12 C7 6, 14 3, 17 8 C21 3, 26 9, 23 14 C27 17, 21 23, 17 20 C14 23, 8 18, 10 12 Z"
        fill="#398540"
      />
    </g>

    {/* Right Cluster */}
    <g transform="translate(56, 26)">
      <path
        d="M6 10 C3 4, 11 1, 14 6 C19 1, 23 7, 20 12 C24 15, 18 21, 14 18 C11 21, 5 16, 6 10 Z"
        fill="#439A4B"
      />
    </g>

    {/* Left Cluster */}
    <g transform="translate(6, 28)">
      <path
        d="M6 10 C3 4, 11 1, 14 6 C19 1, 23 7, 20 12 C24 15, 18 21, 14 18 C11 21, 5 16, 6 10 Z"
        fill="#4EA856"
      />
    </g>
  </svg>
);

// Screen 1: Hero Cast Iron Skillet with Sizzling Ingredients Soaring into the Air
export const HeroSkilletVisual: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative w-full max-w-[340px] aspect-square flex items-center justify-center select-none ${className}`}>
      {/* Soft warm culinary glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-terracotta/10 via-amber-100/30 to-sage/20 blur-2xl -z-10" />

      {/* Skillet SVG */}
      <svg
        viewBox="0 0 320 320"
        className="w-full h-full drop-shadow-xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="handleGrad" x1="210" y1="210" x2="305" y2="305" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E2420" />
            <stop offset="30%" stopColor="#323C36" />
            <stop offset="70%" stopColor="#1C211D" />
            <stop offset="100%" stopColor="#0F1210" />
          </linearGradient>
          <linearGradient id="ironRim" x1="50" y1="50" x2="230" y2="230" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#354038" />
            <stop offset="40%" stopColor="#222B25" />
            <stop offset="80%" stopColor="#171D19" />
            <stop offset="100%" stopColor="#0F1310" />
          </linearGradient>
          <radialGradient id="skilletBase" cx="45%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#28322B" />
            <stop offset="60%" stopColor="#1C231E" />
            <stop offset="90%" stopColor="#141A16" />
            <stop offset="100%" stopColor="#0B0E0C" />
          </radialGradient>
        </defs>

        {/* Cast Iron Pan Handle extending to bottom right */}
        <path
          d="M205 205 L285 285"
          stroke="url(#handleGrad)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        {/* Handle grip highlight */}
        <path
          d="M210 205 L280 275"
          stroke="#4D5C52"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* Hanging loop hole at end of handle */}
        <circle cx="280" cy="280" r="5" fill="#C5CDC7" />
        <circle cx="280" cy="280" r="3" fill="#0F1210" />

        {/* Pan Outer Rim Layer */}
        <circle cx="140" cy="145" r="105" fill="url(#ironRim)" filter="drop-shadow(0 12px 24px rgba(0,0,0,0.35))" />
        <circle cx="140" cy="145" r="99" fill="#141915" />

        {/* Pan Interior Seasoned Surface */}
        <circle cx="140" cy="145" r="92" fill="url(#skilletBase)" />

        {/* Pan Concentric Heat Rings (Authentic Cast Iron Detail) */}
        <circle cx="140" cy="145" r="76" stroke="#2D3830" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        <circle cx="140" cy="145" r="58" stroke="#2D3830" strokeWidth="1.2" strokeDasharray="5 3" opacity="0.5" />
        <circle cx="140" cy="145" r="40" stroke="#2D3830" strokeWidth="1" opacity="0.4" />

        {/* Olive Oil Sheen */}
        <ellipse
          cx="128"
          cy="125"
          rx="68"
          ry="38"
          fill="#FFFFFF"
          fillOpacity="0.06"
          transform="rotate(-25 128 125)"
        />

        {/* Sizzle Steam / Aroma Waves */}
        <path
          d="M100 80 C90 60, 110 40, 95 20"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.3"
        />
        <path
          d="M150 70 C140 45, 160 30, 150 15"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.35"
        />
        <path
          d="M190 90 C180 70, 200 55, 190 35"
          stroke="#FFFFFF"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeDasharray="4 4"
          opacity="0.25"
        />
      </svg>

      {/* Soaring & Flying Ingredients Above the Pan */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ripe Glossy Tomato with Stem (center-left) */}
        <div className="absolute top-12 left-10 transform -rotate-12 hover:scale-105 transition-transform animate-bounce [animation-duration:3.8s]">
          <RipeRedTomato size={72} />
        </div>

        {/* Sliced Red Onion (top-center/left) */}
        <div className="absolute top-4 left-32 transform rotate-15 animate-pulse [animation-duration:3.2s]">
          <SlicedRedOnion size={68} />
        </div>

        {/* Greek Yogurt Splash / Ramekin (center-right) */}
        <div className="absolute top-20 right-14 transform -rotate-8 hover:scale-105 transition-transform">
          <GreekYogurtBowl size={66} />
        </div>

        {/* Roasted Chickpeas (cluster floating around pan rim) */}
        <div className="absolute top-36 right-28 transform rotate-12">
          <RoastedChickpeas size={56} />
        </div>
        <div className="absolute top-28 right-6 transform -rotate-15">
          <RoastedChickpeas size={38} />
        </div>
        <div className="absolute top-44 left-24 transform rotate-45">
          <RoastedChickpeas size={32} />
        </div>

        {/* Fresh Parsley Sprigs (airborne accents) */}
        <div className="absolute top-2 left-16 transform -rotate-30">
          <ParsleySprig size={40} />
        </div>
        <div className="absolute bottom-16 right-16 transform rotate-45">
          <ParsleySprig size={38} />
        </div>
      </div>
    </div>
  );
};

// Miniature Vector Icon for Ingredient Cards (Screen 2 Mockup)
export const IngredientMiniature: React.FC<{
  name: string;
  fallbackEmoji?: string;
  size?: number;
}> = ({ name, fallbackEmoji = '🥗', size = 32 }) => {
  const normalized = name.toLowerCase().trim();

  if (normalized.includes('onion') || normalized.includes('shallot')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#F6EEF0] border border-[#ECD8DD] flex items-center justify-center shrink-0 shadow-2xs">
        <SlicedRedOnion size={size} />
      </div>
    );
  }

  if (
    normalized.includes('yogurt') ||
    normalized.includes('yoghurt') ||
    normalized.includes('labneh') ||
    normalized.includes('sour cream')
  ) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] border border-[#E8DFD3] flex items-center justify-center shrink-0 shadow-2xs">
        <GreekYogurtBowl size={size} />
      </div>
    );
  }

  if (
    normalized.includes('chickpea') ||
    normalized.includes('garbanzo') ||
    normalized.includes('bean') ||
    normalized.includes('lentil')
  ) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#FBF2E3] border border-[#EED7B8] flex items-center justify-center shrink-0 shadow-2xs">
        <RoastedChickpeas size={size} />
      </div>
    );
  }

  if (
    normalized.includes('tomato') ||
    normalized.includes('tomatoes') ||
    normalized.includes('marinara')
  ) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#FCECEB] border border-[#F6D0CD] flex items-center justify-center shrink-0 shadow-2xs">
        <RipeRedTomato size={size} />
      </div>
    );
  }

  if (
    normalized.includes('parsley') ||
    normalized.includes('herb') ||
    normalized.includes('cilantro') ||
    normalized.includes('basil') ||
    normalized.includes('spinach')
  ) {
    return (
      <div className="w-10 h-10 rounded-xl bg-[#EDF5EE] border border-[#D3E7D5] flex items-center justify-center shrink-0 shadow-2xs">
        <ParsleySprig size={size} />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl bg-cream-surface/90 border border-sand-border/70 flex items-center justify-center text-lg shrink-0 select-none shadow-2xs">
      {fallbackEmoji}
    </div>
  );
};

