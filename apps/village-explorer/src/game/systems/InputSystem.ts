import Phaser from 'phaser';
import { eventBus } from '../eventBus';

export class InputSystem {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyE!: Phaser.Input.Keyboard.Key;

  // External joystick / touch vector from React UI
  private touchVector = { x: 0, y: 0 };
  private touchInteractTriggered: boolean = false;

  constructor(scene: Phaser.Scene) {
    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
      this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
      this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
      this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
      this.keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    // Listen to touch events dispatched from React mobile joystick
    eventBus.on('input:joystick', (vec: { x: number; y: number }) => {
      this.touchVector = vec;
    });

    eventBus.on('input:interact', () => {
      this.touchInteractTriggered = true;
    });
  }

  public getMovementVector(): { dx: number; dy: number } {
    let dx = 0;
    let dy = 0;

    // Keyboard controls
    if (this.cursors) {
      if (this.cursors.left.isDown || this.keyA.isDown) dx -= 1;
      if (this.cursors.right.isDown || this.keyD.isDown) dx += 1;
      if (this.cursors.up.isDown || this.keyW.isDown) dy -= 1;
      if (this.cursors.down.isDown || this.keyS.isDown) dy += 1;
    }

    // Blend touch vector if active
    if (Math.abs(this.touchVector.x) > 0.05 || Math.abs(this.touchVector.y) > 0.05) {
      dx = this.touchVector.x;
      dy = this.touchVector.y;
    }

    return { dx, dy };
  }

  public isInteractJustPressed(): boolean {
    const keyJustDown =
      (this.keyE && Phaser.Input.Keyboard.JustDown(this.keyE)) ||
      (this.cursors && Phaser.Input.Keyboard.JustDown(this.cursors.space));

    if (this.touchInteractTriggered) {
      this.touchInteractTriggered = false;
      return true;
    }

    return Boolean(keyJustDown);
  }
}
