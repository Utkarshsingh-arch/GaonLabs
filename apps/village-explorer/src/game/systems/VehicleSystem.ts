import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import {
  VILLAGE_VEHICLES,
  VEHICLE_INFO,
  VehiclePlacement,
} from '../data/villageEntities';
import { Avatar } from '../entities/Avatar';
import { InteractionSystem } from './InteractionSystem';

interface ManagedVehicle {
  config: VehiclePlacement;
  sprite: Phaser.GameObjects.Image;
  waypointIndex: number;
  speed: number;
}

/**
 * Spawns and animates pixel-art village vehicles (cars, auto-rickshaws, motorcycles, bicycles).
 * Moving vehicles follow predefined road loops and courteously yield if the player walks nearby,
 * ensuring they never interfere with avatar navigation or collision logic.
 */
export class VehicleSystem {
  private scene: Phaser.Scene;
  private avatar: Avatar;
  private vehicles: ManagedVehicle[] = [];

  constructor(
    scene: Phaser.Scene,
    avatar: Avatar,
    interactionSystem: InteractionSystem
  ) {
    this.scene = scene;
    this.avatar = avatar;

    VILLAGE_VEHICLES.forEach((cfg) => {
      const info = VEHICLE_INFO[cfg.type];
      const worldX = cfg.tileX * TILE_SIZE;
      const worldY = cfg.tileY * TILE_SIZE;
      const texKey = cfg.orientation === 'v' ? info.textureV : info.textureH;

      const sprite = this.scene.add.image(worldX, worldY, texKey);
      sprite.setOrigin(0.5, 0.72);
      if (cfg.flipX) sprite.setFlipX(true);
      sprite.setDepth(worldY + 8);

      interactionSystem.registerInteractive(sprite, {
        id: cfg.id,
        name: info.name,
        icon: info.icon,
        category: 'vehicle',
        subject: `${info.subject} • ${info.physicsConcept}`,
        description: info.fact,
      });

      this.vehicles.push({
        config: cfg,
        sprite,
        waypointIndex: 1,
        speed: cfg.speed ?? 0,
      });
    });
  }

  public update(deltaMs: number): void {
    const dt = Math.min(deltaMs / 1000, 0.05);

    for (const v of this.vehicles) {
      const waypoints = v.config.waypoints;
      if (!waypoints || waypoints.length < 2 || v.speed <= 0) continue;

      // Courteously pause if player avatar is right next to the moving vehicle
      const distToAvatar = Phaser.Math.Distance.Between(
        v.sprite.x,
        v.sprite.y,
        this.avatar.x,
        this.avatar.y
      );
      if (distToAvatar < 54) {
        continue;
      }

      const targetWp = waypoints[v.waypointIndex];
      const tx = targetWp.tileX * TILE_SIZE;
      const ty = targetWp.tileY * TILE_SIZE;

      const dx = tx - v.sprite.x;
      const dy = ty - v.sprite.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        v.sprite.setPosition(tx, ty);
        v.waypointIndex = (v.waypointIndex + 1) % waypoints.length;
        continue;
      }

      const step = Math.min(dist, v.speed * dt);
      v.sprite.x += (dx / dist) * step;
      v.sprite.y += (dy / dist) * step;

      // Orient sprite smoothly to travel direction
      const info = VEHICLE_INFO[v.config.type];
      if (Math.abs(dx) >= Math.abs(dy)) {
        if (v.sprite.texture.key !== info.textureH) {
          v.sprite.setTexture(info.textureH);
        }
        v.sprite.setFlipX(dx < 0);
        v.sprite.setFlipY(false);
      } else {
        if (v.sprite.texture.key !== info.textureV) {
          v.sprite.setTexture(info.textureV);
        }
        v.sprite.setFlipX(false);
        v.sprite.setFlipY(dy < 0);
      }

      // Dynamic 2.5D depth sorting
      v.sprite.setDepth(v.sprite.y + 8);
    }
  }

  public getVehiclePositions(): Array<{ id: string; x: number; y: number }> {
    return this.vehicles.map((v) => ({
      id: v.config.id,
      x: v.sprite.x,
      y: v.sprite.y,
    }));
  }
}
