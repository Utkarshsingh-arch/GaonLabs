import Phaser from 'phaser';
import villageMapData from '../data/village.json';
import { Avatar } from '../entities/Avatar';
import { InputSystem } from '../systems/InputSystem';
import { ZoneSystem } from '../systems/ZoneSystem';
import { eventBus } from '../eventBus';

export class VillageScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private obstaclesLayer!: Phaser.Tilemaps.TilemapLayer;
  private avatar!: Avatar;
  private inputSystem!: InputSystem;
  private zoneSystem!: ZoneSystem;
  private isPausedForLab: boolean = false;

  constructor() {
    super('VillageScene');
  }

  create(): void {
    // 1. Ensure tilemap is seeded in cache with valid orientation
    if (!this.cache.tilemap.has('village_map')) {
      this.cache.tilemap.add('village_map', {
        format: Phaser.Tilemaps.Formats.TILED_JSON,
        data: villageMapData,
      });
    }

    // 2. Create Tilemap from cache
    this.map = this.make.tilemap({ key: 'village_map' });
    let tileset = this.map.addTilesetImage('village_tiles', 'village_tiles', 32, 32, 0, 0);

    if (!tileset && this.map.tilesets.length > 0) {
      tileset = this.map.addTilesetImage(this.map.tilesets[0].name, 'village_tiles', 32, 32, 0, 0);
    }

    if (!tileset) {
      console.warn('Tileset binding warning: using direct texture');
    }

    // 3. Create Ground & Obstacles Layers
    if (tileset) {
      const ground = this.map.createLayer('Ground', tileset, 0, 0);
      ground?.setDepth(0);

      const obstacles = this.map.createLayer('Obstacles', tileset, 0, 0);
      if (obstacles) {
        obstacles.setDepth(2);
        this.obstaclesLayer = obstacles;
        // Enable physics collision on obstacles (tiles > 0 collide)
        this.obstaclesLayer.setCollisionByExclusion([0]);
      }
    }

    // 4. Set Physics World Bounds to Map Dimensions (40*32 x 30*32 = 1280 x 960)
    const mapW = this.map.widthInPixels || 1280;
    const mapH = this.map.heightInPixels || 960;
    this.physics.world.setBounds(0, 0, mapW, mapH);

    // 5. Spawn Avatar at Central Village Crossroads (x: 624, y: 464)
    this.avatar = new Avatar(this, 624, 464);

    // 6. Setup Collision if obstacles layer exists
    if (this.obstaclesLayer) {
      this.physics.add.collider(this.avatar, this.obstaclesLayer);
    }

    // 7. Input System
    this.inputSystem = new InputSystem(this);

    // 8. Zone System for Interactive Labs
    this.zoneSystem = new ZoneSystem(this, this.avatar, this.map);

    // 9. Camera Follow with Smooth Lerp and Bounds
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.avatar, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.25);

    // 10. Pause/Resume Listener for Lab Modals
    eventBus.on('lab:open', () => {
      this.isPausedForLab = true;
      this.avatar.updateMovement(0, 0);
    });

    eventBus.on('lab:close', () => {
      this.isPausedForLab = false;
    });

    // Notify UI that the village scene is live
    eventBus.emit('scene:ready', {
      mapWidth: mapW,
      mapHeight: mapH,
      avatarX: this.avatar.x,
      avatarY: this.avatar.y,
    });
  }

  update(): void {
    if (this.isPausedForLab || !this.avatar || !this.inputSystem) {
      return;
    }

    const { dx, dy } = this.inputSystem.getMovementVector();
    this.avatar.updateMovement(dx, dy);

    // Update zone overlaps
    if (this.zoneSystem) {
      this.zoneSystem.update();

      // Check interaction trigger (E key, Space, or mobile Enter button)
      if (this.inputSystem.isInteractJustPressed()) {
        this.zoneSystem.triggerActiveZoneInteraction();
      }
    }
  }

  public getAvatar(): Avatar {
    return this.avatar;
  }

  public getInputSystem(): InputSystem {
    return this.inputSystem;
  }

  public getZoneSystem(): ZoneSystem {
    return this.zoneSystem;
  }

  public getMap(): Phaser.Tilemaps.Tilemap {
    return this.map;
  }
}
