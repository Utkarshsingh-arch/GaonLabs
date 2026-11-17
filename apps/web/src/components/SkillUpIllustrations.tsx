import React from 'react';

/**
 * Pixel-accurate SVG illustrations matching the exact design aesthetic of the SkillUp screenshot:
 * Warm orange (#FA9C4D), sun yellow (#FFCF4F / #FAC05E), soft ivory (#F8F4EE), mint green (#48AF76),
 * and dark espresso outlines (#352F2A).
 */

export const RocketIllustration: React.FC<{ className?: string }> = ({ className = 'w-36 h-36' }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Sun Yellow Organic Background Blob */}
    <ellipse cx="98" cy="80" rx="46" ry="44" fill="#FFCF4F" fillOpacity="0.9" />
    <circle cx="132" cy="115" r="7" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="68" cy="40" r="4" fill="#FFFFFF" fillOpacity="0.8" />

    {/* Exhaust Flame */}
    <path
      d="M52 108C42 114 34 126 28 136C40 134 50 126 56 120L52 108Z"
      fill="#FA9C4D"
    />
    <path
      d="M44 116C36 122 30 132 26 140C34 138 42 132 47 126L44 116Z"
      fill="#FFCF4F"
    />

    {/* Exhaust Speed Particles */}
    <circle cx="22" cy="144" r="3" fill="#FA9C4D" />
    <circle cx="36" cy="142" r="2" fill="#FFCF4F" />
    <circle cx="18" cy="132" r="2" fill="#FA9C4D" />

    {/* Rocket Body */}
    <g transform="rotate(-40 90 75)">
      {/* Left Fin */}
      <path
        d="M62 82C62 82 50 88 44 100C54 98 64 92 64 92L62 82Z"
        fill="#FA9C4D"
        stroke="#352F2A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right Fin */}
      <path
        d="M86 82C86 82 98 88 104 100C94 98 84 92 84 92L86 82Z"
        fill="#FA9C4D"
        stroke="#352F2A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Rocket Main Hull */}
      <path
        d="M74 38C82 50 86 70 84 92H64C62 70 66 50 74 38Z"
        fill="#FFFFFF"
        stroke="#352F2A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Rocket Nosecone */}
      <path
        d="M74 38C79 46 82 56 83 62H65C66 56 69 46 74 38Z"
        fill="#FA9C4D"
        stroke="#352F2A"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Rocket Window */}
      <circle cx="74" cy="74" r="7" fill="#FFCF4F" stroke="#352F2A" strokeWidth="2.5" />
      <circle cx="72" cy="72" r="2.5" fill="#FFFFFF" />
      {/* Bottom Ring */}
      <path d="M66 92L68 97H80L82 92" fill="#352F2A" />
    </g>
  </svg>
);

export const MapIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-32' }) => (
  <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Yellow Background Glow */}
    <ellipse cx="100" cy="60" rx="65" ry="40" fill="#FFCF4F" fillOpacity="0.25" />
    <path
      d="M30 35L75 22L125 35L170 22V85L125 98L75 85L30 98V35Z"
      fill="#FFFFFF"
      stroke="#352F2A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Fold Lines */}
    <line x1="75" y1="22" x2="75" y2="85" stroke="#EFECE6" strokeWidth="2" strokeDasharray="3 3" />
    <line x1="125" y1="35" x2="125" y2="98" stroke="#EFECE6" strokeWidth="2" strokeDasharray="3 3" />
    {/* Continents / Landmass outlines in orange & yellow */}
    <path
      d="M40 45C50 42 62 48 68 55C60 62 45 60 40 45Z"
      fill="#FA9C4D"
      fillOpacity="0.85"
    />
    <path
      d="M85 40C98 38 115 45 118 56C105 60 90 52 85 40Z"
      fill="#FFCF4F"
    />
    <path
      d="M135 48C148 42 160 50 162 65C150 70 138 62 135 48Z"
      fill="#FA9C4D"
      fillOpacity="0.7"
    />
    {/* Waypoint Marker Pin */}
    <g transform="translate(98, 30)">
      <ellipse cx="2" cy="38" rx="8" ry="3" fill="#352F2A" fillOpacity="0.15" />
      <path
        d="M2 10C-5 10 -10 15 -10 22C-10 32 2 40 2 40C2 40 14 32 14 22C14 15 9 10 2 10Z"
        fill="#FA9C4D"
        stroke="#352F2A"
        strokeWidth="2"
      />
      <circle cx="2" cy="21" r="4.5" fill="#FFFFFF" />
    </g>
  </svg>
);

export const BackpackIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-32' }) => (
  <svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Soft Yellow Background Glow */}
    <ellipse cx="100" cy="60" rx="55" ry="40" fill="#FFCF4F" fillOpacity="0.25" />
    {/* Backpack Handle */}
    <path
      d="M90 32C90 24 110 24 110 32"
      stroke="#352F2A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Main Backpack Body */}
    <rect
      x="74"
      y="32"
      width="52"
      height="64"
      rx="12"
      fill="#FFFFFF"
      stroke="#352F2A"
      strokeWidth="2.5"
    />
    {/* Top Flap in Orange */}
    <path
      d="M74 44C74 38 80 34 86 34H114C120 34 126 38 126 44V54H74V44Z"
      fill="#FA9C4D"
      stroke="#352F2A"
      strokeWidth="2"
    />
    {/* Front Pocket in Orange with Yellow Accent */}
    <rect
      x="80"
      y="62"
      width="40"
      height="26"
      rx="6"
      fill="#FA9C4D"
      stroke="#352F2A"
      strokeWidth="2"
    />
    <line x1="88" y1="72" x2="112" y2="72" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    {/* Left Side Pocket in Yellow */}
    <rect
      x="64"
      y="60"
      width="10"
      height="24"
      rx="4"
      fill="#FFCF4F"
      stroke="#352F2A"
      strokeWidth="2"
    />
    {/* Right Side Pocket in Yellow */}
    <rect
      x="126"
      y="60"
      width="10"
      height="24"
      rx="4"
      fill="#FFCF4F"
      stroke="#352F2A"
      strokeWidth="2"
    />
  </svg>
);

export const TutorIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Organic Orange and Yellow background blobs */}
    <ellipse cx="60" cy="45" rx="30" ry="24" fill="#FFCF4F" fillOpacity="0.4" />
    <circle cx="105" cy="50" r="22" fill="#FA9C4D" fillOpacity="0.3" />
    {/* Presentation Board */}
    <rect x="75" y="16" width="55" height="42" rx="4" fill="#FFFFFF" stroke="#352F2A" strokeWidth="2" />
    <line x1="85" y1="28" x2="115" y2="28" stroke="#FA9C4D" strokeWidth="2" strokeLinecap="round" />
    <line x1="85" y1="36" x2="108" y2="36" stroke="#D9D6D0" strokeWidth="2" strokeLinecap="round" />
    <line x1="85" y1="44" x2="118" y2="44" stroke="#D9D6D0" strokeWidth="2" strokeLinecap="round" />
    {/* Board Stand */}
    <line x1="102" y1="58" x2="102" y2="76" stroke="#352F2A" strokeWidth="2" />
    <line x1="90" y1="76" x2="114" y2="76" stroke="#352F2A" strokeWidth="2" strokeLinecap="round" />
    {/* Lecturer / Student Figure */}
    <circle cx="48" cy="30" r="9" fill="#FFFFFF" stroke="#352F2A" strokeWidth="2" />
    <path
      d="M36 62C36 48 42 43 48 43C54 43 60 48 60 62"
      fill="#FFFFFF"
      stroke="#352F2A"
      strokeWidth="2"
    />
    {/* Pointer arm */}
    <path d="M56 48L78 36" stroke="#352F2A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CodeBracketsIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background warm circles */}
    <circle cx="80" cy="45" r="32" fill="#FFCF4F" fillOpacity="0.35" />
    <circle cx="118" cy="62" r="14" fill="#FA9C4D" />
    <circle cx="112" cy="30" r="16" fill="#FAF5EF" stroke="#EFECE6" />
    {/* Quote Marks in small circle */}
    <text x="106" y="34" fill="#FA9C4D" fontSize="16" fontWeight="bold">“</text>
    {/* Quote Marks in orange circle */}
    <text x="113" y="68" fill="#FFFFFF" fontSize="13" fontWeight="bold">“</text>
    {/* Code Brackets in main shield */}
    <rect x="58" y="22" width="44" height="46" rx="14" fill="#FFCF4F" />
    <path
      d="M74 38L67 45L74 52M86 38L93 45L86 52"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const DocumentIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-24' }) => (
  <svg viewBox="0 0 160 90" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Background Orange Blobs */}
    <circle cx="62" cy="38" r="20" fill="#FA9C4D" fillOpacity="0.8" />
    <ellipse cx="114" cy="62" rx="20" ry="16" fill="#FFCF4F" fillOpacity="0.85" />
    {/* Document sheet */}
    <rect x="70" y="16" width="46" height="58" rx="6" fill="#FFFFFF" stroke="#352F2A" strokeWidth="2" />
    {/* Document header tag < > */}
    <rect x="76" y="24" width="16" height="8" rx="3" fill="#FAF5EF" stroke="#EFECE6" />
    <path d="M80 27L78 28L80 29M88 27L90 28L88 29" stroke="#FA9C4D" strokeWidth="1" />
    {/* Code lines */}
    <line x1="76" y1="38" x2="108" y2="38" stroke="#FA9C4D" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="76" y1="46" x2="100" y2="46" stroke="#FA9C4D" strokeWidth="2" strokeLinecap="round" />
    <line x1="76" y1="54" x2="106" y2="54" stroke="#FA9C4D" strokeWidth="2" strokeLinecap="round" />
    <line x1="76" y1="62" x2="94" y2="62" stroke="#FA9C4D" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

