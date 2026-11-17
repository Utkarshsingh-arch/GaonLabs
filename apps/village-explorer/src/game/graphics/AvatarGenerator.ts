import type Phaser from 'phaser';
import {
  AVATAR_FRAME_W,
  AVATAR_FRAME_H,
  AvatarCustomization,
  DEFAULT_BOY_AVATAR,
  drawAvatarPixelCharacter,
} from './avatarAppearance';

export { AVATAR_FRAME_W, AVATAR_FRAME_H };

/**
 * Generates or updates the 4-frame, 8-direction pixel-art avatar spritesheet (192x384 px)
 * in-place so the student's chosen Boy/Girl character and customisations appear live inside the village.
 */
export function generateAvatarAssets(
  scene: Phaser.Scene,
  appearance: AvatarCustomization = DEFAULT_BOY_AVATAR
): void {
  const totalW = AVATAR_FRAME_W * 4;
  const totalH = AVATAR_FRAME_H * 8;

  let canvas: Phaser.Textures.CanvasTexture | null = null;
  let isNew = false;

  if (scene.textures.exists('avatar_sheet')) {
    const existing = scene.textures.get('avatar_sheet');
    if (existing && 'getContext' in existing && typeof existing.getContext === 'function') {
      canvas = existing as Phaser.Textures.CanvasTexture;
    }
  }

  if (!canvas) {
    canvas = scene.textures.createCanvas('avatar_sheet', totalW, totalH);
    isNew = true;
  }

  if (canvas) {
    const ctx = canvas.getContext();
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, totalW, totalH);

    // Directions: 0:S, 1:SW, 2:W, 3:NW, 4:N, 5:NE, 6:E, 7:SE
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        drawAvatarPixelCharacter(
          ctx,
          col * AVATAR_FRAME_W,
          row * AVATAR_FRAME_H,
          row,
          col,
          appearance
        );
      }
    }

    if (isNew) {
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
    }

    canvas.refresh();
  }

  // Create animations once (they automatically read updated pixels from 'avatar_sheet')
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
