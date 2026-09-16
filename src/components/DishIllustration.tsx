import React from 'react';

interface DishIllustrationProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'thumb';
  showNote?: boolean;
  noteText?: string;
  noteRotation?: string;
}

export const DishIllustration: React.FC<DishIllustrationProps> = ({
  className = '',
  size = 'md',
  showNote = false,
  noteText = 'Your leftovers just leveled up.',
  noteRotation = 'rotate-3',
}) => {
  const sizeClasses = {
    thumb: 'w-16 h-16 sm:w-20 sm:h-20',
    sm: 'w-36 h-36 sm:w-44 sm:h-44',
    md: 'w-56 h-56 sm:w-64 sm:h-64',
    lg: 'w-64 h-64 sm:w-72 sm:h-72',
  }[size];

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Handwritten sticky / rotated note if requested */}
      {showNote && (
        <div
          className={`absolute -top-3 -right-2 sm:-right-6 z-20 transform ${noteRotation} pointer-events-none max-w-[130px] sm:max-w-[160px] text-right`}
        >
          <p className="font-script text-lg sm:text-xl text-charcoal leading-tight drop-shadow-2xs">
            &ldquo;{noteText}&rdquo;
          </p>
          <svg
            className="w-6 h-6 text-charcoal/60 ml-auto transform -rotate-12 translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M19 5 C14 10, 8 12, 5 18 M5 18 L9 18 M5 18 L6 14" />
          </svg>
        </div>
      )}

      {/* Bowl Vector Illustration */}
      <div className={`relative ${sizeClasses} rounded-full flex items-center justify-center`}>
        {/* Soft shadow */}
        <div className="absolute inset-1 rounded-full bg-charcoal/15 blur-lg -z-10 transform translate-y-3" />

        {/* SVG Bowl with rich culinary layers */}
        <svg
          viewBox="0 0 240 240"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ceramic Bowl Rim (Warm Earthy Terracotta Brown) */}
          <circle cx="120" cy="120" r="112" fill="#5A3E2B" />
          <circle cx="120" cy="120" r="106" fill="#6B4B35" />
          <circle cx="120" cy="120" r="100" fill="#3D291C" />

          {/* Inner Glaze Shadow */}
          <circle cx="120" cy="120" r="95" fill="#4A3425" />

          {/* Flatbread / Warm Naan Wedge on the side */}
          <path
            d="M175 65 C205 95, 210 145, 185 175 C165 150, 155 110, 175 65 Z"
            fill="#EAD0A2"
          />
          {/* Flatbread blister charred spots */}
          <ellipse cx="185" cy="115" rx="5" ry="8" fill="#8B572A" transform="rotate(20 185 115)" />
          <ellipse cx="178" cy="140" rx="4" ry="6" fill="#75421B" transform="rotate(10 178 140)" />
          <circle cx="188" cy="85" r="3.5" fill="#9C6233" />

          {/* Golden Caramelized Onions Base (curved layered ribbons) */}
          <g opacity="0.95">
            <path
              d="M70 95 C90 70, 130 75, 145 90 C125 105, 95 110, 70 95 Z"
              fill="#9C5221"
            />
            <path
              d="M80 85 C100 68, 125 72, 135 85 C115 95, 95 98, 80 85 Z"
              fill="#B8662B"
            />
            <path
              d="M95 105 C115 88, 140 92, 155 110 C130 120, 110 118, 95 105 Z"
              fill="#834118"
            />
            <path
              d="M65 115 C85 100, 115 105, 125 120 C105 130, 85 128, 65 115 Z"
              fill="#A75A24"
            />
          </g>

          {/* Crispy Spiced Roasted Chickpeas Cluster */}
          <g id="chickpeas-cluster">
            {/* Chickpeas on bottom-left and center */}
            <circle cx="65" cy="145" r="10.5" fill="#D98E32" />
            <circle cx="63" cy="143" r="10" fill="#ECA642" />
            <circle cx="60" cy="140" r="3" fill="#FDE096" opacity="0.8" />

            <circle cx="82" cy="155" r="11" fill="#C97F28" />
            <circle cx="80" cy="153" r="10.5" fill="#ECA642" />
            <circle cx="77" cy="150" r="3" fill="#FDE096" opacity="0.8" />

            <circle cx="102" cy="165" r="10" fill="#BA7320" />
            <circle cx="100" cy="163" r="9.5" fill="#ECA642" />
            <circle cx="97" cy="160" r="2.8" fill="#FDE096" opacity="0.8" />

            <circle cx="55" cy="128" r="9.5" fill="#C97F28" />
            <circle cx="53" cy="126" r="9" fill="#ECA642" />
            <circle cx="51" cy="124" r="2.5" fill="#FDE096" opacity="0.8" />

            <circle cx="74" cy="136" r="10" fill="#BA7320" />
            <circle cx="72" cy="134" r="9.5" fill="#F2B452" />
            <circle cx="70" cy="132" r="2.8" fill="#FDE096" opacity="0.8" />

            <circle cx="92" cy="145" r="10" fill="#C97F28" />
            <circle cx="90" cy="143" r="9.5" fill="#ECA642" />

            <circle cx="118" cy="158" r="10" fill="#BA7320" />
            <circle cx="116" cy="156" r="9.5" fill="#ECA642" />

            <circle cx="85" cy="175" r="9" fill="#C97F28" />
            <circle cx="83" cy="173" r="8.5" fill="#ECA642" />

            <circle cx="65" cy="165" r="8.5" fill="#BA7320" />
            <circle cx="63" cy="163" r="8" fill="#ECA642" />

            <circle cx="105" cy="145" r="9" fill="#BA7320" />
            <circle cx="103" cy="143" r="8.5" fill="#F2B452" />
          </g>

          {/* Paprika & Cumin Dusting */}
          <circle cx="72" cy="140" r="1.5" fill="#992E17" />
          <circle cx="88" cy="148" r="1.5" fill="#992E17" />
          <circle cx="62" cy="152" r="1.2" fill="#992E17" />
          <circle cx="98" cy="160" r="1.5" fill="#992E17" />
          <circle cx="112" cy="152" r="1.2" fill="#992E17" />

          {/* Creamy Greek Yogurt Swirl (Rich velvety white with olive oil drizzle) */}
          <g id="yogurt-swirl">
            {/* Yogurt base pool */}
            <path
              d="M115 105 C145 95, 170 120, 160 145 C150 165, 125 155, 115 135 C110 125, 105 110, 115 105 Z"
              fill="#F4EFE6"
            />
            <path
              d="M120 110 C145 102, 162 122, 155 142 C146 158, 128 150, 122 135 C118 126, 114 115, 120 110 Z"
              fill="#FFFFFF"
            />
            {/* Swirl indent line */}
            <path
              d="M128 118 C145 112, 155 125, 148 138 C142 148, 132 142, 130 132"
              stroke="#E8E0D2"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Extra virgin olive oil golden drizzle */}
            <path
              d="M122 120 C135 114, 150 125, 142 140"
              stroke="#C4A635"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.85"
            />
            <circle cx="140" cy="126" r="2" fill="#C4A635" opacity="0.9" />
            <circle cx="132" cy="138" r="1.8" fill="#C4A635" opacity="0.9" />
          </g>

          {/* Fresh Parsley & Herb Leaves Garnish */}
          <g id="parsley-garnish">
            {/* Leaf 1 */}
            <path
              d="M135 122 C132 118, 128 120, 130 124 C132 128, 138 126, 135 122 Z"
              fill="#2E693B"
            />
            <path
              d="M136 123 C138 120, 142 122, 140 125 C138 128, 134 126, 136 123 Z"
              fill="#3D854F"
            />
            {/* Leaf 2 */}
            <path
              d="M102 128 C98 124, 95 127, 98 131 C101 134, 105 132, 102 128 Z"
              fill="#3D854F"
            />
            {/* Leaf 3 */}
            <path
              d="M80 110 C76 107, 73 110, 77 114 C81 117, 84 114, 80 110 Z"
              fill="#2E693B"
            />
            {/* Herb flecks */}
            <circle cx="112" cy="115" r="1.2" fill="#2E693B" />
            <circle cx="148" cy="132" r="1.2" fill="#2E693B" />
            <circle cx="95" cy="148" r="1.2" fill="#2E693B" />
            <circle cx="75" cy="162" r="1.2" fill="#2E693B" />
          </g>

          {/* Bowl Rim Highlight */}
          <path
            d="M35 80 C60 45, 110 30, 160 38"
            stroke="#9C7860"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>
    </div>
  );
};
