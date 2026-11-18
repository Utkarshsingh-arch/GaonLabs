import Phaser from 'phaser';
import villageMapData from '../data/village.json';
import { generateVillageTileset } from '../graphics/TilesetGenerator';
import { generateEnvironmentProps } from '../graphics/PropsGenerator';
import { generateBuildingSprites } from '../graphics/BuildingGenerator';
import { generateCivicBuildingSprites } from '../graphics/CivicBuildingGenerator';
import { generateTreeSprites } from '../graphics/TreeGenerator';
import { generateAvatarAssets } from '../graphics/AvatarGenerator';
import { generateVehicleSprites } from '../graphics/VehicleGenerator';
import { generateNpcSprites } from '../graphics/NpcGenerator';

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

    // Stage 2: 2.5D Pixel-Art Houses, Civic Buildings & Trees
    generateBuildingSprites(this);
    generateCivicBuildingSprites(this);
    generateTreeSprites(this);

    // Stage 3: Upgraded 48x48 Explorer Avatar & Animations
    generateAvatarAssets(this);

    // Stage 4: Village Vehicles & Purposeful NPCs
    generateVehicleSprites(this);
    generateNpcSprites(this);

    this.scene.start('VillageScene');
  }
}
