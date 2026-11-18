import Phaser from 'phaser';
import { TILE_SIZE } from '../config';
import { VILLAGE_NPCS, VillageNpcDef } from '../data/civicExpansionData';
import { InteractionSystem } from './InteractionSystem';
import { eventBus } from '../eventBus';

/**
 * Spawns and manages purposeful educational NPCs across the village
 * (Doctor, Nurse, Station Master, Conductor, Shopkeeper, Vendor, Bank Manager,
 * Cashier, Farmer, Scientist, Engineer, Forest Officer).
 * Rotates dialogues per NPC so interactions stay varied and fresh.
 */
export class NpcSystem {
  private dialogueCounters: Map<string, number> = new Map();

  constructor(scene: Phaser.Scene, interactionSystem: InteractionSystem) {
    VILLAGE_NPCS.forEach((npc, index) => {
      const wx = npc.tileX * TILE_SIZE;
      const wy = npc.tileY * TILE_SIZE;

      const sprite = scene.add.image(wx, wy, npc.spriteKey);
      sprite.setOrigin(0.5, 0.9);
      sprite.setDepth(wy + 4);

      // Gentle breathing/idle bob animation (very lightweight)
      scene.tweens.add({
        targets: sprite,
        y: wy - 2,
        duration: 1400 + (index % 4) * 220,
        delay: (index % 5) * 160,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Small floating speech indicator icon above NPC
      const tag = scene.add.text(wx, wy - 42, `${npc.icon} ${npc.name.en}`, {
        fontSize: '9px',
        fontFamily: 'system-ui, sans-serif',
        fontStyle: 'bold',
        color: '#fef9c3',
        backgroundColor: '#0f172ad4',
        padding: { x: 4, y: 2 },
      });
      tag.setOrigin(0.5, 1);
      tag.setDepth(1990);

      interactionSystem.registerInteractive(
        sprite,
        {
          id: npc.curriculumEntityKey,
          name: `${npc.name.en} (${npc.role.en})`,
          icon: npc.icon,
          category: 'npc',
          subject: npc.role.en,
          description: npc.dialogues.en[0].replace('{name}', 'Adventurer'),
          hint: 'Click or tap to talk & start challenge',
        },
        () => {
          this.triggerNpcDialogue(npc);
        }
      );
    });
  }

  public triggerNpcDialogue(npc: VillageNpcDef): void {
    const count = this.dialogueCounters.get(npc.id) ?? 0;
    this.dialogueCounters.set(npc.id, count + 1);
    eventBus.emit('npc:interact', {
      npc,
      dialogueIndex: count,
    });
  }
}
