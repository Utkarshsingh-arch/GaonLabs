import Phaser from 'phaser';
import villageMapData from '../data/village.json';
import { generateVillageTileset } from '../graphics/TilesetGenerator';
import { generateEnvironmentProps } from '../graphics/PropsGenerator';
import { generateBuildingSprites } from '../graphics/BuildingGenerator';
import { generateTreeSprites } from '../graphics/TreeGenerator';
import { generateAvatarAssets } from '../graphics/AvatarGenerator';
import { generateVehicleSprites } from '../graphics/VehicleGenerator';

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
    // Stage 1: Terrain, grass, roads & environment props
    generateVillageTileset(this);
    generateEnvironmentProps(this);

    // Stage 2: 2.5D Pixel-Art Houses & Trees
    generateBuildingSprites(this);
    generateTreeSprites(this);

    // Stage 3: Upgraded 48x48 Explorer Avatar & Animations
    generateAvatarAssets(this);

    // Stage 4: Village Vehicles (Car, Auto-Rickshaw, Motorcycle, Bicycle)
    generateVehicleSprites(this);

    this.scene.start('VillageScene');
  }
}
