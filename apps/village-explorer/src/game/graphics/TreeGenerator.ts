import Phaser from 'phaser';

/**
 * Generates detailed 2.5D pixel-art Indian village trees and vegetation.
 * Every tree has visible textured bark trunks, multi-layered leaf clusters
 * in 4+ shades of green, sunlight highlights, and grounded soft shadows.
 */
export function generateTreeSprites(scene: Phaser.Scene): void {
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

  // Helper to draw organic pixel-art leaf cluster (stair-stepped pixel blob, NOT flat circles)
  const leafCluster = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    for (let y = -ry; y <= ry; y += 2) {
      const span = Math.floor(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry + 1))));
      if (span > 0) {
        ctx.fillRect(Math.floor(cx - span), Math.floor(cy + y), Math.floor(span * 2), 2);
      }
    }
  };

  // 1. GRAND BANYAN TREE (96x96) - Spreading canopy + hanging aerial prop roots!
  makeSprite('tree_banyan', 96, 96, (ctx) => {
    // Wide dappled ground shadow
    ctx.fillStyle = 'rgba(15, 28, 15, 0.28)';
    ctx.beginPath();
    ctx.ellipse(48, 84, 40, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Thick gnarled trunk + flared roots
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(38, 48, 20, 36);
    ctx.fillRect(32, 74, 32, 10);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(42, 48, 8, 34);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(52, 50, 6, 34);

    // Hanging aerial prop roots! (signature Banyan detail)
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(22, 46, 3, 34);
    ctx.fillRect(28, 48, 2, 26);
    ctx.fillRect(68, 48, 3, 32);
    ctx.fillRect(74, 46, 2, 24);

    // Deep canopy underside shadow layer
    leafCluster(ctx, 48, 44, 40, 22, '#14532d');
    leafCluster(ctx, 26, 42, 22, 16, '#14532d');
    leafCluster(ctx, 70, 42, 22, 16, '#14532d');

    // Mid foliage layer
    leafCluster(ctx, 48, 34, 38, 22, '#166534');
    leafCluster(ctx, 24, 36, 20, 14, '#15803d');
    leafCluster(ctx, 72, 36, 20, 14, '#15803d');
    leafCluster(ctx, 48, 22, 26, 16, '#15803d');

    // Sunlit crown highlights (top-left warm light)
    leafCluster(ctx, 36, 22, 18, 11, '#22c55e');
    leafCluster(ctx, 58, 24, 16, 10, '#22c55e');
    leafCluster(ctx, 22, 30, 12, 8, '#4ade80');
    leafCluster(ctx, 44, 16, 14, 7, '#4ade80');

    // Crisp pixel leaf speckle texture
    ctx.fillStyle = '#86efac';
    const specks = [
      [34, 16], [42, 13], [52, 18], [24, 26], [64, 24], [40, 24],
    ];
    specks.forEach(([sx, sy]) => ctx.fillRect(sx, sy, 4, 2));
  });

  // 2. NEEM TREE (72x80) - Graceful tall trunk + feathery layered green clusters
  makeSprite('tree_neem', 72, 80, (ctx) => {
    ctx.fillStyle = 'rgba(15, 28, 15, 0.26)';
    ctx.beginPath();
    ctx.ellipse(36, 70, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ridged slender trunk & forked branches
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(31, 40, 10, 31);
    ctx.fillStyle = '#795548';
    ctx.fillRect(33, 40, 4, 30);
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(26, 38, 8, 6);
    ctx.fillRect(39, 38, 8, 6);

    // Feathery layered canopy
    leafCluster(ctx, 36, 36, 28, 18, '#1b4332');
    leafCluster(ctx, 22, 30, 18, 14, '#2d6a4f');
    leafCluster(ctx, 50, 32, 18, 14, '#2d6a4f');
    leafCluster(ctx, 36, 22, 24, 16, '#40916c');
    leafCluster(ctx, 30, 16, 16, 10, '#52b788');
    leafCluster(ctx, 44, 20, 14, 10, '#52b788');
    leafCluster(ctx, 26, 22, 10, 6, '#74c69d');

    ctx.fillStyle = '#95d5b2';
    ctx.fillRect(28, 12, 4, 2);
    ctx.fillRect(38, 14, 4, 2);
    ctx.fillRect(20, 24, 4, 2);
    ctx.fillRect(46, 20, 4, 2);
  });

  // 3. MANGO TREE (76x80) - Dense orchard crown with golden-orange ripening mangoes!
  makeSprite('tree_mango', 76, 80, (ctx) => {
    ctx.fillStyle = 'rgba(15, 28, 15, 0.26)';
    ctx.beginPath();
    ctx.ellipse(38, 70, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sturdy trunk
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(32, 42, 12, 29);
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(34, 42, 5, 28);

    // Deep glossy foliage
    leafCluster(ctx, 38, 38, 30, 18, '#14532d');
    leafCluster(ctx, 24, 34, 18, 14, '#166534');
    leafCluster(ctx, 52, 34, 18, 14, '#166534');
    leafCluster(ctx, 38, 24, 26, 16, '#15803d');
    leafCluster(ctx, 32, 18, 18, 10, '#22c55e');
    leafCluster(ctx, 48, 22, 14, 9, '#22c55e');
    leafCluster(ctx, 34, 14, 12, 6, '#4ade80');

    // Golden-orange ripening mangoes!
    const mangoes = [
      [22, 34], [32, 28], [46, 36], [52, 26], [38, 40], [26, 22],
    ];
    mangoes.forEach(([mx, my]) => {
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(mx, my, 4, 5);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(mx, my, 3, 3);
    });
  });

  // 4. COCONUT PALM TREE (68x92) - Curved ringed trunk + radiating fronds + coconuts!
  makeSprite('tree_coconut', 68, 92, (ctx) => {
    ctx.fillStyle = 'rgba(15, 28, 15, 0.24)';
    ctx.beginPath();
    ctx.ellipse(34, 84, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Gently curving ringed palm trunk
    for (let i = 0; i < 14; i++) {
      const ty = 80 - i * 4;
      const curve = Math.round(Math.sin((i / 14) * Math.PI * 0.7) * 5);
      const tx = 31 + curve;
      ctx.fillStyle = i % 2 === 0 ? '#785a46' : '#5c4232';
      ctx.fillRect(tx, ty, 7, 4);
      ctx.fillStyle = '#9c7b63';
      ctx.fillRect(tx + 1, ty, 2, 3);
    }

    const topX = 36;
    const topY = 24;

    // 6 Radiating pixel-art palm fronds
    const drawFrond = (dx: number, dy: number, droop: number, color: string, hi: string) => {
      for (let step = 0; step < 10; step++) {
        const t = step / 9;
        const fx = Math.round(topX + dx * t);
        const fy = Math.round(topY + dy * t + droop * t * t);
        const thickness = step < 7 ? 4 : 2;
        ctx.fillStyle = color;
        ctx.fillRect(fx - 2, fy, thickness + 2, 4);
        ctx.fillStyle = hi;
        ctx.fillRect(fx - 1, fy - 1, thickness, 2);
      }
    };

    drawFrond(-26, -4, 14, '#15803d', '#4ade80');
    drawFrond(26, -4, 14, '#15803d', '#4ade80');
    drawFrond(-22, -16, 10, '#166534', '#22c55e');
    drawFrond(22, -16, 10, '#166534', '#22c55e');
    drawFrond(-14, 10, 10, '#14532d', '#15803d');
    drawFrond(14, 10, 10, '#14532d', '#15803d');
    drawFrond(0, -20, 4, '#22c55e', '#86efac');

    // Cluster of green coconuts beneath crown
    ctx.fillStyle = '#4d7c0f';
    ctx.fillRect(topX - 5, topY + 2, 5, 5);
    ctx.fillRect(topX + 1, topY + 2, 5, 5);
    ctx.fillRect(topX - 2, topY + 5, 5, 5);
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(topX - 4, topY + 3, 2, 2);
    ctx.fillRect(topX + 2, topY + 3, 2, 2);
  });

  // 5. FRUIT / GUAVA TREE (58x64) - Compact orchard tree with blossoms/fruits
  makeSprite('tree_guava', 58, 64, (ctx) => {
    ctx.fillStyle = 'rgba(15, 28, 15, 0.24)';
    ctx.beginPath();
    ctx.ellipse(29, 56, 18, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(25, 34, 8, 23);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(27, 34, 3, 22);

    leafCluster(ctx, 29, 30, 22, 14, '#166534');
    leafCluster(ctx, 20, 26, 14, 10, '#15803d');
    leafCluster(ctx, 38, 26, 14, 10, '#15803d');
    leafCluster(ctx, 29, 18, 18, 11, '#22c55e');
    leafCluster(ctx, 25, 14, 11, 6, '#4ade80');

    // Cute pale-green & pink fruits
    const fruits = [[18, 26], [34, 22], [26, 32], [38, 30]];
    fruits.forEach(([fx, fy]) => {
      ctx.fillStyle = '#a3e635';
      ctx.fillRect(fx, fy, 4, 4);
      ctx.fillStyle = '#f472b6';
      ctx.fillRect(fx + 1, fy + 1, 2, 2);
    });
  });

  // 6. VILLAGE SHRUB / BUSH (36x28)
  makeSprite('tree_bush', 36, 28, (ctx) => {
    ctx.fillStyle = 'rgba(15, 28, 15, 0.24)';
    ctx.beginPath();
    ctx.ellipse(18, 23, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    leafCluster(ctx, 18, 16, 14, 9, '#14532d');
    leafCluster(ctx, 12, 14, 9, 7, '#15803d');
    leafCluster(ctx, 24, 14, 9, 7, '#15803d');
    leafCluster(ctx, 18, 10, 10, 6, '#22c55e');
    ctx.fillStyle = '#f472b6';
    ctx.fillRect(10, 12, 3, 3);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(22, 10, 3, 3);
    ctx.fillRect(16, 15, 3, 3);
  });
}
