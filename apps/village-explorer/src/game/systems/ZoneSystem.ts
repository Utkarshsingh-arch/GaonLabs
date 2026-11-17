import Phaser from 'phaser';
import { eventBus } from '../eventBus';
import { Avatar } from '../entities/Avatar';

export interface ZoneData {
  id: string; // 'house' | 'well' | 'farm' | 'tank' | 'solar' | 'soil'
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  isCompleted?: boolean;
}

export class ZoneSystem {
  private scene: Phaser.Scene;
  private avatar: Avatar;
  private zones: ZoneData[] = [];
  private activeZone: ZoneData | null = null;
  private completedZones: Set<string> = new Set();
  private zoneVisuals: Map<
    string,
    { label: Phaser.GameObjects.Text; star?: Phaser.GameObjects.Text; glowRing: Phaser.GameObjects.Ellipse }
  > = new Map();

  constructor(scene: Phaser.Scene, avatar: Avatar, map: Phaser.Tilemaps.Tilemap) {
    this.scene = scene;
    this.avatar = avatar;

    this.parseZonesFromMap(map);
    this.createZoneVisuals();

    // Listen to lab completion events to place stars above completed buildings
    eventBus.on('lab:completed', (zoneId: string) => {
      this.markZoneCompleted(zoneId);
    });
  }

  private parseZonesFromMap(map: Phaser.Tilemaps.Tilemap): void {
    const zoneObjects = map.getObjectLayer('zones')?.objects;
    if (!zoneObjects) {
      console.warn('No "zones" object layer found in map');
      return;
    }

    zoneObjects.forEach((obj) => {
      const zoneIdProp = obj.properties?.find((p: { name: string; value: string }) => p.name === 'zoneId')?.value || obj.name;
      const titleProp = obj.properties?.find((p: { name: string; value: string }) => p.name === 'title')?.value || obj.name;

      this.zones.push({
        id: zoneIdProp,
        name: titleProp,
        x: obj.x ?? 0,
        y: obj.y ?? 0,
        width: obj.width ?? 64,
        height: obj.height ?? 64,
      });
    });
  }

  private createZoneVisuals(): void {
    this.zones.forEach((zone) => {
      // Subtle warm golden doorstep beacon ellipse (replaces flat yellow box!)
      const glowRing = this.scene.add.ellipse(
        zone.x + zone.width / 2,
        zone.y + zone.height - 16,
        56,
        20,
        0xfbbf24,
        0.16
      );
      glowRing.setStrokeStyle(1.5, 0xf59e0b, 0.55);
      glowRing.setDepth(2);

      // Compact, crisp floating badge above structure (always above tall roofs)
      const label = this.scene.add.text(
        zone.x + zone.width / 2,
        zone.y - 6,
        `🔬 ${zone.name}`,
        {
          fontSize: '10px',
          fontFamily: 'system-ui, sans-serif',
          fontStyle: 'bold',
          color: '#fef3c7',
          backgroundColor: '#0f172ad9',
          padding: { x: 6, y: 3 },
        }
      );
      label.setOrigin(0.5, 1);
      label.setDepth(2000);

      this.zoneVisuals.set(zone.id, { label, glowRing });
    });
  }

  public update(): void {
    const avatarBounds = this.avatar.getBounds();
    let currentOverlap: ZoneData | null = null;

    for (const zone of this.zones) {
      const zoneRect = new Phaser.Geom.Rectangle(zone.x, zone.y, zone.width, zone.height);
      if (Phaser.Geom.Intersects.RectangleToRectangle(avatarBounds, zoneRect)) {
        currentOverlap = zone;
        break;
      }
    }

    if (currentOverlap && currentOverlap !== this.activeZone) {
      if (this.activeZone) {
        const prevVis = this.zoneVisuals.get(this.activeZone.id);
        prevVis?.glowRing.setFillStyle(0xfbbf24, 0.16);
      }
      this.activeZone = currentOverlap;
      const vis = this.zoneVisuals.get(currentOverlap.id);
      vis?.glowRing.setFillStyle(0xfbbf24, 0.36);

      eventBus.emit('zone:hover', {
        id: currentOverlap.id,
        name: currentOverlap.name,
        isCompleted: this.completedZones.has(currentOverlap.id),
      });
    } else if (!currentOverlap && this.activeZone) {
      const prevVis = this.zoneVisuals.get(this.activeZone.id);
      prevVis?.glowRing.setFillStyle(0xfbbf24, 0.16);
      eventBus.emit('zone:leave', { id: this.activeZone.id });
      this.activeZone = null;
    }
  }

  public getActiveZone(): ZoneData | null {
    return this.activeZone;
  }

  public triggerActiveZoneInteraction(): void {
    if (this.activeZone) {
      eventBus.emit('zone:enter', {
        id: this.activeZone.id,
        name: this.activeZone.name,
      });
    }
  }

  public markZoneCompleted(zoneId: string): void {
    this.completedZones.add(zoneId);
    const visuals = this.zoneVisuals.get(zoneId);
    if (visuals && !visuals.star) {
      const star = this.scene.add.text(
        visuals.label.x,
        visuals.label.y - 18,
        '★ COMPLETED',
        {
          fontSize: '9px',
          fontFamily: 'system-ui, sans-serif',
          color: '#fbbf24',
          fontStyle: 'bold',
          backgroundColor: '#064e3be6',
          padding: { x: 5, y: 2 },
        }
      );
      star.setOrigin(0.5, 1);
      star.setDepth(2002);
      visuals.star = star;
    }
  }
}
