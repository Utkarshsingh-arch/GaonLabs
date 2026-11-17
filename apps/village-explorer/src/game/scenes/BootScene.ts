import Phaser from 'phaser';
import villageMapData from '../data/village.json';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // 1. Synchronously seed tilemap into cache so network failure cannot block boot
    this.cache.tilemap.add('village_map', {
      format: Phaser.Tilemaps.Formats.TILED_JSON,
      data: villageMapData,
    });
  }

  create(): void {
    this.generateTilesetTexture();
    this.generateAvatarSpriteSheet();
    this.createAvatarAnimations();
    this.scene.start('VillageScene');
  }

  /**
   * Generates a 256x32 procedural tileset containing 8 distinct 32x32 tiles.
   */
  private generateTilesetTexture(): void {
    if (this.textures.exists('village_tiles')) return;

    const canvas = this.textures.createCanvas('village_tiles', 256, 32);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Helper for a single tile
    const drawTile = (index: number, drawFn: (cx: CanvasRenderingContext2D, ox: number) => void) => {
      const ox = index * 32;
      drawFn(ctx, ox);
    };

    // Tile 1 (Grass): Lush green with blades
    drawTile(0, (cx, ox) => {
      cx.fillStyle = '#2E7D32';
      cx.fillRect(ox, 0, 32, 32);
      cx.fillStyle = '#388E3C';
      cx.fillRect(ox + 4, 6, 4, 8);
      cx.fillRect(ox + 16, 18, 4, 8);
      cx.fillRect(ox + 24, 8, 4, 8);
      cx.fillStyle = '#1B5E20';
      cx.fillRect(ox + 8, 20, 3, 6);
      cx.fillRect(ox + 20, 4, 3, 6);
    });

    // Tile 2 (Earthen Path): Sandy brown soil texture
    drawTile(1, (cx, ox) => {
      cx.fillStyle = '#C49A6C';
      cx.fillRect(ox, 0, 32, 32);
      cx.fillStyle = '#A17448';
      cx.fillRect(ox + 2, 4, 6, 4);
      cx.fillRect(ox + 14, 18, 8, 4);
      cx.fillRect(ox + 22, 8, 5, 3);
      cx.fillStyle = '#8D5B34';
      cx.fillRect(ox + 10, 10, 3, 2);
      cx.fillRect(ox + 24, 24, 4, 3);
    });

    // Tile 3 (Water): Blue with gentle ripples
    drawTile(2, (cx, ox) => {
      cx.fillStyle = '#0288D1';
      cx.fillRect(ox, 0, 32, 32);
      cx.fillStyle = '#4FC3F7';
      cx.fillRect(ox + 6, 8, 12, 3);
      cx.fillRect(ox + 14, 20, 14, 3);
      cx.fillStyle = '#01579B';
      cx.fillRect(ox + 2, 16, 8, 2);
      cx.fillRect(ox + 20, 4, 8, 2);
    });

    // Tile 4 (Farmland Furrows): Rich dark soil with furrow lines
    drawTile(3, (cx, ox) => {
      cx.fillStyle = '#6D4C41';
      cx.fillRect(ox, 0, 32, 32);
      cx.fillStyle = '#4E342E';
      cx.fillRect(ox, 4, 32, 4);
      cx.fillRect(ox, 12, 32, 4);
      cx.fillRect(ox, 20, 32, 4);
      cx.fillRect(ox, 28, 32, 4);
      // Small green sprouts
      cx.fillStyle = '#7CB342';
      cx.fillRect(ox + 6, 2, 4, 3);
      cx.fillRect(ox + 22, 10, 4, 3);
      cx.fillRect(ox + 14, 18, 4, 3);
    });

    // Tile 5 (Stone Wall): Mortar and weathered stone
    drawTile(4, (cx, ox) => {
      cx.fillStyle = '#78909C';
      cx.fillRect(ox, 0, 32, 32);
      cx.strokeStyle = '#37474F';
      cx.lineWidth = 1;
      cx.strokeRect(ox + 0.5, 0.5, 31, 31);
      cx.fillStyle = '#B0BEC5';
      cx.fillRect(ox + 3, 3, 12, 10);
      cx.fillRect(ox + 17, 3, 12, 10);
      cx.fillRect(ox + 2, 16, 13, 12);
      cx.fillRect(ox + 17, 16, 13, 12);
    });

    // Tile 6 (Terracotta Roof): Angled tiles
    drawTile(5, (cx, ox) => {
      cx.fillStyle = '#BF360C';
      cx.fillRect(ox, 0, 32, 32);
      cx.fillStyle = '#D84315';
      cx.fillRect(ox + 2, 2, 28, 8);
      cx.fillRect(ox + 2, 12, 28, 8);
      cx.fillRect(ox + 2, 22, 28, 8);
      cx.fillStyle = '#FF7043';
      cx.fillRect(ox + 4, 2, 24, 2);
      cx.fillRect(ox + 4, 12, 24, 2);
    });

    // Tile 7 (Tree): Lush crown and trunk
    drawTile(6, (cx, ox) => {
      cx.fillStyle = '#2E7D32';
      cx.fillRect(ox, 0, 32, 32);
      // Shadow
      cx.fillStyle = 'rgba(0,0,0,0.25)';
      cx.beginPath();
      cx.ellipse(ox + 16, 26, 12, 5, 0, 0, Math.PI * 2);
      cx.fill();
      // Trunk
      cx.fillStyle = '#5D4037';
      cx.fillRect(ox + 13, 18, 6, 10);
      // Foliage
      cx.fillStyle = '#1B5E20';
      cx.beginPath();
      cx.arc(ox + 16, 13, 12, 0, Math.PI * 2);
      cx.fill();
      cx.fillStyle = '#388E3C';
      cx.beginPath();
      cx.arc(ox + 14, 10, 8, 0, Math.PI * 2);
      cx.fill();
    });

    // Tile 8 (Wooden Fence / Border)
    drawTile(7, (cx, ox) => {
      cx.fillStyle = '#2E7D32';
      cx.fillRect(ox, 0, 32, 32);
      cx.fillStyle = '#8D6E63';
      cx.fillRect(ox + 4, 4, 6, 24);
      cx.fillRect(ox + 22, 4, 6, 24);
      cx.fillStyle = '#5D4037';
      cx.fillRect(ox, 10, 32, 4);
      cx.fillRect(ox, 20, 32, 4);
    });

    // Explicitly add frames for each of the 8 tiles (indices 1..8)
    for (let i = 0; i < 8; i++) {
      canvas.add(i + 1, 0, i * 32, 0, 32, 32);
    }

    canvas.refresh();
  }

  /**
   * Generates a 4-frame, 8-direction sprite sheet (128x256 px).
   * Frame size: 32x32.
   * 4 columns (frames 0..3), 8 rows (directions 0..7).
   */
  private generateAvatarSpriteSheet(): void {
    if (this.textures.exists('avatar_sheet')) return;

    const canvas = this.textures.createCanvas('avatar_sheet', 128, 256);
    if (!canvas) return;
    const ctx = canvas.getContext();

    // Directions: 0:S, 1:SW, 2:W, 3:NW, 4:N, 5:NE, 6:E, 7:SE
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        const ox = col * 32;
        const oy = row * 32;
        this.drawAvatarFrame(ctx, ox, oy, row, col);
      }
    }

    // Explicitly add all 32 frames (0..31) for 4 cols x 8 rows
    let frameIndex = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        canvas.add(frameIndex, 0, col * 32, row * 32, 32, 32);
        frameIndex++;
      }
    }

    canvas.refresh();
  }

  private drawAvatarFrame(
    ctx: CanvasRenderingContext2D,
    ox: number,
    oy: number,
    direction: number,
    frame: number
  ): void {
    // Soft ground shadow (pre-rendered 3D feel)
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(ox + 16, oy + 28, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Walk bobbing cycle
    const bob = frame % 2 === 1 ? -1 : 0;
    const legSwing = frame === 1 ? 2 : frame === 3 ? -2 : 0;

    // Legs / Trousers (Dark slate)
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(ox + 11 - legSwing, oy + 19 + bob, 4, 8);
    ctx.fillRect(ox + 17 + legSwing, oy + 19 + bob, 4, 8);

    // Shoes
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(ox + 10 - legSwing, oy + 26 + bob, 5, 3);
    ctx.fillRect(ox + 17 + legSwing, oy + 26 + bob, 5, 3);

    // Torso / Rural Kurta-Jacket (Warm amber/saffron with collar)
    ctx.fillStyle = '#E65100';
    ctx.fillRect(ox + 10, oy + 11 + bob, 12, 10);
    // Vest highlight
    ctx.fillStyle = '#F57C00';
    ctx.fillRect(ox + 12, oy + 11 + bob, 8, 10);

    // Arms
    ctx.fillStyle = '#EF6C00';
    ctx.fillRect(ox + 7 + legSwing, oy + 12 + bob, 3, 7);
    ctx.fillRect(ox + 22 - legSwing, oy + 12 + bob, 3, 7);

    // Head / Skin (Warm tone)
    ctx.fillStyle = '#FFB74D';
    ctx.beginPath();
    ctx.arc(ox + 16, oy + 8 + bob, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Hair / Headgear (Deep brown/black)
    ctx.fillStyle = '#3E2723';
    ctx.beginPath();
    ctx.arc(ox + 16, oy + 6 + bob, 5.5, Math.PI, Math.PI * 2);
    ctx.fill();

    // Directional eye/face indicators
    ctx.fillStyle = '#1F2937';
    if (direction === 0) {
      // South (facing front)
      ctx.fillRect(ox + 14, oy + 8 + bob, 1.5, 2);
      ctx.fillRect(ox + 17, oy + 8 + bob, 1.5, 2);
    } else if (direction === 1) {
      // South-West
      ctx.fillRect(ox + 13, oy + 8 + bob, 1.5, 2);
      ctx.fillRect(ox + 16, oy + 8 + bob, 1.5, 2);
    } else if (direction === 2) {
      // West (Profile left)
      ctx.fillRect(ox + 12, oy + 8 + bob, 2, 2);
    } else if (direction === 3) {
      // North-West
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(ox + 12, oy + 6 + bob, 4, 3);
    } else if (direction === 4) {
      // North (Facing back - all hair)
      ctx.fillStyle = '#3E2723';
      ctx.beginPath();
      ctx.arc(ox + 16, oy + 7 + bob, 5.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (direction === 5) {
      // North-East
      ctx.fillStyle = '#3E2723';
      ctx.fillRect(ox + 16, oy + 6 + bob, 4, 3);
    } else if (direction === 6) {
      // East (Profile right)
      ctx.fillRect(ox + 18, oy + 8 + bob, 2, 2);
    } else if (direction === 7) {
      // South-East
      ctx.fillRect(ox + 15, oy + 8 + bob, 1.5, 2);
      ctx.fillRect(ox + 18, oy + 8 + bob, 1.5, 2);
    }
  }

  private createAvatarAnimations(): void {
    const dirNames = ['s', 'sw', 'w', 'nw', 'n', 'ne', 'e', 'se'];

    dirNames.forEach((dir, rowIndex) => {
      const startFrame = rowIndex * 4;

      const walkKey = `avatar_walk_${dir}`;
      if (!this.anims.exists(walkKey)) {
        this.anims.create({
          key: walkKey,
          frames: [0, 1, 2, 3].map((f) => ({
            key: 'avatar_sheet',
            frame: startFrame + f,
          })),
          frameRate: 8,
          repeat: -1,
        });
      }

      const idleKey = `avatar_idle_${dir}`;
      if (!this.anims.exists(idleKey)) {
        this.anims.create({
          key: idleKey,
          frames: [{ key: 'avatar_sheet', frame: startFrame }],
          frameRate: 1,
        });
      }
    });
  }
}
