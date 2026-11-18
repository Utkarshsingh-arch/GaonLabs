import Phaser from 'phaser';
import { eventBus } from '../eventBus';
import { BuildingPlacement } from '../data/villageEntities';
import { Avatar } from '../entities/Avatar';
import { TILE_SIZE } from '../config';

export interface HoverEntityPayload {
  id: string;
  name: string;
  icon: string;
  category: 'core_lab' | 'learning_house' | 'civic_center' | 'residential' | 'tree' | 'vehicle' | 'npc';
  subject: string;
  description: string;
  hint?: string;
}

interface ProximityHouse {
  building: BuildingPlacement;
  rect: Phaser.Geom.Rectangle;
}

/**
 * Unified hover, click/tap, and learning-house proximity interaction system.
 * Provides consistent subtle highlight + educational tooltip cards across
 * houses, trees, vehicles, and labs, while integrating smoothly with existing events.
 */
export class InteractionSystem {
  private scene: Phaser.Scene;
  private avatar: Avatar;
  private proximityHouses: ProximityHouse[] = [];
  private activeHouse: BuildingPlacement | null = null;
  private touchClearTimer?: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, avatar: Avatar) {
    this.scene = scene;
    this.avatar = avatar;
  }

  /**
   * Registers any pixel-art village sprite (building, tree, vehicle) for unified
   * hover highlight + tooltip card + click/tap interaction.
   */
  public registerInteractive(
    sprite: Phaser.GameObjects.Image,
    payload: HoverEntityPayload,
    onActivate?: () => void
  ): void {
    const baseScaleX = sprite.scaleX;
    const baseScaleY = sprite.scaleY;

    sprite.setInteractive({ useHandCursor: Boolean(onActivate) });

    sprite.on('pointerover', () => {
      // Subtle warm highlight & gentle lift
      sprite.setTint(0xfffbeb);
      sprite.setScale(baseScaleX * 1.03, baseScaleY * 1.03);
      eventBus.emit('entity:hover', payload);
    });

    sprite.on('pointerout', () => {
      sprite.clearTint();
      sprite.setScale(baseScaleX, baseScaleY);
      eventBus.emit('entity:hoverEnd', { id: payload.id });
    });

    sprite.on('pointerdown', () => {
      if (onActivate) {
        onActivate();
      } else {
        // Touch-friendly fallback: show educational card for trees, vehicles & cottages
        eventBus.emit('entity:hover', payload);
        if (this.touchClearTimer) {
          this.touchClearTimer.remove(false);
        }
        this.touchClearTimer = this.scene.time.delayedCall(4500, () => {
          eventBus.emit('entity:hoverEnd', { id: payload.id });
        });
      }
    });
  }

  /**
   * Registers one of the 7 new learning houses for proximity walking interaction
   * (so walking to its doorway shows the ZonePrompt and lets the student press E!).
   */
  public registerLearningHouseProximity(building: BuildingPlacement): void {
    const cx = building.tileX * TILE_SIZE;
    const cy = building.tileY * TILE_SIZE;
    // Generous doorway approach zone in front of the house
    const rect = new Phaser.Geom.Rectangle(cx - 84, cy - 68, 168, 108);
    this.proximityHouses.push({ building, rect });
  }

  /**
   * Updates doorway proximity checks for the 7 new interactive learning houses.
   */
  public update(hasActiveCoreZone: boolean): void {
    if (hasActiveCoreZone) {
      if (this.activeHouse) {
        eventBus.emit('house:leave', { id: this.activeHouse.id });
        this.activeHouse = null;
      }
      return;
    }

    const avatarBounds = this.avatar.getBounds();
    let matched: BuildingPlacement | null = null;

    for (const item of this.proximityHouses) {
      if (Phaser.Geom.Intersects.RectangleToRectangle(avatarBounds, item.rect)) {
        matched = item.building;
        break;
      }
    }

    if (matched && matched !== this.activeHouse) {
      this.activeHouse = matched;
      eventBus.emit('house:hover', {
        id: matched.id,
        name: matched.name,
        icon: matched.icon,
        isCivic: matched.category === 'civic_center',
      });
    } else if (!matched && this.activeHouse) {
      eventBus.emit('house:leave', { id: this.activeHouse.id });
      this.activeHouse = null;
    }
  }

  public triggerActiveLearningHouse(): boolean {
    if (this.activeHouse) {
      if (this.activeHouse.category === 'civic_center') {
        eventBus.emit('civic:enter', {
          id: this.activeHouse.id,
          name: this.activeHouse.name,
        });
      } else {
        eventBus.emit('house:enter', {
          id: this.activeHouse.id,
          name: this.activeHouse.name,
        });
      }
      return true;
    }
    return false;
  }

  public getActiveLearningHouse(): BuildingPlacement | null {
    return this.activeHouse;
  }
}
