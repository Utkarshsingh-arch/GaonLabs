import Phaser from 'phaser';

export const GAME_WIDTH = 1024;
export const GAME_HEIGHT = 768;
export const TILE_SIZE = 32;

export function createGameConfig(
  parent: HTMLElement,
  scenes: Phaser.Types.Scenes.SceneType[]
): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scene: scenes,
    backgroundColor: '#1a2e1a',
    pixelArt: true,
    roundPixels: true,
    antialias: false,
  };
}
