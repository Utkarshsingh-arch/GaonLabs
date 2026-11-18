import Phaser from 'phaser';

/**
 * Generates crisp 2.5D pixel-art building sprites for:
 * - All 6 Core Living Labs (house, well, farm_shed, tank, solar, soil)
 * - All 7 New Interactive Learning Houses (math_house, physics_house, biology_house,
 *   chemistry_house, engineering_workshop, weather_station, math_market)
 * - Village Residential Cottages (cottage_terracotta, cottage_thatch)
 */
export function generateBuildingSprites(scene: Phaser.Scene): void {
  const makeSprite = (
    key: string,
    w: number,
    h: number,
    draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
  ) => {
    if (scene.textures.exists(key)) return;
    const c = scene.textures.createCanvas(key, w, h);
    if (!c) return;
    const ctx = c.getContext();
    ctx.imageSmoothingEnabled = false;
    draw(ctx, w, h);
    c.refresh();
  };

  // Reusable architectural drawing primitives
  const drawShadow = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(15, 23, 15, 0.16)';
    ctx.fillRect(x + 4, y + h, w - 4, 4);
  };

  const drawTiledRoof = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    base: string,
    highlight: string,
    dark: string,
    ridge: string
  ) => {
    // Sloped trapezoidal gable roof with visible eaves depth
    const steps = 6;
    for (let s = 0; s < steps; s++) {
      const inset = Math.floor((steps - 1 - s) * 2.5);
      const sy = y + Math.floor((s * h) / steps);
      const sh = Math.ceil(h / steps) + 1;
      ctx.fillStyle = s % 2 === 0 ? base : dark;
      ctx.fillRect(x + inset, sy, w - inset * 2, sh);
      // Horizontal tile scallop highlights
      ctx.fillStyle = highlight;
      for (let tx = x + inset + 3; tx < x + w - inset - 5; tx += 10) {
        ctx.fillRect(tx, sy + 1, 6, 2);
      }
    }
    // Roof ridge beam along top
    ctx.fillStyle = ridge;
    ctx.fillRect(x + 12, y - 2, w - 24, 5);
    ctx.fillStyle = highlight;
    ctx.fillRect(x + 14, y - 1, w - 28, 2);
    // Deep eaves overhang shadow under roof
    ctx.fillStyle = 'rgba(0,0,0,0.32)';
    ctx.fillRect(x + 2, y + h, w - 4, 5);
  };

  const drawWindow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    shutterColor = '#5c3a21',
    glassColor = '#bae6fd'
  ) => {
    // Shutters
    ctx.fillStyle = shutterColor;
    ctx.fillRect(x - 3, y, 3, h);
    ctx.fillRect(x + w, y, 3, h);
    // Frame
    ctx.fillStyle = '#472d18';
    ctx.fillRect(x, y, w, h);
    // Glass pane with reflection
    ctx.fillStyle = glassColor;
    ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(x + 3, y + 3, Math.max(2, Math.floor(w / 3)), 3);
    // Cross muntins
    ctx.fillStyle = '#472d18';
    ctx.fillRect(x + Math.floor(w / 2) - 1, y + 1, 2, h - 2);
    ctx.fillRect(x + 1, y + Math.floor(h / 2) - 1, w - 2, 2);
    // Window sill
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(x - 2, y + h, w + 4, 3);
  };

  const drawDoor = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    wood = '#783f1d'
  ) => {
    // Stone doorstep
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(x - 4, y + h - 1, w + 8, 5);
    ctx.fillStyle = '#d1d5db';
    ctx.fillRect(x - 3, y + h - 1, w + 6, 2);
    // Jamb
    ctx.fillStyle = '#3b1f0e';
    ctx.fillRect(x - 2, y - 2, w + 4, h + 2);
    // Door panels
    ctx.fillStyle = wood;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#5c2e13';
    ctx.fillRect(x + 3, y + 3, w - 6, Math.floor(h * 0.42));
    ctx.fillRect(x + 3, y + Math.floor(h * 0.54), w - 6, Math.floor(h * 0.36));
    // Brass handle
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + w - 5, y + Math.floor(h * 0.5), 2, 3);
  };

  const drawWallTexture = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    base: string,
    shade: string,
    plinth = '#78716c'
  ) => {
    ctx.fillStyle = base;
    ctx.fillRect(x, y, w, h);
    // Side depth shading (2.5D right wall ambient shadow)
    ctx.fillStyle = shade;
    ctx.fillRect(x + w - 10, y, 10, h);
    // Subtle plaster/brick accents
    ctx.fillStyle = shade;
    for (let by = y + 8; by < y + h - 10; by += 10) {
      ctx.fillRect(x + 6, by, 8, 2);
      ctx.fillRect(x + w - 26, by + 4, 8, 2);
    }
    // Stone foundation plinth at base
    ctx.fillStyle = plinth;
    ctx.fillRect(x - 1, y + h - 8, w + 2, 8);
    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.fillRect(x, y + h - 8, w, 2);
  };

  // =========================================================================
  // 1. VILLAGE HOUSE LAB (Whitewashed Cool-Roof Rural Home + Rainwater Barrel)
  // =========================================================================
  makeSprite('bldg_house', 168, 148, (ctx) => {
    drawShadow(ctx, 14, 126, 148, 16);
    // Whitewashed lime walls (reflects solar heat - NCERT theme!)
    drawWallTexture(ctx, 16, 68, 132, 64, '#f5f0e6', '#e2d9c8', '#8c7a6b');
    // Traditional painted border band near base
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(16, 118, 132, 6);
    // Terracotta tiled roof with solar-reflective lime ridge
    drawTiledRoof(ctx, 6, 18, 152, 54, '#c2410c', '#ea580c', '#9a3412', '#fef3c7');
    // Rainwater gutter & downspout pipe into blue harvesting barrel
    ctx.fillStyle = '#64748b';
    ctx.fillRect(8, 70, 148, 3);
    ctx.fillRect(148, 70, 4, 38);
    // Rainwater harvesting barrel
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(142, 104, 18, 26);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(144, 106, 10, 22);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(144, 104, 14, 3);
    // Ventilation high louver windows (convection!)
    ctx.fillStyle = '#334155';
    ctx.fillRect(66, 74, 32, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(68, 76, 28, 2);
    // Door & paned windows
    drawDoor(ctx, 70, 92, 24, 38, '#7c3f1c');
    drawWindow(ctx, 30, 88, 22, 20, '#0f766e');
    drawWindow(ctx, 112, 88, 22, 20, '#0f766e');
    // Flower boxes under windows
    ctx.fillStyle = '#15803d';
    ctx.fillRect(28, 111, 26, 5);
    ctx.fillRect(110, 111, 26, 5);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(32, 110, 4, 3);
    ctx.fillRect(44, 110, 4, 3);
    ctx.fillRect(114, 110, 4, 3);
    ctx.fillRect(126, 110, 4, 3);
  });

  // =========================================================================
  // 2. COMMUNITY WELL LAB (Circular Stone Masonry Well + Wooden Pulley Frame)
  // =========================================================================
  makeSprite('bldg_well', 104, 112, (ctx) => {
    // Ground shadow & damp splash puddle
    ctx.fillStyle = 'rgba(15, 23, 15, 0.25)';
    ctx.beginPath();
    ctx.ellipse(54, 92, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.beginPath();
    ctx.ellipse(26, 98, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    // Stone base cylinder
    ctx.fillStyle = '#64748b';
    ctx.fillRect(22, 64, 60, 28);
    ctx.fillStyle = '#94a3b8';
    for (let sy = 68; sy < 88; sy += 7) {
      for (let sx = 24; sx < 78; sx += 11) {
        ctx.fillRect(sx + ((sy % 2) * 3), sy, 9, 5);
      }
    }
    // Moss accents
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(26, 84, 10, 4);
    ctx.fillRect(66, 80, 8, 5);
    // Circular parapet rim & deep blue water inside
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.ellipse(52, 64, 32, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0369a1';
    ctx.beginPath();
    ctx.ellipse(52, 64, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(42, 63, 12, 2);
    // Wooden support posts
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(24, 26, 6, 40);
    ctx.fillRect(74, 26, 6, 40);
    // Crossbar & Pulley Wheel!
    ctx.fillStyle = '#784826';
    ctx.fillRect(22, 34, 60, 5);
    // Pulley wheel
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(52, 38, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(52, 38, 3, 0, Math.PI * 2);
    ctx.fill();
    // Rope & Metal Bucket
    ctx.fillStyle = '#d6b482';
    ctx.fillRect(51, 42, 2, 18);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(46, 56, 12, 10);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(47, 57, 4, 8);
    // Pitched shingle canopy over well
    drawTiledRoof(ctx, 14, 8, 76, 22, '#9a3412', '#c2410c', '#7c2d12', '#fde68a');
  });

  // =========================================================================
  // 3. AGRICULTURAL FARM SHED (Thatched Rural Barn + Drip Irrigation Tank)
  // =========================================================================
  makeSprite('bldg_farm', 136, 108, (ctx) => {
    drawShadow(ctx, 10, 88, 120, 14);
    // Timber & mud-plaster barn walls
    drawWallTexture(ctx, 14, 48, 104, 46, '#d6b286', '#b89060', '#785534');
    // Cross-braced barn doors
    ctx.fillStyle = '#6d3b1a';
    ctx.fillRect(46, 60, 38, 34);
    ctx.fillStyle = '#8b4e24';
    ctx.fillRect(49, 63, 15, 29);
    ctx.fillRect(66, 63, 15, 29);
    ctx.fillStyle = '#4a260f';
    ctx.fillRect(64, 60, 2, 34);
    // Thatched golden straw roof
    drawTiledRoof(ctx, 6, 12, 120, 40, '#ca8a04', '#eab308', '#a16207', '#fef08a');
    // Irrigation drip supply barrel beside shed
    ctx.fillStyle = '#0f766e';
    ctx.fillRect(114, 64, 16, 28);
    ctx.fillStyle = '#14b8a6';
    ctx.fillRect(116, 66, 9, 24);
    ctx.fillStyle = '#334155';
    ctx.fillRect(126, 84, 8, 3); // Drip outlet pipe
  });

  // =========================================================================
  // 4. OVERHEAD WATER TANK LAB (Tall 2.5D Concrete Staging Tower & Reservoir)
  // =========================================================================
  makeSprite('bldg_tank', 132, 156, (ctx) => {
    drawShadow(ctx, 16, 132, 102, 16);
    // Concrete base pad
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(20, 122, 92, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(22, 124, 88, 12);
    // 4 Concrete Staging Pillars + horizontal cross-braces
    const legs = [28, 52, 76, 96];
    legs.forEach((lx) => {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(lx, 62, 8, 70);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(lx, 62, 4, 70);
    });
    // Cross-beams
    ctx.fillStyle = '#475569';
    ctx.fillRect(28, 84, 76, 5);
    ctx.fillRect(28, 106, 76, 5);
    // Central vertical blue standpipe + village tap stand at base
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(62, 62, 8, 66);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(64, 62, 3, 66);
    // Ladder up the right side
    ctx.fillStyle = '#334155';
    ctx.fillRect(104, 30, 2, 96);
    ctx.fillRect(110, 30, 2, 96);
    for (let ly = 36; ly < 124; ly += 8) {
      ctx.fillRect(104, ly, 8, 2);
    }
    // Elevated Cylindrical Water Reservoir Tank
    ctx.fillStyle = '#475569';
    ctx.fillRect(20, 24, 92, 42);
    ctx.fillStyle = '#0284c7'; // Blue painted water band
    ctx.fillRect(20, 34, 92, 22);
    ctx.fillStyle = '#38bdf8'; // Specular highlight
    ctx.fillRect(26, 36, 26, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(20, 24, 92, 8);
    // Domed top cap
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.ellipse(66, 24, 46, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(58, 12, 16, 6); // Inspection hatch
  });

  // =========================================================================
  // 5. SOLAR ENERGY LAB (Angled Photovoltaic Panel Array + Inverter Shed)
  // =========================================================================
  makeSprite('bldg_solar', 168, 128, (ctx) => {
    drawShadow(ctx, 10, 104, 150, 16);
    // Concrete mounting slab
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(12, 94, 144, 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(14, 96, 140, 14);
    // Draw 3 large angled photovoltaic panels
    for (let i = 0; i < 3; i++) {
      const px = 16 + i * 36;
      // Metal support struts
      ctx.fillStyle = '#475569';
      ctx.fillRect(px + 6, 76, 4, 24);
      ctx.fillRect(px + 22, 76, 4, 24);
      // Aluminum frame
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(px, 34, 32, 46);
      // Deep PV silicon blue
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(px + 2, 36, 28, 42);
      // Silicon cell grid lines
      ctx.fillStyle = '#3b82f6';
      for (let gy = 42; gy < 76; gy += 8) {
        ctx.fillRect(px + 2, gy, 28, 1);
      }
      for (let gx = px + 9; gx < px + 28; gx += 7) {
        ctx.fillRect(gx, 36, 1, 42);
      }
      // Sunlight diagonal reflection sheen
      ctx.fillStyle = 'rgba(186, 230, 253, 0.45)';
      ctx.fillRect(px + 4, 38, 8, 14);
    }
    // Battery & Inverter Control Box on right
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(126, 46, 30, 54);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(150, 46, 6, 54);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(130, 54, 18, 14); // Digital meter screen
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(133, 58, 12, 6); // Green power readout
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(136, 76, 8, 10); // Lightning decal
  });

  // =========================================================================
  // 6. SOIL CHEMISTRY LAB (Rural Science Hut + Outdoor pH Test Bench)
  // =========================================================================
  makeSprite('bldg_soil', 164, 142, (ctx) => {
    drawShadow(ctx, 12, 120, 142, 16);
    // Earthy sandstone walls
    drawWallTexture(ctx, 16, 64, 126, 62, '#e7d5be', '#cbb498', '#6b5344');
    // Teal corrugated metal / tiled laboratory roof
    drawTiledRoof(ctx, 8, 18, 142, 48, '#0f766e', '#14b8a6', '#115e59', '#99f6e4');
    // Door & lab windows
    drawDoor(ctx, 68, 88, 22, 38, '#5c3a21');
    drawWindow(ctx, 28, 84, 24, 20, '#115e59', '#d1fae5');
    // Outdoor pH Soil Testing Bench on right!
    ctx.fillStyle = '#784826';
    ctx.fillRect(102, 104, 36, 6);
    ctx.fillRect(104, 110, 4, 16);
    ctx.fillRect(132, 110, 4, 16);
    // Colored pH indicator test tubes (Red Acidic, Green Neutral, Blue Alkaline!)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(107, 94, 4, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(113, 94, 4, 10);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(119, 94, 4, 10);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(125, 94, 4, 10);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(131, 94, 4, 10);
  });

  // =========================================================================
  // 7. MATHEMATICS LEARNING HOUSE (Warm Ochre Walls + Geometry Crest & Board)
  // =========================================================================
  makeSprite('bldg_math_house', 164, 144, (ctx) => {
    drawShadow(ctx, 12, 122, 142, 16);
    drawWallTexture(ctx, 16, 66, 130, 62, '#fef3c7', '#e7d39c', '#78716c');
    drawTiledRoof(ctx, 8, 18, 146, 50, '#b45309', '#f59e0b', '#92400e', '#fde68a');
    drawDoor(ctx, 69, 90, 24, 38, '#78350f');
    drawWindow(ctx, 28, 84, 24, 20, '#b45309');
    // Outdoor Geometry Blackboard on right wall!
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(104, 82, 32, 24);
    ctx.fillStyle = '#14532d';
    ctx.fillRect(106, 84, 28, 20);
    // Chalk triangle & π sketch
    ctx.strokeStyle = '#fef9c3';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(111, 100);
    ctx.lineTo(118, 88);
    ctx.lineTo(125, 100);
    ctx.closePath();
    ctx.stroke();
    // Wooden Roof Signboard (Compass / Ruler badge)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(66, 56, 30, 14);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(68, 58, 26, 10);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(73, 60, 16, 2);
    ctx.fillRect(76, 62, 2, 5);
    ctx.fillRect(83, 62, 2, 5);
  });

  // =========================================================================
  // 8. PHYSICS LEARNING HOUSE (Blue-Trimmed Stone + Copper Wind Vane & Ramp)
  // =========================================================================
  makeSprite('bldg_physics_house', 164, 148, (ctx) => {
    drawShadow(ctx, 12, 126, 142, 16);
    drawWallTexture(ctx, 16, 70, 130, 62, '#e2e8f0', '#cbd5e1', '#475569');
    drawTiledRoof(ctx, 8, 22, 146, 50, '#1d4ed8', '#3b82f6', '#1e3a8a', '#bfdbfe');
    // Rooftop Copper Lightning/Wind Vane Rod
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(80, 4, 3, 20);
    ctx.fillRect(72, 10, 19, 3);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(79, 2, 5, 4);
    // Door & arched windows
    drawDoor(ctx, 69, 94, 24, 38, '#1e3a8a');
    drawWindow(ctx, 28, 88, 24, 20, '#1d4ed8', '#fef08a');
    drawWindow(ctx, 110, 88, 24, 20, '#1d4ed8', '#fef08a');
    // Small Wooden Inclined Plane Experiment Prop outside right
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.moveTo(116, 130);
    ctx.lineTo(142, 130);
    ctx.lineTo(142, 118);
    ctx.closePath();
    ctx.fill();
  });

  // =========================================================================
  // 9. BIOLOGY LEARNING HOUSE (Sage Cottage + Glass Greenhouse Bay)
  // =========================================================================
  makeSprite('bldg_biology_house', 168, 144, (ctx) => {
    drawShadow(ctx, 12, 122, 146, 16);
    drawWallTexture(ctx, 16, 66, 94, 62, '#ecfdf5', '#d1fae5', '#57534e');
    // Attached Glass Greenhouse Bay on right!
    ctx.fillStyle = '#15803d';
    ctx.fillRect(108, 74, 44, 54);
    ctx.fillStyle = '#a7f3d0';
    ctx.fillRect(111, 78, 38, 44);
    // Plants inside greenhouse visible through glass
    ctx.fillStyle = '#166534';
    ctx.fillRect(115, 102, 10, 18);
    ctx.fillRect(131, 96, 12, 24);
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(118, 100, 4, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(135, 94, 4, 4);
    // Greenhouse glass mullions
    ctx.fillStyle = '#065f46';
    ctx.fillRect(128, 76, 2, 48);
    ctx.fillRect(110, 96, 40, 2);
    // Main Leaf-Green Cottage Roof
    drawTiledRoof(ctx, 8, 18, 112, 50, '#15803d', '#22c55e', '#166534', '#bbf7d0');
    drawDoor(ctx, 50, 90, 24, 38, '#5c3a21');
    drawWindow(ctx, 22, 86, 20, 18, '#166534');
  });

  // =========================================================================
  // 10. CHEMISTRY LEARNING HOUSE (Sandstone Lab + Chimney Vent & Flask Crest)
  // =========================================================================
  makeSprite('bldg_chemistry_house', 164, 148, (ctx) => {
    drawShadow(ctx, 12, 126, 142, 16);
    // Brick chimney with tiny steam puff
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(116, 8, 16, 36);
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(114, 6, 20, 5);
    ctx.fillStyle = 'rgba(241, 245, 249, 0.7)';
    ctx.fillRect(120, 0, 8, 5);
    drawWallTexture(ctx, 16, 70, 130, 62, '#fae8ff', '#e9d5ff', '#581c87');
    drawTiledRoof(ctx, 8, 22, 146, 50, '#6b21a8', '#9333ea', '#581c87', '#e9d5ff');
    drawDoor(ctx, 69, 94, 24, 38, '#4c1d95');
    drawWindow(ctx, 28, 88, 24, 20, '#6b21a8', '#c4b5fd');
    drawWindow(ctx, 110, 88, 24, 20, '#6b21a8', '#a5f3fc');
    // Glowing Flask Emblem above doorway
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(72, 74, 18, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(78, 76, 6, 5);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(75, 81, 12, 7);
  });

  // =========================================================================
  // 11. ENGINEERING WORKSHOP (Brick & Timber Barn + Gear Wheel Sign)
  // =========================================================================
  makeSprite('bldg_engineering_workshop', 164, 144, (ctx) => {
    drawShadow(ctx, 12, 122, 142, 16);
    drawWallTexture(ctx, 16, 66, 130, 62, '#d97757', '#b85c3e', '#44403c');
    // Timber framing beams
    ctx.fillStyle = '#44403c';
    ctx.fillRect(16, 66, 6, 62);
    ctx.fillRect(140, 66, 6, 62);
    ctx.fillRect(16, 86, 130, 4);
    // Slate Industrial Workshop Roof
    drawTiledRoof(ctx, 8, 18, 146, 50, '#475569', '#64748b', '#334155', '#cbd5e1');
    // Double workshop doors
    drawDoor(ctx, 64, 90, 32, 38, '#451a03');
    drawWindow(ctx, 26, 92, 24, 18, '#334155', '#fde68a');
    drawWindow(ctx, 110, 92, 24, 18, '#334155', '#fde68a');
    // Golden Gear Emblem on gable
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(80, 74, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(80, 74, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // =========================================================================
  // 12. WEATHER STATION (White Louvered Observatory + Spinning Anemometer Mast)
  // =========================================================================
  makeSprite('bldg_weather_station', 140, 148, (ctx) => {
    drawShadow(ctx, 12, 126, 118, 16);
    drawWallTexture(ctx, 18, 72, 98, 60, '#f8fafc', '#e2e8f0', '#64748b');
    // Sky-blue sloped observatory roof
    drawTiledRoof(ctx, 10, 32, 114, 42, '#0284c7', '#38bdf8', '#0369a1', '#e0f2fe');
    // Tall Anemometer & Wind Vane Mast
    ctx.fillStyle = '#334155';
    ctx.fillRect(66, 4, 4, 30);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(52, 8, 32, 3);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(50, 6, 5, 6);
    ctx.fillRect(81, 6, 5, 6);
    // Rain Gauge Cylinder beside building
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(118, 104, 10, 26);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(120, 106, 6, 12);
    // Door & Stevenson screen louver window
    drawDoor(ctx, 56, 94, 22, 38, '#0369a1');
    drawWindow(ctx, 26, 90, 20, 18, '#0284c7');
    drawWindow(ctx, 88, 90, 20, 18, '#0284c7');
  });

  // =========================================================================
  // 13. MATHEMATICS MARKET (Colorful Striped Village Shop + Produce Baskets)
  // =========================================================================
  makeSprite('bldg_math_market', 196, 142, (ctx) => {
    drawShadow(ctx, 10, 120, 178, 16);
    // Warm cream shopfront walls
    drawWallTexture(ctx, 16, 64, 164, 62, '#fff7ed', '#fed7aa', '#9a3412');
    // Shop roof
    drawTiledRoof(ctx, 8, 18, 180, 46, '#dc2626', '#ef4444', '#b91c1c', '#fef2f2');
    // Festive Striped Market Awning overhanging shopfront!
    for (let sx = 14; sx < 178; sx += 16) {
      ctx.fillStyle = ((sx - 14) / 16) % 2 === 0 ? '#ef4444' : '#fef3c7';
      ctx.fillRect(sx, 68, 16, 16);
      ctx.fillStyle = ((sx - 14) / 16) % 2 === 0 ? '#b91c1c' : '#fde68a';
      ctx.fillRect(sx, 82, 16, 4);
    }
    // Shop counter & entrance
    drawDoor(ctx, 86, 90, 24, 36, '#7c2d12');
    // Left Produce Stall (Mangoes, Tomatoes, Greens)
    ctx.fillStyle = '#784826';
    ctx.fillRect(22, 102, 54, 22);
    ctx.fillStyle = '#a46a3f';
    ctx.fillRect(20, 99, 58, 5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(26, 93, 12, 7);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(42, 93, 12, 7);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(58, 93, 12, 7);
    // Right Produce Stall + Brass Balance Scale!
    ctx.fillStyle = '#784826';
    ctx.fillRect(120, 102, 54, 22);
    ctx.fillStyle = '#a46a3f';
    ctx.fillRect(118, 99, 58, 5);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(124, 93, 14, 7);
    // Balance scale
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(154, 88, 2, 12);
    ctx.fillRect(146, 90, 18, 2);
    ctx.fillRect(145, 94, 6, 3);
    ctx.fillRect(159, 94, 6, 3);
  });

  // =========================================================================
  // 14 & 15. COZY VILLAGE RESIDENTIAL COTTAGES (Two Authentic Styles)
  // =========================================================================
  makeSprite('bldg_cottage_a', 136, 128, (ctx) => {
    drawShadow(ctx, 10, 108, 118, 14);
    drawWallTexture(ctx, 14, 56, 108, 56, '#fde68a', '#e6c66a', '#78716c');
    drawTiledRoof(ctx, 6, 16, 124, 42, '#c2410c', '#ea580c', '#9a3412', '#fed7aa');
    drawDoor(ctx, 56, 76, 22, 36, '#7c3f1c');
    drawWindow(ctx, 24, 74, 20, 18, '#9a3412');
    drawWindow(ctx, 90, 74, 20, 18, '#9a3412');
  });

  makeSprite('bldg_cottage_b', 136, 128, (ctx) => {
    drawShadow(ctx, 10, 108, 118, 14);
    drawWallTexture(ctx, 14, 56, 108, 56, '#f1f5f9', '#cbd5e1', '#78716c');
    drawTiledRoof(ctx, 6, 16, 124, 42, '#0d9488', '#2dd4bf', '#115e59', '#ccfbf1');
    drawDoor(ctx, 56, 76, 22, 36, '#5c3a21');
    drawWindow(ctx, 24, 74, 20, 18, '#0f766e');
    drawWindow(ctx, 90, 74, 20, 18, '#0f766e');
  });
}
