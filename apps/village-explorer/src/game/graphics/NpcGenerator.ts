import Phaser from 'phaser';

export interface NpcSpriteStyle {
  key: string;
  skin: string;
  shirt: string;
  accent: string;
  pants: string;
  hair: string;
  hat?: string;
  badge?: string;
}

export const NPC_SPRITE_STYLES: NpcSpriteStyle[] = [
  { key: 'npc_doctor', skin: '#f0b27a', shirt: '#f8fafc', accent: '#0d9488', pants: '#1e293b', hair: '#231712', badge: '#dc2626' },
  { key: 'npc_nurse', skin: '#d28e5d', shirt: '#e0f2fe', accent: '#0284c7', pants: '#334155', hair: '#1e1b18', hat: '#ffffff' },
  { key: 'npc_station_master', skin: '#d28e5d', shirt: '#f8fafc', accent: '#f59e0b', pants: '#1e3a8a', hair: '#231712', hat: '#1e3a8a' },
  { key: 'npc_conductor', skin: '#f0b27a', shirt: '#1e293b', accent: '#facc15', pants: '#0f172a', hair: '#3b241d', hat: '#334155' },
  { key: 'npc_shopkeeper', skin: '#d28e5d', shirt: '#ea580c', accent: '#fef3c7', pants: '#451a03', hair: '#231712' },
  { key: 'npc_vendor', skin: '#9d623d', shirt: '#16a34a', accent: '#facc15', pants: '#3f6212', hair: '#1e1b18' },
  { key: 'npc_bank_manager', skin: '#f0b27a', shirt: '#1e3a8a', accent: '#fbbf24', pants: '#0f172a', hair: '#3b241d' },
  { key: 'npc_bank_cashier', skin: '#d28e5d', shirt: '#0369a1', accent: '#e0f2fe', pants: '#1e293b', hair: '#231712' },
  { key: 'npc_farmer', skin: '#9d623d', shirt: '#ca8a04', accent: '#fef08a', pants: '#57534e', hair: '#231712', hat: '#fef3c7' },
  { key: 'npc_scientist', skin: '#f0b27a', shirt: '#f1f5f9', accent: '#7c3aed', pants: '#312e81', hair: '#475569' },
  { key: 'npc_engineer', skin: '#d28e5d', shirt: '#2563eb', accent: '#f97316', pants: '#1e293b', hair: '#231712', hat: '#facc15' },
  { key: 'npc_forest_officer', skin: '#9d623d', shirt: '#15803d', accent: '#854d0e', pants: '#14532d', hair: '#231712', hat: '#166534' },
];

/**
 * Generates crisp 40x44 pixel-art sprites for all village NPCs with soft shadows
 * and profession-distinct uniforms/caps/coats.
 */
export function generateNpcSprites(scene: Phaser.Scene): void {
  NPC_SPRITE_STYLES.forEach((st) => {
    if (scene.textures.exists(st.key)) return;
    const c = scene.textures.createCanvas(st.key, 40, 44);
    if (!c) return;
    const ctx = c.getContext();
    ctx.imageSmoothingEnabled = false;

    const px = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    };

    // Soft ground shadow
    ctx.fillStyle = 'rgba(10, 20, 10, 0.30)';
    ctx.beginPath();
    ctx.ellipse(20, 39, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs & Shoes
    px(14, 28, 5, 9, st.pants);
    px(21, 28, 5, 9, st.pants);
    px(13, 36, 6, 3, '#1e1b18');
    px(21, 36, 6, 3, '#1e1b18');

    // Arms
    px(9, 19, 4, 9, st.shirt);
    px(27, 19, 4, 9, st.shirt);
    px(9, 27, 3, 3, st.skin);
    px(28, 27, 3, 3, st.skin);

    // Torso (outline + shirt + role accent/coat lapel)
    px(12, 17, 16, 13, '#1e1b18');
    px(13, 18, 14, 11, st.shirt);
    px(18, 18, 4, 10, st.accent);
    if (st.badge) {
      px(23, 20, 3, 3, st.badge);
    }

    // Head
    px(13, 6, 14, 12, '#1e1b18');
    px(14, 7, 12, 10, st.skin);
    // Hair
    px(13, 5, 14, 4, st.hair);
    // Role Cap / Turban / Helmet
    if (st.hat) {
      px(12, 3, 16, 4, st.hat);
      px(14, 2, 12, 2, st.hat);
    }
    // Eyes & Smile
    px(16, 11, 2, 2, '#111827');
    px(22, 11, 2, 2, '#111827');
    px(18, 14, 4, 1, '#9a3412');

    c.refresh();
  });
}
