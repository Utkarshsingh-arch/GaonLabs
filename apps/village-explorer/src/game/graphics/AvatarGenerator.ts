import Phaser from 'phaser';

export const AVATAR_FRAME_W = 48;
export const AVATAR_FRAME_H = 48;

/**
 * Generates a high-detail 4-frame, 8-direction pixel-art avatar spritesheet (192x384 px).
 * Frame size is 48x48 (~30% bigger visible presence than original 32x32) with crisp clothing,
 * satchel, expressive eyes, hair, smooth walking stride, and grounded soft shadow.
 */
export function generateAvatarAssets(scene: Phaser.Scene): void {
  if (!scene.textures.exists('avatar_sheet')) {
    const canvas = scene.textures.createCanvas('avatar_sheet', AVATAR_FRAME_W * 4, AVATAR_FRAME_H * 8);
    if (canvas) {
      const ctx = canvas.getContext();
      ctx.imageSmoothingEnabled = false;

      // Directions: 0:S, 1:SW, 2:W, 3:NW, 4:N, 5:NE, 6:E, 7:SE
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 4; col++) {
          drawAvatarFrame(ctx, col * AVATAR_FRAME_W, row * AVATAR_FRAME_H, row, col);
        }
      }

      let frameIndex = 0;
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 4; col++) {
          canvas.add(
            frameIndex,
            0,
            col * AVATAR_FRAME_W,
            row * AVATAR_FRAME_H,
            AVATAR_FRAME_W,
            AVATAR_FRAME_H
          );
          frameIndex++;
        }
      }

      canvas.refresh();
    }
  }

  // Create animations (4-frame walk cycle + subtle breathing idle)
  const dirNames = ['s', 'sw', 'w', 'nw', 'n', 'ne', 'e', 'se'];
  dirNames.forEach((dir, rowIndex) => {
    const startFrame = rowIndex * 4;

    const walkKey = `avatar_walk_${dir}`;
    if (!scene.anims.exists(walkKey)) {
      scene.anims.create({
        key: walkKey,
        frames: [0, 1, 2, 3].map((f) => ({
          key: 'avatar_sheet',
          frame: startFrame + f,
        })),
        frameRate: 9,
        repeat: -1,
      });
    }

    const idleKey = `avatar_idle_${dir}`;
    if (!scene.anims.exists(idleKey)) {
      scene.anims.create({
        key: idleKey,
        frames: [
          { key: 'avatar_sheet', frame: startFrame },
          { key: 'avatar_sheet', frame: startFrame + 2 },
        ],
        frameRate: 2,
        repeat: -1,
      });
    }
  });
}

function drawAvatarFrame(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  direction: number,
  frame: number
): void {
  const px = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(ox + x), Math.floor(oy + y), Math.floor(w), Math.floor(h));
  };

  // Smooth walk cycle physics: frames 0 (neutral), 1 (left forward), 2 (neutral), 3 (right forward)
  const bob = frame === 1 || frame === 3 ? -2 : 0;
  const stride = frame === 1 ? 3 : frame === 3 ? -3 : 0;
  const armSwing = frame === 1 ? -3 : frame === 3 ? 3 : 0;

  const isSideLeft = direction === 2;
  const isSideRight = direction === 6;
  const isBack = direction === 3 || direction === 4 || direction === 5;

  // 1. Soft elliptical ground shadow beneath feet
  ctx.fillStyle = 'rgba(10, 20, 10, 0.34)';
  ctx.beginPath();
  ctx.ellipse(ox + 24, oy + 42, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Legs & Shoes (Crisp dark slate trousers + sturdy brown walking shoes)
  if (isSideLeft || isSideRight) {
    // Side stride legs (horizontal swing)
    px(20 - stride, 30 + bob, 6, 9, '#1e293b');
    px(22 + stride, 30 + bob, 6, 9, '#334155');
    px(19 - stride, 38 + bob, 8, 4, '#451a03');
    px(21 + stride, 38 + bob, 8, 4, '#78350f');
  } else {
    // Front/back/diagonal vertical alternating lift
    const leftLift = frame === 1 ? -2 : 0;
    const rightLift = frame === 3 ? -2 : 0;
    // Left leg
    px(17, 30 + bob + leftLift, 6, 9, '#1e293b');
    px(18, 30 + bob + leftLift, 2, 8, '#334155');
    px(16, 38 + bob + leftLift, 7, 4, '#5c2d12');
    // Right leg
    px(25, 30 + bob + rightLift, 6, 9, '#1e293b');
    px(26, 30 + bob + rightLift, 2, 8, '#334155');
    px(25, 38 + bob + rightLift, 7, 4, '#5c2d12');
  }

  // 3. Back Explorer Satchel (when facing North/NW/NE)
  if (isBack) {
    px(16, 20 + bob, 16, 11, '#78350f');
    px(18, 21 + bob, 12, 5, '#b45309');
    px(22, 24 + bob, 4, 3, '#fbbf24'); // Brass buckle
  }

  // 4. Arms (Behind/Side depending on direction)
  if (!isSideLeft && !isSideRight) {
    // Left arm
    px(11, 20 + bob + Math.round(armSwing * 0.5), 5, 10, '#c2410c');
    px(12, 21 + bob + Math.round(armSwing * 0.5), 3, 7, '#ea580c');
    px(11, 29 + bob + Math.round(armSwing * 0.5), 4, 3, '#f6b37f'); // Hand
    // Right arm
    px(32, 20 + bob - Math.round(armSwing * 0.5), 5, 10, '#c2410c');
    px(33, 21 + bob - Math.round(armSwing * 0.5), 3, 7, '#ea580c');
    px(33, 29 + bob - Math.round(armSwing * 0.5), 4, 3, '#f6b37f'); // Hand
  }

  // 5. Torso — Vibrant Rural Saffron Kurta + Emerald Explorer Vest
  const torsoX = isSideLeft || isSideRight ? 17 : 15;
  const torsoW = isSideLeft || isSideRight ? 14 : 18;
  // Dark pixel outline for high visibility against village background
  px(torsoX - 1, 18 + bob, torsoW + 2, 14, '#1e1b18');
  // Saffron kurta base
  px(torsoX, 19 + bob, torsoW, 12, '#ea580c');
  px(torsoX + 2, 19 + bob, torsoW - 4, 11, '#f97316');
  // Teal-emerald vest lapels & waist sash
  if (!isBack) {
    px(torsoX + 1, 19 + bob, 4, 10, '#0f766e');
    px(torsoX + torsoW - 5, 19 + bob, 4, 10, '#0f766e');
    // Cream shirt collar / neckline
    px(torsoX + Math.floor(torsoW / 2) - 2, 19 + bob, 4, 4, '#fef3c7');
  } else {
    px(torsoX + 1, 19 + bob, torsoW - 2, 9, '#0f766e');
  }
  // Belt / sash
  px(torsoX, 29 + bob, torsoW, 2, '#78350f');
  px(23, 29 + bob, 2, 2, '#fbbf24');

  // Side profile swinging arm (drawn on top of torso)
  if (isSideLeft || isSideRight) {
    px(21 + Math.round(armSwing * 0.7), 21 + bob, 5, 9, '#ea580c');
    px(22 + Math.round(armSwing * 0.7), 29 + bob, 4, 3, '#f6b37f');
  }

  // 6. Head & Neck (Warm expressive pixel face with crisp outline)
  px(22, 16 + bob, 4, 3, '#e09b68'); // Neck
  // Head outline
  px(15, 5 + bob, 18, 13, '#1e1b18');
  px(16, 4 + bob, 16, 15, '#1e1b18');
  // Skin fill
  px(16, 6 + bob, 16, 11, '#f6b37f');
  px(17, 5 + bob, 14, 12, '#fbc599');
  // Subtle cheek warmth
  if (!isBack) {
    px(17, 13 + bob, 2, 2, '#f29b7e');
    px(29, 13 + bob, 2, 2, '#f29b7e');
  }

  // 7. Layered Pixel Hair (Deep Espresso with soft specular shine)
  px(15, 4 + bob, 18, 5, '#2d1c15');
  px(16, 3 + bob, 16, 4, '#3e2723');
  px(18, 4 + bob, 8, 2, '#5d4037'); // Hair shine

  if (isBack) {
    // Full back hair coverage
    px(16, 5 + bob, 16, 11, '#2d1c15');
    px(17, 6 + bob, 14, 8, '#3e2723');
    px(19, 6 + bob, 7, 2, '#5d4037');
  } else if (direction === 0) {
    // South (Front)
    px(16, 7 + bob, 3, 4, '#2d1c15'); // Left sideburn
    px(29, 7 + bob, 3, 4, '#2d1c15'); // Right sideburn
    px(19, 10 + bob, 2, 3, '#111827'); // Left eye
    px(27, 10 + bob, 2, 3, '#111827'); // Right eye
    px(19, 10 + bob, 1, 1, '#ffffff'); // Eye sparkle
    px(27, 10 + bob, 1, 1, '#ffffff');
    px(22, 14 + bob, 4, 1, '#b45309'); // Friendly smile
  } else if (direction === 1) {
    // South-West
    px(28, 7 + bob, 4, 5, '#2d1c15');
    px(18, 10 + bob, 2, 3, '#111827');
    px(24, 10 + bob, 2, 3, '#111827');
    px(18, 10 + bob, 1, 1, '#ffffff');
    px(24, 10 + bob, 1, 1, '#ffffff');
    px(20, 14 + bob, 3, 1, '#b45309');
  } else if (direction === 2) {
    // West (Profile left)
    px(23, 6 + bob, 9, 9, '#2d1c15');
    px(18, 10 + bob, 2, 3, '#111827');
    px(18, 10 + bob, 1, 1, '#ffffff');
  } else if (direction === 6) {
    // East (Profile right)
    px(16, 6 + bob, 9, 9, '#2d1c15');
    px(28, 10 + bob, 2, 3, '#111827');
    px(29, 10 + bob, 1, 1, '#ffffff');
  } else if (direction === 7) {
    // South-East
    px(16, 7 + bob, 4, 5, '#2d1c15');
    px(22, 10 + bob, 2, 3, '#111827');
    px(28, 10 + bob, 2, 3, '#111827');
    px(23, 10 + bob, 1, 1, '#ffffff');
    px(29, 10 + bob, 1, 1, '#ffffff');
    px(25, 14 + bob, 3, 1, '#b45309');
  }
}
