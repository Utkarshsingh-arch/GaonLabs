import Phaser from 'phaser';

export type Direction = 's' | 'sw' | 'w' | 'nw' | 'n' | 'ne' | 'e' | 'se';

export class Avatar extends Phaser.Physics.Arcade.Sprite {
  private currentDirection: Direction = 's';
  private moveSpeed: number = 150;
  private isMoving: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'avatar_sheet', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Collision box centered cleanly at the feet of the upgraded 48x48 pixel-art sprite
    this.setSize(20, 14);
    this.setOffset(14, 30);
    this.setCollideWorldBounds(true);
    this.setDepth(this.y + 20);
  }

  public updateMovement(dx: number, dy: number): void {
    if (dx === 0 && dy === 0) {
      this.setVelocity(0, 0);
      if (this.isMoving) {
        this.isMoving = false;
        this.anims.play(`avatar_idle_${this.currentDirection}`, true);
      }
      this.setDepth(this.y + 20);
      return;
    }

    // Normalize diagonal velocity
    const length = Math.sqrt(dx * dx + dy * dy);
    const vx = (dx / length) * this.moveSpeed;
    const vy = (dy / length) * this.moveSpeed;

    this.setVelocity(vx, vy);
    this.isMoving = true;

    // Determine direction from (dx, dy)
    const newDir = this.calculateDirection(dx, dy);
    this.currentDirection = newDir;
    this.anims.play(`avatar_walk_${newDir}`, true);

    // Dynamic 2.5D depth sorting based on ground contact line (feet y)
    this.setDepth(this.y + 20);
  }

  private calculateDirection(dx: number, dy: number): Direction {
    // Threshold for diagonal detection
    const threshold = 0.38;

    if (dy > threshold) {
      if (dx < -threshold) return 'sw';
      if (dx > threshold) return 'se';
      return 's';
    } else if (dy < -threshold) {
      if (dx < -threshold) return 'nw';
      if (dx > threshold) return 'ne';
      return 'n';
    } else {
      return dx < 0 ? 'w' : 'e';
    }
  }

  public getDirection(): Direction {
    return this.currentDirection;
  }
}
