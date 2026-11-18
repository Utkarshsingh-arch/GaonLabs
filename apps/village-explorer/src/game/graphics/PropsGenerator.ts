import Phaser from 'phaser';

/**
 * Generates crisp 2.5D pixel-art environmental decoration sprites
 * (benches, street lamps, signposts, haystacks, flower beds, earthen pots, stones).
 */
export function generateEnvironmentProps(scene: Phaser.Scene): void {
  const makeCanvas = (key: string, w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) => {
    if (scene.textures.exists(key)) return;
    const c = scene.textures.createCanvas(key, w, h);
    if (!c) return;
    const ctx = c.getContext();
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    c.refresh();
  };

  // 1. Wooden Village Bench (36x24)
  makeCanvas('prop_bench', 36, 24, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.26)';
    ctx.fillRect(3, 18, 30, 5);
    // Legs
    ctx.fillStyle = '#4a2c16';
    ctx.fillRect(5, 13, 4, 8);
    ctx.fillRect(27, 13, 4, 8);
    // Backrest slats
    ctx.fillStyle = '#8b5a2b';
    ctx.fillRect(3, 4, 30, 4);
    ctx.fillStyle = '#a97142';
    ctx.fillRect(3, 4, 30, 2);
    ctx.fillStyle = '#754922';
    ctx.fillRect(3, 9, 30, 3);
    // Seat plank
    ctx.fillStyle = '#9c6635';
    ctx.fillRect(2, 12, 32, 4);
    ctx.fillStyle = '#b9824f';
    ctx.fillRect(2, 12, 32, 2);
  });

  // 2. Village Solar Street Lamp (24x52)
  makeCanvas('prop_lamp', 24, 52, (ctx) => {
    // Ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(12, 48, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // Soft warm glow halo at top
    ctx.fillStyle = 'rgba(253, 224, 71, 0.22)';
    ctx.beginPath();
    ctx.arc(12, 12, 11, 0, Math.PI * 2);
    ctx.fill();
    // Base & pole
    ctx.fillStyle = '#334155';
    ctx.fillRect(8, 43, 8, 5);
    ctx.fillStyle = '#475569';
    ctx.fillRect(10, 14, 4, 30);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(10, 14, 1, 30);
    // Mini solar cap on lamp
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(6, 4, 12, 4);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(7, 5, 10, 2);
    // Lantern housing & warm bulb
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 8, 8, 7);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(9, 9, 6, 5);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(11, 10, 2, 3);
  });

  // 3. Wooden Directional Signpost (28x36)
  makeCanvas('prop_signpost', 28, 36, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(8, 31, 12, 4);
    ctx.fillStyle = '#5c3a21';
    ctx.fillRect(12, 12, 4, 21);
    // Arrow boards
    ctx.fillStyle = '#a46a3f';
    ctx.fillRect(4, 6, 18, 6);
    ctx.fillStyle = '#c58b5c';
    ctx.fillRect(5, 7, 15, 2);
    ctx.fillStyle = '#8b5730';
    ctx.fillRect(8, 14, 16, 6);
    ctx.fillStyle = '#b67d4f';
    ctx.fillRect(9, 15, 13, 2);
  });

  // 4. Golden Haystack (34x30)
  makeCanvas('prop_haystack', 34, 30, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(17, 26, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#b45309';
    ctx.fillRect(4, 14, 26, 12);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(6, 9, 22, 14);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(9, 5, 16, 12);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(12, 6, 10, 5);
    // Straw texture dashes
    ctx.fillStyle = '#92400e';
    ctx.fillRect(8, 18, 4, 2);
    ctx.fillRect(18, 15, 5, 2);
    ctx.fillRect(13, 22, 6, 2);
  });

  // 5. Terracotta Water Pots Cluster (24x22)
  makeCanvas('prop_pots', 24, 22, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    ctx.fillRect(3, 17, 18, 4);
    // Big pot
    ctx.fillStyle = '#9a3412';
    ctx.fillRect(4, 9, 10, 9);
    ctx.fillStyle = '#c2410c';
    ctx.fillRect(5, 8, 8, 8);
    ctx.fillStyle = '#ea580c';
    ctx.fillRect(6, 9, 4, 4);
    ctx.fillStyle = '#7c2d12';
    ctx.fillRect(6, 6, 6, 2);
    // Small pot
    ctx.fillStyle = '#b45309';
    ctx.fillRect(13, 12, 7, 6);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(14, 11, 5, 5);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(14, 10, 5, 2);
  });

  // 6. Decorative Stone Cluster (26x18)
  makeCanvas('prop_stones', 26, 18, (ctx) => {
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.fillRect(3, 13, 20, 4);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(4, 6, 12, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(5, 5, 10, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(6, 5, 6, 2);
    ctx.fillStyle = '#475569';
    ctx.fillRect(15, 9, 8, 6);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(16, 8, 6, 4);
  });

  // 7. Flowering Garden Patch (30x20)
  makeCanvas('prop_flowers', 30, 20, (ctx) => {
    ctx.fillStyle = '#166534';
    ctx.fillRect(3, 8, 24, 9);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(5, 6, 20, 8);
    const blooms = [
      { x: 6, y: 5, c: '#facc15' },
      { x: 12, y: 8, c: '#f97316' },
      { x: 18, y: 4, c: '#f472b6' },
      { x: 22, y: 9, c: '#fef08a' },
      { x: 9, y: 11, c: '#ef4444' },
    ];
    blooms.forEach((b) => {
      ctx.fillStyle = b.c;
      ctx.fillRect(b.x, b.y, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(b.x + 1, b.y + 1, 2, 2);
    });
  });

  // 8. Shimmering Water Ripple Overlay (32x16) for subtle ambient animation
  makeCanvas('prop_water_glint', 32, 16, (ctx) => {
    ctx.fillStyle = 'rgba(224, 242, 254, 0.55)';
    ctx.fillRect(4, 4, 10, 2);
    ctx.fillRect(18, 10, 10, 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillRect(7, 4, 4, 2);
  });
}
