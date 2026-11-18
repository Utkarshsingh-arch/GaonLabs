import Phaser from 'phaser';

export const TILESET_TILE_COUNT = 26;
export const TILE_PX = 32;

/**
 * Generates a rich 2.5D pixel-art tileset (24 tiles x 32px = 768x32)
 * using deterministic pseudo-random pixel patterns for natural texture.
 */
export function generateVillageTileset(scene: Phaser.Scene): void {
  if (scene.textures.exists('village_tiles')) return;

  const width = TILESET_TILE_COUNT * TILE_PX;
  const canvas = scene.textures.createCanvas('village_tiles', width, TILE_PX);
  if (!canvas) return;
  const ctx = canvas.getContext();
  ctx.imageSmoothingEnabled = false;

  // Deterministic LCG for crisp reproducible pixel textures
  const makeRng = (seed: number) => {
    let s = seed >>> 0;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  };

  const px = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
  };

  const drawGrassBase = (ox: number, seed: number) => {
    const rng = makeRng(seed);
    // Warm sunlit rural meadow base
    px(ox, 0, 32, 32, '#4a8b3f');
    // Subtle dappled pixel patches (2x2 pixel grid for indie pixel-art look)
    const palette = ['#448239', '#529645', '#3f7934', '#589e4a'];
    for (let gy = 0; gy < 32; gy += 2) {
      for (let gx = 0; gx < 32; gx += 2) {
        const r = rng();
        if (r < 0.32) {
          px(ox + gx, gy, 2, 2, palette[Math.floor(rng() * palette.length)]);
        }
      }
    }
    // Crisp grass blades
    for (let i = 0; i < 6; i++) {
      const bx = Math.floor(rng() * 26) + 2;
      const by = Math.floor(rng() * 24) + 4;
      px(ox + bx, by, 2, 4, '#36692d');
      px(ox + bx + 2, by - 2, 2, 4, '#66ae52');
    }
  };

  const drawDirtBase = (ox: number, seed: number) => {
    const rng = makeRng(seed);
    px(ox, 0, 32, 32, '#c8a16b');
    const shades = ['#bd945d', '#d3ae79', '#b08650', '#dfc08e'];
    for (let gy = 0; gy < 32; gy += 2) {
      for (let gx = 0; gx < 32; gx += 2) {
        if (rng() < 0.42) {
          px(ox + gx, gy, 2, 2, shades[Math.floor(rng() * shades.length)]);
        }
      }
    }
    // Small pebbles & gravel
    for (let i = 0; i < 6; i++) {
      const sx = Math.floor(rng() * 26) + 2;
      const sy = Math.floor(rng() * 26) + 2;
      px(ox + sx, sy, 2, 2, '#8b6840');
      px(ox + sx, sy - 1, 2, 1, '#e6cba0');
    }
  };

  // --- TILE 1 (idx 0): Rich Meadow Grass ---
  drawGrassBase(0, 101);

  // --- TILE 2 (idx 1): Grass Variant A (Lush tufts & soft clover) ---
  {
    const ox = 1 * 32;
    drawGrassBase(ox, 202);
    // Clumps of richer green
    px(ox + 6, 8, 6, 4, '#3d7433');
    px(ox + 8, 6, 4, 2, '#6cb857');
    px(ox + 18, 20, 6, 4, '#3d7433');
    px(ox + 20, 18, 4, 2, '#6cb857');
    px(ox + 24, 6, 4, 4, '#5fa84d');
  }

  // --- TILE 3 (idx 2): Grass Variant B (Wildflowers) ---
  {
    const ox = 2 * 32;
    drawGrassBase(ox, 303);
    // Tiny pixel wildflowers (marigold yellow, white daisy, pink)
    const flowers = [
      { x: 6, y: 10, c: '#fde047', center: '#d97706' },
      { x: 22, y: 8, c: '#fef9c3', center: '#f59e0b' },
      { x: 14, y: 22, c: '#f472b6', center: '#fef08a' },
      { x: 26, y: 24, c: '#fde047', center: '#b45309' },
    ];
    flowers.forEach((f) => {
      px(ox + f.x, f.y + 2, 2, 3, '#2d5c25');
      px(ox + f.x - 1, f.y, 4, 2, f.c);
      px(ox + f.x, f.y - 1, 2, 4, f.c);
      px(ox + f.x, f.y, 2, 2, f.center);
    });
  }

  // --- TILE 4 (idx 3): Grass Variant C (Sunlit dappled grass) ---
  {
    const ox = 3 * 32;
    drawGrassBase(ox, 404);
    px(ox + 4, 4, 10, 8, 'rgba(163, 230, 53, 0.14)');
    px(ox + 16, 16, 12, 10, 'rgba(163, 230, 53, 0.12)');
    px(ox + 10, 14, 2, 4, '#79c25b');
    px(ox + 22, 10, 2, 4, '#79c25b');
  }

  // --- TILE 5 (idx 4): Dirt Road Center (Textured Earth & Wheel Ruts) ---
  {
    const ox = 4 * 32;
    drawDirtBase(ox, 505);
    // Subtle warm worn tracks
    px(ox, 8, 32, 2, 'rgba(139, 98, 52, 0.25)');
    px(ox, 22, 32, 2, 'rgba(139, 98, 52, 0.25)');
  }

  // --- TILE 6 (idx 5): Dirt Road Horizontal (Natural Irregular Grass Borders Top/Bottom) ---
  {
    const ox = 5 * 32;
    drawDirtBase(ox, 606);
    const rng = makeRng(616);
    // Irregular grassy top & bottom edge
    for (let gx = 0; gx < 32; gx += 2) {
      const topH = 2 + Math.floor(rng() * 4);
      const botH = 2 + Math.floor(rng() * 4);
      px(ox + gx, 0, 2, topH, '#4a8b3f');
      px(ox + gx, topH, 2, 2, '#9a784c'); // Soft dirt shoulder shadow
      px(ox + gx, 32 - botH, 2, botH, '#4a8b3f');
      px(ox + gx, 32 - botH - 2, 2, 2, '#9a784c');
    }
    // Occasional tiny roadside grass blade & pebble
    px(ox + 8, 4, 2, 2, '#5da64d');
    px(ox + 22, 26, 2, 2, '#5da64d');
    px(ox + 14, 14, 3, 2, '#8b6840');
    px(ox + 26, 18, 2, 2, '#e2c799');
  }

  // --- TILE 7 (idx 6): Dirt Road Vertical (Natural Irregular Grass Borders Left/Right) ---
  {
    const ox = 6 * 32;
    drawDirtBase(ox, 707);
    const rng = makeRng(717);
    for (let gy = 0; gy < 32; gy += 2) {
      const leftW = 2 + Math.floor(rng() * 4);
      const rightW = 2 + Math.floor(rng() * 4);
      px(ox, gy, leftW, 2, '#4a8b3f');
      px(ox + leftW, gy, 2, 2, '#9a784c');
      px(ox + 32 - rightW, gy, rightW, 2, '#4a8b3f');
      px(ox + 32 - rightW - 2, gy, 2, 2, '#9a784c');
    }
    px(ox + 10, 0, 2, 32, 'rgba(139, 98, 52, 0.22)');
    px(ox + 20, 0, 2, 32, 'rgba(139, 98, 52, 0.22)');
  }

  // --- TILE 8 (idx 7): Dirt Road Intersection / Gravel Junction ---
  {
    const ox = 7 * 32;
    drawDirtBase(ox, 808);
    // Warm compacted stone dust in center
    px(ox + 6, 6, 20, 20, 'rgba(227, 202, 160, 0.28)');
    px(ox + 4, 4, 2, 2, '#7d5e3a');
    px(ox + 26, 4, 2, 2, '#7d5e3a');
    px(ox + 4, 26, 2, 2, '#7d5e3a');
    px(ox + 26, 26, 2, 2, '#7d5e3a');
  }

  // --- TILE 9 (idx 8): Village Paved Cobblestone (Central Chowk & Market) ---
  {
    const ox = 8 * 32;
    px(ox, 0, 32, 32, '#8b8378'); // Mortar
    const stones = [
      { x: 1, y: 1, w: 14, h: 9, c: '#bfb6a8' },
      { x: 17, y: 1, w: 14, h: 9, c: '#c9c0b1' },
      { x: 1, y: 12, w: 9, h: 8, c: '#c4bba9' },
      { x: 12, y: 12, w: 12, h: 8, c: '#b5ac9d' },
      { x: 26, y: 12, w: 5, h: 8, c: '#c9c0b1' },
      { x: 1, y: 22, w: 15, h: 9, c: '#b9b0a1' },
      { x: 18, y: 22, w: 13, h: 9, c: '#c6bdae' },
    ];
    stones.forEach((s) => {
      px(ox + s.x, s.y, s.w, s.h, s.c);
      px(ox + s.x, s.y, s.w, 2, '#ddd6c7'); // Top bevel highlight
      px(ox + s.x, s.y + s.h - 1, s.w, 1, '#9c9385'); // Bottom edge shadow
    });
  }

  // --- TILE 10 (idx 9): Deep Village Pond Water ---
  {
    const ox = 9 * 32;
    px(ox, 0, 32, 32, '#1d7fa8');
    px(ox, 0, 32, 12, '#1b769d');
    // Pixel ripples
    px(ox + 4, 6, 10, 2, '#5bc0eb');
    px(ox + 18, 14, 10, 2, '#5bc0eb');
    px(ox + 6, 24, 12, 2, '#7dd3fc');
    px(ox + 12, 10, 6, 2, '#145e7e');
    px(ox + 20, 22, 8, 2, '#145e7e');
  }

  // --- TILE 11 (idx 10): Water with Lily Pads & Lotus ---
  {
    const ox = 10 * 32;
    px(ox, 0, 32, 32, '#1d7fa8');
    px(ox + 3, 24, 10, 2, '#5bc0eb');
    // Lily pad 1
    px(ox + 6, 6, 10, 8, '#2f855a');
    px(ox + 8, 5, 6, 10, '#38a169');
    px(ox + 12, 9, 4, 2, '#1d7fa8'); // Notch
    // Tiny pink lotus flower
    px(ox + 9, 7, 4, 3, '#f472b6');
    px(ox + 10, 6, 2, 2, '#fbcfe8');
    // Lily pad 2
    px(ox + 20, 18, 8, 6, '#2f855a');
    px(ox + 22, 17, 4, 8, '#48bb78');
  }

  // --- TILE 12 (idx 11): Water Bank / Shallow Shore ---
  {
    const ox = 11 * 32;
    px(ox, 0, 32, 32, '#3498bc');
    px(ox, 0, 32, 6, '#c2a679'); // Sandy shore rim
    px(ox, 0, 32, 3, '#4a8b3f'); // Grass fringe
    px(ox + 4, 6, 10, 2, '#93e1f8'); // Foam highlight
    px(ox + 18, 7, 10, 2, '#93e1f8');
    px(ox + 8, 18, 12, 2, '#5bc0eb');
  }

  // --- TILE 13 (idx 12): Farmland Furrows (Fresh Sprouts) ---
  {
    const ox = 12 * 32;
    px(ox, 0, 32, 32, '#6b442a');
    for (let row = 0; row < 4; row++) {
      const ry = row * 8;
      px(ox, ry, 32, 3, '#4f301d'); // Deep furrow trough
      px(ox, ry + 3, 32, 2, '#7d5235'); // Sunlit ridge
      // Cute green crop sprouts
      for (let cx = 4; cx < 30; cx += 8) {
        px(ox + cx, ry + 1, 2, 4, '#4d7c0f');
        px(ox + cx - 1, ry, 4, 2, '#84cc16');
      }
    }
  }

  // --- TILE 14 (idx 13): Farmland Golden Crop (Ragi / Wheat) ---
  {
    const ox = 13 * 32;
    px(ox, 0, 32, 32, '#6b442a');
    for (let row = 0; row < 4; row++) {
      const ry = row * 8;
      px(ox, ry + 5, 32, 3, '#4f301d');
      for (let cx = 2; cx < 30; cx += 6) {
        px(ox + cx, ry + 1, 2, 6, '#a16207');
        px(ox + cx - 1, ry, 4, 3, '#eab308');
        px(ox + cx, ry, 2, 2, '#fef08a');
      }
    }
  }

  // --- TILE 15 (idx 14): Farmland Leafy Vegetables ---
  {
    const ox = 14 * 32;
    px(ox, 0, 32, 32, '#5c3a23');
    for (let row = 0; row < 3; row++) {
      const ry = row * 10 + 2;
      px(ox, ry + 6, 32, 3, '#422818');
      for (let cx = 3; cx < 28; cx += 9) {
        px(ox + cx, ry, 6, 6, '#15803d');
        px(ox + cx + 1, ry - 1, 4, 4, '#22c55e');
        px(ox + cx + 2, ry, 2, 2, '#86efac');
      }
    }
  }

  // --- TILE 16 (idx 15): Farmland Irrigation Channel ---
  {
    const ox = 15 * 32;
    px(ox, 0, 32, 32, '#6b442a');
    px(ox, 10, 32, 12, '#4a2e1b'); // Mud banks
    px(ox, 12, 32, 8, '#0284c7'); // Flowing irrigation water
    px(ox + 4, 14, 10, 2, '#7dd3fc');
    px(ox + 18, 16, 10, 2, '#7dd3fc');
  }

  // --- TILE 17 (idx 16): Village Garden / Flowerbed ---
  {
    const ox = 16 * 32;
    drawGrassBase(ox, 1700);
    // Raised timber garden border
    px(ox + 2, 2, 28, 28, '#784c2a');
    px(ox + 4, 4, 24, 24, '#543520');
    // Colorful marigold & rose rows
    const colors = ['#f97316', '#facc15', '#ec4899', '#ef4444'];
    for (let gy = 6; gy < 24; gy += 6) {
      for (let gx = 6; gx < 24; gx += 6) {
        px(ox + gx, gy + 2, 4, 3, '#166534');
        px(ox + gx + 1, gy, 3, 3, colors[(gx + gy) % colors.length]);
      }
    }
  }

  // --- TILE 18 (idx 17): Stone Courtyard / Porch Tile ---
  {
    const ox = 17 * 32;
    px(ox, 0, 32, 32, '#a8a29e');
    px(ox + 1, 1, 14, 14, '#d6d3d1');
    px(ox + 17, 1, 14, 14, '#e7e5e4');
    px(ox + 1, 17, 14, 14, '#e7e5e4');
    px(ox + 17, 17, 14, 14, '#d6d3d1');
    px(ox + 2, 2, 12, 2, '#f5f5f4');
    px(ox + 18, 18, 12, 2, '#f5f5f4');
  }

  // --- TILE 19 (idx 18): Wooden Fence Horizontal ---
  {
    const ox = 18 * 32;
    drawGrassBase(ox, 1900);
    px(ox, 20, 32, 4, 'rgba(0,0,0,0.22)'); // Ground shadow
    px(ox, 10, 32, 3, '#8d5b34');
    px(ox, 16, 32, 3, '#8d5b34');
    px(ox + 4, 6, 4, 16, '#6d4425');
    px(ox + 4, 6, 4, 2, '#a9744a');
    px(ox + 22, 6, 4, 16, '#6d4425');
    px(ox + 22, 6, 4, 2, '#a9744a');
  }

  // --- TILE 20 (idx 19): Wooden Fence Vertical ---
  {
    const ox = 19 * 32;
    drawGrassBase(ox, 2000);
    px(ox + 16, 0, 4, 32, 'rgba(0,0,0,0.2)');
    px(ox + 12, 0, 4, 32, '#8d5b34');
    px(ox + 11, 4, 6, 6, '#6d4425');
    px(ox + 11, 4, 6, 2, '#a9744a');
    px(ox + 11, 20, 6, 6, '#6d4425');
    px(ox + 11, 20, 6, 2, '#a9744a');
  }

  // --- TILE 21 (idx 20): Invisible Collision Blocker (Transparent) ---
  // Left completely transparent so Obstacles layer blocks movement without drawing ugly blocks!

  // --- TILE 22 (idx 21): Soft Gravel / Courtyard Path ---
  {
    const ox = 21 * 32;
    drawGrassBase(ox, 2200);
    // Stepping stones in grass
    px(ox + 6, 4, 10, 8, '#a8a29e');
    px(ox + 7, 5, 8, 5, '#d6d3d1');
    px(ox + 16, 18, 10, 8, '#a8a29e');
    px(ox + 17, 19, 8, 5, '#e7e5e4');
  }

  // --- TILE 23 (idx 22): Wooden Bridge over Stream ---
  {
    const ox = 22 * 32;
    px(ox, 0, 32, 32, '#1d7fa8'); // Water underneath
    px(ox, 2, 32, 28, '#784826'); // Bridge frame
    for (let bx = 2; bx < 30; bx += 6) {
      px(ox + bx, 4, 5, 24, '#a46a3f');
      px(ox + bx, 4, 5, 2, '#c58b5c');
    }
    // Top & bottom bridge guard rails
    px(ox, 2, 32, 3, '#573318');
    px(ox, 27, 32, 3, '#573318');
  }

  // --- TILE 24 (idx 23): Sandy Riverbank / Pebble Ground ---
  {
    const ox = 23 * 32;
    const rng = makeRng(2400);
    px(ox, 0, 32, 32, '#d8c29d');
    for (let i = 0; i < 18; i++) {
      const rx = Math.floor(rng() * 28) + 2;
      const ry = Math.floor(rng() * 28) + 2;
      px(ox + rx, ry, 2, 2, rng() > 0.5 ? '#c4aa80' : '#ead9ba');
    }
  }

  // --- TILE 25 (idx 24): Railway Tracks on Gravel Ballast ---
  {
    const ox = 24 * 32;
    const rng = makeRng(2500);
    px(ox, 0, 32, 32, '#78716c'); // Crushed stone ballast
    for (let i = 0; i < 24; i++) {
      const gx = Math.floor(rng() * 30);
      const gy = Math.floor(rng() * 30);
      px(ox + gx, gy, 2, 2, rng() > 0.5 ? '#a8a29e' : '#57534e');
    }
    // Wooden railway sleepers (ties)
    for (let sx = 2; sx < 32; sx += 8) {
      px(ox + sx, 4, 4, 24, '#5c3a21');
      px(ox + sx, 4, 4, 2, '#784826');
    }
    // Twin parallel steel rails with metallic sheen
    px(ox, 8, 32, 3, '#334155');
    px(ox, 8, 32, 1, '#cbd5e1');
    px(ox, 21, 32, 3, '#334155');
    px(ox, 21, 32, 1, '#cbd5e1');
  }

  // --- TILE 26 (idx 25): Railway Station Platform (Concrete + Yellow Safety Line) ---
  {
    const ox = 25 * 32;
    px(ox, 0, 32, 32, '#cbd5e1');
    px(ox, 0, 32, 2, '#e2e8f0');
    px(ox + 15, 0, 2, 24, '#94a3b8'); // Slab seam
    // Iconic yellow safety edge strip near track
    px(ox, 25, 32, 4, '#facc15');
    px(ox, 29, 32, 3, '#475569'); // Platform curb drop
  }

  // Register individual frames 1..26 for Phaser Tiled compatibility
  for (let i = 0; i < TILESET_TILE_COUNT; i++) {
    canvas.add(i + 1, 0, i * TILE_PX, 0, TILE_PX, TILE_PX);
  }

  canvas.refresh();
}
