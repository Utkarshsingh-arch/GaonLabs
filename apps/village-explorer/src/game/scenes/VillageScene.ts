import Phaser from 'phaser';
import villageMapData from '../data/village.json';
import { TILE_SIZE } from '../config';
import { Avatar } from '../entities/Avatar';
import { InputSystem } from '../systems/InputSystem';
import { ZoneSystem } from '../systems/ZoneSystem';
import { InteractionSystem } from '../systems/InteractionSystem';
import { VehicleSystem } from '../systems/VehicleSystem';
import { ExplorationFactSystem } from '../systems/ExplorationFactSystem';
import {
  VILLAGE_BUILDINGS,
  VILLAGE_TREES,
  VILLAGE_PROPS,
  TREE_INFO,
} from '../data/villageEntities';
import { eventBus } from '../eventBus';

export class VillageScene extends Phaser.Scene {
  private map!: Phaser.Tilemaps.Tilemap;
  private obstaclesLayer!: Phaser.Tilemaps.TilemapLayer;
  private avatar!: Avatar;
  private inputSystem!: InputSystem;
  private zoneSystem!: ZoneSystem;
  private interactionSystem!: InteractionSystem;
  private vehicleSystem!: VehicleSystem;
  private factSystem!: ExplorationFactSystem;
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
    let tileset = this.map.addTilesetImage('village_tiles', 'village_tiles', TILE_SIZE, TILE_SIZE, 0, 0);

    if (!tileset && this.map.tilesets.length > 0) {
      tileset = this.map.addTilesetImage(
        this.map.tilesets[0].name,
        'village_tiles',
        TILE_SIZE,
        TILE_SIZE,
        0,
        0
      );
    }

    // 3. Create Ground & Invisible Collision Obstacles Layers
    if (tileset) {
      const ground = this.map.createLayer('Ground', tileset, 0, 0);
      ground?.setDepth(0);

      const obstacles = this.map.createLayer('Obstacles', tileset, 0, 0);
      if (obstacles) {
        obstacles.setDepth(1);
        obstacles.setVisible(false); // Invisible solid footprints beneath 2.5D sprites
        this.obstaclesLayer = obstacles;
        this.obstaclesLayer.setCollisionByExclusion([0]);
      }
    }

    // 4. Set Physics World Bounds to Expanded Map Dimensions (56*32 x 42*32 = 1792 x 1344)
    const mapW = this.map.widthInPixels || 1792;
    const mapH = this.map.heightInPixels || 1344;
    this.physics.world.setBounds(0, 0, mapW, mapH);

    // 5. Spawn Upgraded Explorer Avatar at Central Village Chowk (tile 27.5, 20.5)
    this.avatar = new Avatar(this, 27.5 * TILE_SIZE, 20.5 * TILE_SIZE);

    // 6. Setup Physics Collision with building footprints, water & perimeter
    if (this.obstaclesLayer) {
      this.physics.add.collider(this.avatar, this.obstaclesLayer);
    }

    // 7. Core Input, Zone & Unified Interaction Systems
    this.inputSystem = new InputSystem(this);
    this.zoneSystem = new ZoneSystem(this, this.avatar, this.map);
    this.interactionSystem = new InteractionSystem(this, this.avatar);

    // 8. Stage 1 & 2: Render 2.5D Water Glints, Props, Buildings & Trees with Y-Depth Sorting
    this.renderWaterGlints();
    this.renderEnvironmentProps();
    this.renderBuildings();
    this.renderTrees();

    // 9. Stage 4: Spawn Village Vehicles (Parked + Smoothly Cruising)
    this.vehicleSystem = new VehicleSystem(this, this.avatar, this.interactionSystem);

    // 10. Stage 5: Random Context-Aware Exploration Fact Controller
    this.factSystem = new ExplorationFactSystem({
      cooldownMs: 22000,
      minTravelDistancePx: 260,
      recentHistorySize: 8,
    });

    // 11. Camera Follow with Smooth Lerp, Slight Elevated Top-Down Feel & Bounds
    this.cameras.main.setBounds(0, 0, mapW, mapH);
    this.cameras.main.startFollow(this.avatar, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.22);

    // 12. Pause/Resume Listeners for Lab & Learning House Modals
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

  private renderWaterGlints(): void {
    const glintTiles: Array<[number, number]> = [
      [47.5, 14.5],
      [50.2, 16.0],
      [48.5, 17.5],
      [48.0, 23.4],
      [50.5, 24.4],
    ];

    glintTiles.forEach(([tx, ty], i) => {
      const glint = this.add.image(tx * TILE_SIZE, ty * TILE_SIZE, 'prop_water_glint');
      glint.setDepth(2);
      glint.setAlpha(0.35);
      this.tweens.add({
        targets: glint,
        alpha: { from: 0.25, to: 0.78 },
        x: glint.x + 6,
        duration: 1900 + i * 260,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });
  }

  private renderEnvironmentProps(): void {
    VILLAGE_PROPS.forEach((prop) => {
      const wx = prop.tileX * TILE_SIZE;
      const wy = prop.tileY * TILE_SIZE;
      const sprite = this.add.image(wx, wy, prop.textureKey);
      sprite.setOrigin(0.5, 0.88);
      sprite.setDepth(wy + (prop.depthOffset ?? 0));
    });
  }

  private renderBuildings(): void {
    VILLAGE_BUILDINGS.forEach((bldg) => {
      const wx = bldg.tileX * TILE_SIZE;
      const wy = bldg.tileY * TILE_SIZE;
      const sprite = this.add.image(wx, wy, bldg.textureKey);
      // Anchor near base so player walks naturally behind roofs and in front of doorways
      sprite.setOrigin(0.5, 0.92);
      sprite.setDepth(wy);

      // Register unified hover & click/tap interaction
      let onActivate: (() => void) | undefined;
      if (bldg.category === 'core_lab' && bldg.coreZoneId) {
        onActivate = () => {
          eventBus.emit('zone:enter', { id: bldg.coreZoneId, name: bldg.name });
        };
      } else if (bldg.category === 'learning_house') {
        onActivate = () => {
          eventBus.emit('house:enter', { id: bldg.id, name: bldg.name });
        };
        this.interactionSystem.registerLearningHouseProximity(bldg);

        // Compact floating village house badge above roof
        const label = this.add.text(
          wx,
          wy - sprite.height * 0.92 - 4,
          `${bldg.icon} ${bldg.name}`,
          {
            fontSize: '10px',
            fontFamily: 'system-ui, sans-serif',
            fontStyle: 'bold',
            color: '#e0f2fe',
            backgroundColor: '#0f172ad4',
            padding: { x: 6, y: 2 },
          }
        );
        label.setOrigin(0.5, 1);
        label.setDepth(1995);
      }

      this.interactionSystem.registerInteractive(
        sprite,
        {
          id: bldg.id,
          name: bldg.name,
          icon: bldg.icon,
          category: bldg.category,
          subject: bldg.subject,
          description: bldg.description,
          hint: bldg.interactionHint,
        },
        onActivate
      );
    });
  }

  private renderTrees(): void {
    VILLAGE_TREES.forEach((tree, index) => {
      const info = TREE_INFO[tree.variety];
      const wx = tree.tileX * TILE_SIZE;
      const wy = tree.tileY * TILE_SIZE;
      const sprite = this.add.image(wx, wy, info.textureKey);
      sprite.setOrigin(0.5, 0.88);
      if (tree.scale) {
        sprite.setScale(tree.scale);
      }
      sprite.setDepth(wy);

      // Lightweight breeze sway on select foreground trees
      if (tree.sway) {
        this.tweens.add({
          targets: sprite,
          angle: { from: -0.9, to: 0.9 },
          duration: 2800 + (index % 5) * 350,
          delay: (index % 7) * 180,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }

      this.interactionSystem.registerInteractive(sprite, {
        id: tree.id,
        name: info.name,
        icon: info.icon,
        category: 'tree',
        subject: `Botany • ${info.scientificName}`,
        description: info.fact,
        hint: info.ecologicalRole,
      });
    });
  }

  private collectNearbyContextTags(): string[] {
    const tags: string[] = [];
    const ax = this.avatar.x;
    const ay = this.avatar.y;

    for (const b of VILLAGE_BUILDINGS) {
      const dist = Phaser.Math.Distance.Between(ax, ay, b.tileX * TILE_SIZE, b.tileY * TILE_SIZE);
      if (dist < 260) {
        tags.push(b.id);
      }
    }

    // Pond proximity (east village)
    if (ax > 43 * TILE_SIZE && ay > 11 * TILE_SIZE && ay < 28 * TILE_SIZE) {
      tags.push('pond');
    }

    // Nearby vehicle
    if (this.vehicleSystem) {
      for (const vp of this.vehicleSystem.getVehiclePositions()) {
        if (Phaser.Math.Distance.Between(ax, ay, vp.x, vp.y) < 190) {
          tags.push('vehicle');
          break;
        }
      }
    }

    // Nearby tree
    for (const t of VILLAGE_TREES) {
      if (Phaser.Math.Distance.Between(ax, ay, t.tileX * TILE_SIZE, t.tileY * TILE_SIZE) < 130) {
        tags.push('tree');
        break;
      }
    }

    return tags;
  }

  update(_time: number, delta: number): void {
    // Keep ambient vehicles moving smoothly when not paused
    if (!this.isPausedForLab && this.vehicleSystem) {
      this.vehicleSystem.update(delta);
    }

    if (this.isPausedForLab || !this.avatar || !this.inputSystem) {
      return;
    }

    const { dx, dy } = this.inputSystem.getMovementVector();
    this.avatar.updateMovement(dx, dy);

    // Update core lab zone & new learning house proximity overlaps
    if (this.zoneSystem) {
      this.zoneSystem.update();
    }

    const hasActiveCoreZone = Boolean(this.zoneSystem?.getActiveZone());
    if (this.interactionSystem) {
      this.interactionSystem.update(hasActiveCoreZone);
    }

    // Check interaction trigger (E key, Space, or mobile Enter button)
    if (this.inputSystem.isInteractJustPressed()) {
      if (hasActiveCoreZone) {
        this.zoneSystem.triggerActiveZoneInteraction();
      } else {
        this.interactionSystem?.triggerActiveLearningHouse();
      }
    }

    // Trigger occasional contextual educational fact bubbles while exploring
    if (this.factSystem) {
      const fact = this.factSystem.update(
        delta,
        this.avatar.x,
        this.avatar.y,
        this.collectNearbyContextTags(),
        this.isPausedForLab
      );
      if (fact) {
        eventBus.emit('fact:show', fact);
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
