import React from 'react';

/**
 * Illustrated 2.5D pixel-art-inspired Indian village landscape backdrop
 * for the adventure onboarding screen: sunlit sky, slow-drifting clouds,
 * distant hills, lush terraced fields, winding dirt road, rural cottages,
 * swaying trees, and soft floating sunbeams.
 */
export const VillageBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none select-none z-0"
    >
      {/* Warm Golden Morning Sky Gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #1d6fa3 0%, #3fa1ce 28%, #8bd3e6 54%, #fde6a8 78%, #5b9e44 79%, #3f7c33 100%)',
        }}
      />

      {/* Radiant Morning Sun & Warm Halo */}
      <div
        className="absolute -top-12 right-[12%] w-56 h-56 rounded-full opacity-75"
        style={{
          background:
            'radial-gradient(circle, rgba(254,249,195,0.95) 0%, rgba(253,224,71,0.55) 38%, rgba(251,191,36,0) 72%)',
        }}
      />

      {/* Layered Pixel-Styled Village Landscape SVG */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        shapeRendering="crispEdges"
      >
        {/* Slow-Drifting Clouds */}
        <g className="animate-cloud-drift" opacity="0.92">
          <rect x="140" y="95" width="110" height="24" fill="#ffffff" />
          <rect x="165" y="75" width="66" height="22" fill="#ffffff" />
          <rect x="125" y="109" width="140" height="14" fill="#e0f2fe" />
          <rect x="860" y="120" width="128" height="26" fill="#ffffff" />
          <rect x="890" y="98" width="70" height="24" fill="#ffffff" />
          <rect x="845" y="136" width="156" height="12" fill="#e0f2fe" />
        </g>

        <g className="animate-cloud-drift-slow" opacity="0.82">
          <rect x="490" y="64" width="96" height="20" fill="#fffbeb" />
          <rect x="512" y="48" width="52" height="18" fill="#ffffff" />
          <rect x="1160" y="88" width="108" height="22" fill="#fffbeb" />
          <rect x="1185" y="70" width="58" height="20" fill="#ffffff" />
        </g>

        {/* Distant Misty Hills */}
        <path
          d="M0 540 L180 420 L390 485 L620 390 L860 475 L1120 380 L1320 450 L1440 420 L1440 620 L0 620 Z"
          fill="#4b8b7c"
          opacity="0.72"
        />
        <path
          d="M0 570 L140 480 L360 530 L580 460 L820 520 L1060 455 L1290 515 L1440 485 L1440 660 L0 660 Z"
          fill="#3f8556"
          opacity="0.88"
        />

        {/* Rolling Sunlit Green Meadows & Terraced Crop Fields */}
        <path
          d="M0 595 Q360 545 720 585 T1440 570 L1440 900 L0 900 Z"
          fill="#4f963f"
        />
        <path
          d="M0 645 Q420 605 840 650 T1440 635 L1440 900 L0 900 Z"
          fill="#438536"
        />

        {/* Golden & Lush Farm Field Patches in Background */}
        <polygon points="880,625 1230,615 1290,675 910,690" fill="#ca8a04" opacity="0.55" />
        <polygon points="910,645 1245,636 1265,655 915,665" fill="#eab308" opacity="0.45" />
        <polygon points="90,640 360,628 330,685 50,695" fill="#65a30d" opacity="0.5" />

        {/* Winding Village Dirt Road curving into the sunrise */}
        <path
          d="M660 900 C690 800, 610 745, 725 690 C815 648, 760 608, 705 582 L732 582 C805 608, 868 654, 775 704 C678 756, 780 812, 775 900 Z"
          fill="#c8a16b"
        />
        <path
          d="M685 900 C705 805, 635 752, 742 696 C822 654, 770 612, 718 584 L726 584 C784 612, 836 655, 756 700 C662 752, 748 810, 744 900 Z"
          fill="#dfc08e"
          opacity="0.65"
        />

        {/* Left 2.5D Terracotta Village House */}
        <g transform="translate(155, 555)">
          <rect x="6" y="72" width="114" height="12" fill="rgba(15,35,15,0.28)" />
          <rect x="12" y="34" width="96" height="44" fill="#f5efe2" />
          <rect x="98" y="34" width="10" height="44" fill="#dfd5c2" />
          <rect x="12" y="68" width="96" height="10" fill="#8c7a6b" />
          {/* Terracotta Roof */}
          <polygon points="2,38 20,8 100,8 118,38" fill="#c2410c" />
          <polygon points="18,12 102,12 110,24 10,24" fill="#ea580c" />
          <rect x="20" y="6" width="80" height="4" fill="#fef3c7" />
          {/* Door & Windows */}
          <rect x="48" y="48" width="22" height="30" fill="#7c3f1c" />
          <rect x="22" y="46" width="16" height="14" fill="#bae6fd" />
          <rect x="80" y="46" width="16" height="14" fill="#bae6fd" />
        </g>

        {/* Distant Overhead Water Tank Silhouette (Right-Center) */}
        <g transform="translate(960, 505)" opacity="0.92">
          <rect x="18" y="40" width="6" height="54" fill="#64748b" />
          <rect x="44" y="40" width="6" height="54" fill="#64748b" />
          <rect x="31" y="40" width="5" height="54" fill="#0284c7" />
          <rect x="16" y="60" width="36" height="4" fill="#475569" />
          <rect x="16" y="78" width="36" height="4" fill="#475569" />
          <rect x="10" y="16" width="48" height="26" fill="#0284c7" />
          <rect x="10" y="12" width="48" height="8" fill="#cbd5e1" />
          <rect x="14" y="22" width="14" height="14" fill="#38bdf8" />
        </g>

        {/* Right 2.5D Village Cottage & Solar Panel */}
        <g transform="translate(1155, 575)">
          <rect x="6" y="68" width="108" height="12" fill="rgba(15,35,15,0.28)" />
          <rect x="12" y="30" width="90" height="42" fill="#fef3c7" />
          <rect x="92" y="30" width="10" height="42" fill="#e6cf8b" />
          <polygon points="4,34 20,8 94,8 110,34" fill="#0f766e" />
          <polygon points="18,12 96,12 104,24 10,24" fill="#14b8a6" />
          <rect x="46" y="44" width="20" height="28" fill="#5c3a21" />
          <rect x="22" y="42" width="14" height="12" fill="#bae6fd" />
          <rect x="76" y="42" width="14" height="12" fill="#bae6fd" />
        </g>

        {/* Swaying Layered Pixel Trees — Left Grove */}
        <g className="animate-tree-sway" style={{ transformOrigin: '86px 680px' }}>
          <ellipse cx="86" cy="680" rx="34" ry="9" fill="rgba(15,35,15,0.28)" />
          <rect x="76" y="628" width="20" height="50" fill="#5d4037" />
          <rect x="80" y="628" width="8" height="48" fill="#795548" />
          <rect x="44" y="592" width="84" height="40" fill="#14532d" />
          <rect x="52" y="572" width="68" height="42" fill="#166534" />
          <rect x="60" y="556" width="52" height="30" fill="#22c55e" />
          <rect x="68" y="550" width="28" height="14" fill="#4ade80" />
        </g>

        <g className="animate-tree-sway" style={{ transformOrigin: '318px 655px', animationDelay: '1.1s' }}>
          <ellipse cx="318" cy="655" rx="24" ry="7" fill="rgba(15,35,15,0.24)" />
          <rect x="311" y="616" width="14" height="38" fill="#5d4037" />
          <rect x="288" y="586" width="60" height="34" fill="#166534" />
          <rect x="296" y="568" width="44" height="30" fill="#22c55e" />
          <rect x="304" y="560" width="24" height="14" fill="#86efac" />
          {/* Little ripe mangoes */}
          <rect x="300" y="592" width="6" height="6" fill="#facc15" />
          <rect x="328" y="588" width="6" height="6" fill="#fb923c" />
        </g>

        {/* Swaying Layered Pixel Trees — Right Grove */}
        <g className="animate-tree-sway" style={{ transformOrigin: '1336px 688px', animationDelay: '0.6s' }}>
          <ellipse cx="1336" cy="688" rx="34" ry="9" fill="rgba(15,35,15,0.28)" />
          <rect x="1326" y="636" width="20" height="50" fill="#5d4037" />
          <rect x="1294" y="598" width="84" height="42" fill="#14532d" />
          <rect x="1302" y="578" width="68" height="40" fill="#15803d" />
          <rect x="1312" y="564" width="48" height="28" fill="#22c55e" />
          <rect x="1320" y="558" width="26" height="12" fill="#4ade80" />
        </g>

        {/* Foreground Wildflowers */}
        <g>
          <rect x="210" y="795" width="8" height="8" fill="#fde047" />
          <rect x="242" y="820" width="8" height="8" fill="#f472b6" />
          <rect x="440" y="838" width="8" height="8" fill="#fef08a" />
          <rect x="1030" y="810" width="8" height="8" fill="#fde047" />
          <rect x="1190" y="835" width="8" height="8" fill="#fb923c" />
          <rect x="1265" y="790" width="8" height="8" fill="#f472b6" />
        </g>
      </svg>

      {/* Soft Floating Sunlit Particles */}
      <div className="absolute inset-0">
        {[
          { left: '14%', top: '34%', delay: '0s', size: 6 },
          { left: '28%', top: '22%', delay: '1.2s', size: 5 },
          { left: '72%', top: '26%', delay: '0.6s', size: 7 },
          { left: '84%', top: '40%', delay: '2.1s', size: 5 },
          { left: '46%', top: '18%', delay: '1.7s', size: 6 },
          { left: '90%', top: '65%', delay: '0.9s', size: 6 },
        ].map((p, idx) => (
          <span
            key={idx}
            className="animate-firefly absolute rounded-full bg-amber-200/80 shadow-[0_0_10px_rgba(253,224,71,0.9)]"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Subtle Dark Vignette at Edges for Crisp Foreground Readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(15,23,42,0.12) 0%, rgba(15,23,42,0.52) 100%)',
        }}
      />
    </div>
  );
};
