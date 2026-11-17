import Phaser from 'phaser';

/**
 * Generates crisp 2.5D pixel-art village vehicles with grounded shadows
 * in horizontal (facing right; flipX for left) and vertical (facing down; flipY/variant for up) forms:
 * - Car (Compact Hatchback)
 * - Auto-Rickshaw (Iconic Yellow & Green Indian three-wheeler)
 * - Motorcycle (Rural commuter bike)
 * - Bicycle (Classic Indian steel-frame bicycle)
 */
export function generateVehicleSprites(scene: Phaser.Scene): void {
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

  // 1. CAR — Horizontal (Facing East) (60x36)
  makeSprite('veh_car_h', 60, 36, (ctx) => {
    // Ground shadow
    ctx.fillStyle = 'rgba(15, 23, 15, 0.30)';
    ctx.fillRect(4, 26, 52, 8);
    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(10, 24, 10, 8);
    ctx.fillRect(40, 24, 10, 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(13, 26, 4, 4);
    ctx.fillRect(43, 26, 4, 4);
    // Lower body chassis (Cobalt blue)
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(4, 15, 52, 12);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(6, 15, 48, 8);
    // Upper cabin & roof
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(14, 6, 30, 10);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(16, 7, 26, 3);
    // Windows & Windshield
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(17, 9, 10, 6);
    ctx.fillRect(30, 9, 11, 6);
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(32, 10, 4, 3);
    // Headlights (front/right) & Tail lights (rear/left)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(53, 17, 3, 5);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(4, 17, 3, 5);
    // Bumpers
    ctx.fillStyle = '#334155';
    ctx.fillRect(3, 24, 5, 3);
    ctx.fillRect(52, 24, 5, 3);
  });

  // 1b. CAR — Vertical (Facing South) (36x56)
  makeSprite('veh_car_v', 36, 56, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.30)';
    ctx.fillRect(4, 8, 30, 44);
    // Side wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(2, 12, 4, 10);
    ctx.fillRect(30, 12, 4, 10);
    ctx.fillRect(2, 34, 4, 10);
    ctx.fillRect(30, 34, 4, 10);
    // Body
    ctx.fillStyle = '#1d4ed8';
    ctx.fillRect(5, 6, 26, 44);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(7, 8, 22, 40);
    // Roof
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(8, 16, 20, 18);
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(10, 18, 16, 14);
    // Front & rear glass
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(8, 34, 20, 7);
    ctx.fillRect(9, 10, 18, 5);
    // Headlights bottom
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(7, 47, 6, 3);
    ctx.fillRect(23, 47, 6, 3);
  });

  // 2. AUTO-RICKSHAW — Horizontal (Facing East) (48x36)
  makeSprite('veh_auto_h', 48, 36, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(5, 26, 38, 7);
    // 3 wheels (2 back, 1 front)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(9, 24, 8, 7);
    ctx.fillRect(34, 24, 8, 7);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(11, 26, 4, 3);
    ctx.fillRect(36, 26, 4, 3);
    // Green lower Indian auto body
    ctx.fillStyle = '#15803d';
    ctx.fillRect(6, 17, 36, 10);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(8, 18, 32, 6);
    // Iconic Yellow Roof Canopy
    ctx.fillStyle = '#ca8a04';
    ctx.fillRect(8, 6, 28, 11);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(9, 7, 26, 8);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(11, 7, 20, 3);
    // Open passenger cabin window & driver windshield
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(14, 12, 12, 6);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(31, 10, 7, 8);
    // Yellow front mudguard & round headlamp
    ctx.fillStyle = '#facc15';
    ctx.fillRect(38, 17, 6, 7);
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(42, 18, 3, 4);
  });

  // 2b. AUTO-RICKSHAW — Vertical (Facing South) (34x48)
  makeSprite('veh_auto_v', 34, 48, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.28)';
    ctx.fillRect(4, 8, 26, 36);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(3, 14, 4, 9);
    ctx.fillRect(27, 14, 4, 9);
    ctx.fillRect(14, 38, 6, 6);
    // Green body
    ctx.fillStyle = '#15803d';
    ctx.fillRect(6, 8, 22, 32);
    // Yellow curved roof
    ctx.fillStyle = '#facc15';
    ctx.fillRect(7, 10, 20, 22);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(9, 12, 16, 16);
    // Windshield
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(8, 32, 18, 6);
    // Headlamp
    ctx.fillStyle = '#fef9c3';
    ctx.fillRect(14, 39, 6, 4);
  });

  // 3. MOTORCYCLE — Horizontal (Facing East) (38x26)
  makeSprite('veh_moto_h', 38, 26, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.26)';
    ctx.fillRect(5, 19, 28, 5);
    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5, 14, 9, 9);
    ctx.fillRect(24, 14, 9, 9);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 17, 3, 3);
    ctx.fillRect(27, 17, 3, 3);
    // Engine & Chrome Exhaust
    ctx.fillStyle = '#64748b';
    ctx.fillRect(13, 14, 12, 6);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(7, 18, 12, 2);
    // Seat (black) & Crimson Fuel Tank
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(9, 10, 11, 4);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(19, 9, 8, 5);
    ctx.fillStyle = '#f87171';
    ctx.fillRect(20, 9, 5, 2);
    // Front fork, handlebars & headlight
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(26, 6, 3, 12);
    ctx.fillRect(24, 5, 6, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(29, 8, 3, 4);
  });

  // 3b. MOTORCYCLE — Vertical (22x36)
  makeSprite('veh_moto_v', 22, 36, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.26)';
    ctx.fillRect(5, 6, 12, 26);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(8, 4, 6, 8);
    ctx.fillRect(8, 24, 6, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(7, 10, 8, 10);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(7, 18, 8, 7);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(3, 24, 16, 2);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(9, 27, 4, 3);
  });

  // 4. BICYCLE — Horizontal (Facing East) (36x26)
  makeSprite('veh_bike_h', 36, 26, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.22)';
    ctx.fillRect(5, 20, 26, 4);
    // Spoked Wheels
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(9, 17, 5, 0, Math.PI * 2);
    ctx.arc(27, 17, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(8, 16, 2, 2);
    ctx.fillRect(26, 16, 2, 2);
    // Emerald Steel Diamond Frame
    ctx.fillStyle = '#059669';
    ctx.fillRect(9, 11, 16, 2);
    ctx.fillRect(14, 11, 2, 7);
    ctx.fillRect(23, 7, 2, 11);
    ctx.fillRect(15, 16, 9, 2);
    // Rear Carrier & Saddle
    ctx.fillStyle = '#334155';
    ctx.fillRect(5, 11, 7, 2);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(12, 8, 6, 3);
    // Handlebars & Basket
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(21, 6, 6, 2);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(26, 8, 5, 4);
  });

  // 4b. BICYCLE — Vertical (20x34)
  makeSprite('veh_bike_v', 20, 34, (ctx) => {
    ctx.fillStyle = 'rgba(15, 23, 15, 0.22)';
    ctx.fillRect(6, 6, 8, 24);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, 4, 4, 9);
    ctx.fillRect(8, 21, 4, 9);
    ctx.fillStyle = '#059669';
    ctx.fillRect(9, 10, 2, 14);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(7, 12, 6, 5);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(3, 22, 14, 2);
  });
}
