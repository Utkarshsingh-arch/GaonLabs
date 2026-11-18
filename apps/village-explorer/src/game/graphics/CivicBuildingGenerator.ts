import Phaser from 'phaser';

/**
 * Generates crisp 2.5D pixel-art sprites for the 4 new civic campus buildings
 * and the animated Indian Express passenger train:
 * - Village Hospital (bldg_hospital)
 * - Village Railway Station (bldg_railway_station) + Express Train (prop_train)
 * - Village Marketplace & 5 Shops (bldg_village_market)
 * - Village Cooperative Bank (bldg_cooperative_bank)
 */
export function generateCivicBuildingSprites(scene: Phaser.Scene): void {
  const makeSprite = (
    key: string,
    w: number,
    h: number,
    draw: (ctx: CanvasRenderingContext2D) => void
  ) => {
    if (scene.textures.exists(key)) return;
    const c = scene.textures.createCanvas(key, w, h);
    if (!c) return;
    const ctx = c.getContext();
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    c.refresh();
  };

  // =========================================================================
  // 1. VILLAGE HOSPITAL (224x164) — Recognisable Medical Centre + Red Cross
  // =========================================================================
  makeSprite('bldg_hospital', 224, 164, (ctx) => {
    // Ground contact shadow
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(14, 142, 198, 16);

    // Main two-wing clinical white plaster building
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(16, 66, 190, 80);
    // Subtle 2.5D side shading & foundation plinth
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(194, 66, 12, 80);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(14, 138, 194, 8);
    // Teal medical trim stripe
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(16, 126, 190, 6);

    // Layered Teal Hospital Roof with elevated central entrance gable
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(8, 36, 206, 32);
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(14, 40, 194, 10);
    ctx.fillStyle = '#115e59';
    ctx.fillRect(10, 66, 202, 5);
    // Raised central medical pediment with bold RED CROSS sign!
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(80, 14, 64, 52);
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(76, 10, 72, 6);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(84, 18, 56, 32);
    // Iconic Red Cross
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(107, 22, 10, 24);
    ctx.fillRect(100, 29, 24, 10);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(108, 23, 8, 22);
    ctx.fillRect(101, 30, 22, 8);

    // Entrance Canopy, Ramp & Glass Sliding Doors
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(82, 84, 60, 10);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(84, 86, 56, 4);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(92, 96, 40, 46);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(95, 99, 16, 40);
    ctx.fillRect(113, 99, 16, 40);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(97, 101, 5, 16);
    ctx.fillRect(115, 101, 5, 16);
    // Wheelchair-accessible gentle stone ramp at doorway
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(84, 142, 56, 10);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(84, 150, 56, 3);

    // Ward & Anatomy Lab Windows (left & right wings)
    const winPositions = [28, 56, 148, 174];
    winPositions.forEach((wx) => {
      ctx.fillStyle = '#334155';
      ctx.fillRect(wx, 82, 20, 24);
      ctx.fillStyle = '#bae6fd';
      ctx.fillRect(wx + 2, 84, 16, 20);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(wx + 4, 86, 6, 6);
      ctx.fillStyle = '#334155';
      ctx.fillRect(wx + 9, 83, 2, 22);
      ctx.fillRect(wx + 1, 93, 18, 2);
    });

    // Small waiting bench & planter beside entrance
    ctx.fillStyle = '#15803d';
    ctx.fillRect(26, 128, 24, 10);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(30, 126, 4, 4);
    ctx.fillRect(42, 126, 4, 4);
    ctx.fillStyle = '#784826';
    ctx.fillRect(156, 130, 34, 8);
  });

  // =========================================================================
  // 2. VILLAGE COOPERATIVE BANK (220x160) — Pillared Sandstone & Navy Bank
  // =========================================================================
  makeSprite('bldg_cooperative_bank', 220, 160, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(14, 138, 194, 16);

    // Classical sandstone walls
    ctx.fillStyle = '#f5e6c8';
    ctx.fillRect(18, 62, 184, 80);
    ctx.fillStyle = '#dec9a4';
    ctx.fillRect(190, 62, 12, 80);
    // Marble stepped base
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(12, 134, 196, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(16, 134, 188, 4);

    // Royal Navy Pediment Roof with Gold Trim & Rupee/Coin Crest
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(10, 34, 200, 30);
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(16, 38, 188, 10);
    // Triangular classical pediment
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(42, 40);
    ctx.lineTo(110, 10);
    ctx.lineTo(178, 40);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(14, 60, 192, 4);
    // Golden Cooperative Emblem medallion in pediment
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(110, 29, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(107, 24, 6, 2);
    ctx.fillRect(107, 27, 6, 2);
    ctx.fillRect(109, 25, 2, 9);

    // 4 Classical White Pillars across facade
    [30, 74, 136, 180].forEach((px) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px, 66, 10, 68);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(px + 2, 66, 4, 68);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(px - 2, 64, 14, 4);
      ctx.fillRect(px - 2, 130, 14, 4);
    });

    // Double Oak Bank Entrance Doors
    ctx.fillStyle = '#451a03';
    ctx.fillRect(92, 86, 36, 48);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(95, 89, 14, 43);
    ctx.fillRect(111, 89, 14, 43);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(106, 108, 2, 6);
    ctx.fillRect(112, 108, 2, 6);

    // Digital Banking / ATM Kiosk Window on right wing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(152, 84, 22, 32);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(155, 88, 16, 12); // Glowing ATM screen
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(155, 103, 16, 8);
    // Teller window on left wing
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(46, 84, 22, 24);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(48, 86, 18, 20);
  });

  // =========================================================================
  // 3. VILLAGE MARKETPLACE & 5 SHOPS (264x160) — Bustling 5-Stall Bazaar!
  // =========================================================================
  makeSprite('bldg_village_market', 264, 160, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(10, 138, 246, 16);

    // Main Bazaar Arcade Backdrop Structure
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(14, 58, 236, 82);
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(238, 58, 12, 82);
    ctx.fillStyle = '#78716c';
    ctx.fillRect(12, 134, 240, 8);

    // Terracotta Market Roof
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(8, 22, 248, 36);
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(14, 26, 236, 12);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(20, 42, 224, 10);
    // Central Village Bazaar Arch Sign
    ctx.fillStyle = '#451a03';
    ctx.fillRect(84, 10, 96, 18);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(87, 13, 90, 12);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(94, 17, 76, 4);

    // 5 Distinct Colourful Shops side-by-side:
    // Grocery (Amber), Vegetable (Emerald), Fruit (Orange), Clothing (Rose/Violet), Hardware (Slate/Blue)
    const stalls = [
      { x: 18, c1: '#d97706', c2: '#fef3c7', goods: ['#fde68a', '#b45309', '#f8fafc'] }, // Grocery
      { x: 64, c1: '#16a34a', c2: '#dcfce7', goods: ['#22c55e', '#ef4444', '#84cc16'] }, // Vegetable
      { x: 110, c1: '#ea580c', c2: '#ffedd5', goods: ['#facc15', '#f97316', '#dc2626'] }, // Fruit
      { x: 156, c1: '#db2777', c2: '#fce7f3', goods: ['#ec4899', '#8b5cf6', '#38bdf8'] }, // Clothing
      { x: 202, c1: '#2563eb', c2: '#dbeafe', goods: ['#64748b', '#94a3b8', '#f59e0b'] }, // Hardware
    ];

    stalls.forEach((s) => {
      // Striped stall awning
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = i % 2 === 0 ? s.c1 : s.c2;
        ctx.fillRect(s.x + i * 11, 58, 11, 16);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.22)';
      ctx.fillRect(s.x, 74, 44, 4);

      // Shop interior recess
      ctx.fillStyle = '#292524';
      ctx.fillRect(s.x + 3, 78, 38, 30);

      // Wooden counter & displayed goods
      ctx.fillStyle = '#784826';
      ctx.fillRect(s.x + 2, 108, 40, 24);
      ctx.fillStyle = '#a46a3f';
      ctx.fillRect(s.x + 1, 104, 42, 5);
      // 3 distinct product crates/displays per shop
      s.goods.forEach((gColor, gi) => {
        ctx.fillStyle = gColor;
        ctx.fillRect(s.x + 5 + gi * 12, 95, 10, 9);
      });
    });
  });

  // =========================================================================
  // 4. VILLAGE RAILWAY STATION (264x160) — Classic Indian Station + Clock Tower
  // =========================================================================
  makeSprite('bldg_railway_station', 264, 160, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(10, 140, 246, 14);

    // Classic Indian Railway ochre-cream facade
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(16, 62, 232, 80);
    ctx.fillStyle = '#e7d39c';
    ctx.fillRect(236, 62, 12, 80);
    // Maroon railway lower dado band
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(16, 122, 232, 16);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(12, 136, 240, 8);

    // Terracotta station roof & overhanging platform canopy
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(8, 38, 248, 26);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(14, 42, 236, 10);
    ctx.fillStyle = '#475569';
    ctx.fillRect(6, 64, 252, 6);

    // Central Station Clock Tower!
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(106, 6, 52, 58);
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(102, 2, 60, 8);
    // Round Station Clock Face
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(132, 32, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(132, 32, 12, 0, Math.PI * 2);
    ctx.fill();
    // Clock hands (10:10)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(131, 24, 2, 9);
    ctx.fillRect(131, 31, 7, 2);

    // Iconic Yellow Indian Railway Station Name Board
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(92, 66, 80, 18);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(94, 68, 76, 14);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(102, 73, 60, 4);

    // Arched Station Waiting Entrance (center)
    ctx.fillStyle = '#3b1f0e';
    ctx.fillRect(114, 92, 36, 46);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(118, 96, 28, 42);

    // Ticket Counter Window (left)
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(32, 82, 48, 30);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(35, 85, 42, 20);
    ctx.fillStyle = '#334155';
    ctx.fillRect(46, 85, 2, 20);
    ctx.fillRect(62, 85, 2, 20);
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(30, 108, 52, 5); // Counter ledge

    // Live Train Timetable Display Board (right)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(182, 82, 50, 32);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(186, 87, 36, 3);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(186, 94, 40, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(186, 101, 32, 3);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(186, 107, 38, 3);
  });

  // =========================================================================
  // 5. ANIMATED VILLAGE EXPRESS TRAIN SPRITE (240x54)
  // =========================================================================
  makeSprite('prop_train', 240, 54, (ctx) => {
    // Shadow along track
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.fillRect(6, 42, 228, 8);

    // Wheels (Locomotive + 2 Passenger Coaches)
    const wheels = [18, 38, 62, 86, 106, 134, 158, 178, 206, 224];
    wheels.forEach((wx) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(wx, 38, 10, 10);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(wx + 3, 41, 4, 4);
    });

    // Locomotive Engine (Right front — facing East; flipX for West!)
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(172, 10, 62, 30);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(174, 12, 56, 18);
    ctx.fillStyle = '#facc15'; // Iconic yellow nose stripe
    ctx.fillRect(172, 26, 62, 5);
    // Cab window & glowing headlight
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(210, 14, 16, 10);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(231, 20, 5, 8);
    ctx.fillStyle = '#475569';
    ctx.fillRect(184, 4, 30, 6); // Roof pantograph/vents

    // Couplings
    ctx.fillStyle = '#334155';
    ctx.fillRect(164, 28, 10, 4);
    ctx.fillRect(82, 28, 10, 4);

    // Passenger Coach 1 & Coach 2 (Classic Indian Railway Blue!)
    [88, 6].forEach((cx) => {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(cx, 12, 76, 28);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(cx + 2, 14, 72, 18);
      ctx.fillStyle = '#e2e8f0'; // Roof top
      ctx.fillRect(cx + 2, 10, 72, 4);
      ctx.fillStyle = '#93c5fd'; // Stripe
      ctx.fillRect(cx, 27, 76, 3);
      // Windows
      for (let wx = cx + 6; wx < cx + 66; wx += 13) {
        ctx.fillStyle = '#fef9c3';
        ctx.fillRect(wx, 17, 9, 8);
      }
    });
  });
}
