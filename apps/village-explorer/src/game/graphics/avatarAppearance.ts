export const AVATAR_FRAME_W = 48;
export const AVATAR_FRAME_H = 48;

export type CharacterPresentation = 'boy' | 'girl';
export type SkinToneId = 'fair' | 'warm' | 'wheatish' | 'deep';
export type HairStyleId = 'short' | 'spiky' | 'braids' | 'ponytail' | 'bob';
export type OutfitStyleId = 'kurta_vest' | 'explorer_jacket' | 'lab_tunic';
export type OutfitColorId = 'saffron' | 'emerald' | 'sky' | 'crimson' | 'violet';

export interface AvatarCustomization {
  presentation: CharacterPresentation;
  skinTone: SkinToneId;
  hairStyle: HairStyleId;
  outfitStyle: OutfitStyleId;
  outfitColor: OutfitColorId;
}

export const SKIN_TONES: Record<SkinToneId, { label: string; base: string; light: string; shade: string; cheek: string }> = {
  fair: { label: 'Light', base: '#fbd3b0', light: '#fde3c8', shade: '#e2ae86', cheek: '#f4a393' },
  warm: { label: 'Warm', base: '#f0b27a', light: '#f8c697', shade: '#d4925c', cheek: '#e88b76' },
  wheatish: { label: 'Medium', base: '#d28e5d', light: '#e0a273', shade: '#b37143', cheek: '#cf745f' },
  deep: { label: 'Deep', base: '#9d623d', light: '#b2754d', shade: '#7d4a2b', cheek: '#b35c4a' },
};

export const OUTFIT_COLORS: Record<
  OutfitColorId,
  { label: string; primary: string; highlight: string; dark: string; accent: string }
> = {
  saffron: { label: 'Saffron', primary: '#ea580c', highlight: '#f97316', dark: '#c2410c', accent: '#0f766e' },
  emerald: { label: 'Emerald', primary: '#059669', highlight: '#10b981', dark: '#047857', accent: '#d97706' },
  sky: { label: 'Sky Blue', primary: '#0284c7', highlight: '#38bdf8', dark: '#0369a1', accent: '#f59e0b' },
  crimson: { label: 'Rose Red', primary: '#e11d48', highlight: '#fb7185', dark: '#be123c', accent: '#fbbf24' },
  violet: { label: 'Royal Violet', primary: '#7c3aed', highlight: '#a78bfa', dark: '#5b21b6', accent: '#facc15' },
};

export const HAIR_STYLES: Array<{ id: HairStyleId; label: string; defaultFor?: CharacterPresentation }> = [
  { id: 'short', label: 'Classic', defaultFor: 'boy' },
  { id: 'spiky', label: 'Spiky', defaultFor: 'boy' },
  { id: 'braids', label: 'Braids', defaultFor: 'girl' },
  { id: 'ponytail', label: 'Ponytail', defaultFor: 'girl' },
  { id: 'bob', label: 'Bob Cut' },
];

export const OUTFIT_STYLES: Array<{ id: OutfitStyleId; label: string }> = [
  { id: 'kurta_vest', label: 'Village Vest' },
  { id: 'explorer_jacket', label: 'Explorer Coat' },
  { id: 'lab_tunic', label: 'STEM Tunic' },
];

export const DEFAULT_BOY_AVATAR: AvatarCustomization = {
  presentation: 'boy',
  skinTone: 'warm',
  hairStyle: 'short',
  outfitStyle: 'kurta_vest',
  outfitColor: 'saffron',
};

export const DEFAULT_GIRL_AVATAR: AvatarCustomization = {
  presentation: 'girl',
  skinTone: 'warm',
  hairStyle: 'braids',
  outfitStyle: 'kurta_vest',
  outfitColor: 'crimson',
};

/**
 * Encodes AvatarCustomization into the persisted UserProfileRecord.avatarId string.
 */
export function encodeAvatarId(custom: AvatarCustomization): string {
  return `char:${custom.presentation}:${custom.skinTone}:${custom.hairStyle}:${custom.outfitStyle}:${custom.outfitColor}`;
}

/**
 * Decodes UserProfileRecord.avatarId into an AvatarCustomization object.
 * Gracefully maps legacy avatar_1 / avatar_2 / avatar_3 IDs for backward compatibility.
 */
export function decodeAvatarId(avatarId?: string | null): AvatarCustomization {
  if (!avatarId) return { ...DEFAULT_BOY_AVATAR };

  if (avatarId === 'avatar_2') {
    return { ...DEFAULT_GIRL_AVATAR, outfitColor: 'sky', outfitStyle: 'lab_tunic' };
  }
  if (avatarId === 'avatar_3') {
    return { ...DEFAULT_BOY_AVATAR, outfitColor: 'emerald', outfitStyle: 'explorer_jacket' };
  }
  if (avatarId === 'avatar_1') {
    return { ...DEFAULT_BOY_AVATAR };
  }

  if (avatarId.startsWith('char:')) {
    const parts = avatarId.split(':');
    const presentation: CharacterPresentation = parts[1] === 'girl' ? 'girl' : 'boy';
    const skinTone: SkinToneId = parts[2] in SKIN_TONES ? (parts[2] as SkinToneId) : 'warm';
    const validHair: HairStyleId[] = ['short', 'spiky', 'braids', 'ponytail', 'bob'];
    const hairStyle: HairStyleId = validHair.includes(parts[3] as HairStyleId)
      ? (parts[3] as HairStyleId)
      : presentation === 'girl'
      ? 'braids'
      : 'short';
    const validOutfits: OutfitStyleId[] = ['kurta_vest', 'explorer_jacket', 'lab_tunic'];
    const outfitStyle: OutfitStyleId = validOutfits.includes(parts[4] as OutfitStyleId)
      ? (parts[4] as OutfitStyleId)
      : 'kurta_vest';
    const outfitColor: OutfitColorId =
      parts[5] in OUTFIT_COLORS
        ? (parts[5] as OutfitColorId)
        : presentation === 'girl'
        ? 'crimson'
        : 'saffron';

    return { presentation, skinTone, hairStyle, outfitStyle, outfitColor };
  }

  return { ...DEFAULT_BOY_AVATAR };
}

/**
 * Shared 48x48 pixel-art character renderer used identically by BOTH
 * the Phaser 3 village Avatar spritesheet AND the onboarding HTML5 preview canvases.
 *
 * Directions: 0:S, 1:SW, 2:W, 3:NW, 4:N, 5:NE, 6:E, 7:SE
 * Frames: 0 (neutral), 1 (stride A), 2 (neutral), 3 (stride B)
 */
export function drawAvatarPixelCharacter(
  ctx: CanvasRenderingContext2D,
  ox: number,
  oy: number,
  direction: number,
  frame: number,
  appearance: AvatarCustomization
): void {
  const px = (x: number, y: number, w: number, h: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(ox + x), Math.floor(oy + y), Math.floor(w), Math.floor(h));
  };

  const skin = SKIN_TONES[appearance.skinTone] || SKIN_TONES.warm;
  const outfit = OUTFIT_COLORS[appearance.outfitColor] || OUTFIT_COLORS.saffron;
  const isGirl = appearance.presentation === 'girl';

  const bob = frame === 1 || frame === 3 ? -2 : 0;
  const stride = frame === 1 ? 3 : frame === 3 ? -3 : 0;
  const armSwing = frame === 1 ? -3 : frame === 3 ? 3 : 0;

  const isSideLeft = direction === 2;
  const isSideRight = direction === 6;
  const isBack = direction === 3 || direction === 4 || direction === 5;

  // 1. Soft elliptical ground shadow beneath feet
  ctx.fillStyle = 'rgba(10, 20, 10, 0.34)';
  ctx.beginPath();
  ctx.ellipse(ox + 24, oy + 42, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Legs & Shoes
  const legColor = isGirl ? '#312e81' : '#1e293b';
  const legHi = isGirl ? '#4338ca' : '#334155';
  const shoeDark = '#451a03';
  const shoeHi = '#78350f';

  if (isSideLeft || isSideRight) {
    px(20 - stride, 30 + bob, 6, 9, legColor);
    px(22 + stride, 30 + bob, 6, 9, legHi);
    px(19 - stride, 38 + bob, 8, 4, shoeDark);
    px(21 + stride, 38 + bob, 8, 4, shoeHi);
  } else {
    const leftLift = frame === 1 ? -2 : 0;
    const rightLift = frame === 3 ? -2 : 0;
    px(17, 30 + bob + leftLift, 6, 9, legColor);
    px(18, 30 + bob + leftLift, 2, 8, legHi);
    px(16, 38 + bob + leftLift, 7, 4, shoeHi);

    px(25, 30 + bob + rightLift, 6, 9, legColor);
    px(26, 30 + bob + rightLift, 2, 8, legHi);
    px(25, 38 + bob + rightLift, 7, 4, shoeHi);
  }

  // 3. Back Explorer Satchel (when facing North/NW/NE)
  if (isBack) {
    px(16, 20 + bob, 16, 11, '#78350f');
    px(18, 21 + bob, 12, 5, '#b45309');
    px(22, 24 + bob, 4, 3, '#fbbf24');
  }

  // 4. Arms (front/back/diagonal)
  if (!isSideLeft && !isSideRight) {
    px(11, 20 + bob + Math.round(armSwing * 0.5), 5, 10, outfit.dark);
    px(12, 21 + bob + Math.round(armSwing * 0.5), 3, 7, outfit.primary);
    px(11, 29 + bob + Math.round(armSwing * 0.5), 4, 3, skin.base);

    px(32, 20 + bob - Math.round(armSwing * 0.5), 5, 10, outfit.dark);
    px(33, 21 + bob - Math.round(armSwing * 0.5), 3, 7, outfit.primary);
    px(33, 29 + bob - Math.round(armSwing * 0.5), 4, 3, skin.base);
  }

  // 5. Torso & Outfit Style
  const torsoX = isSideLeft || isSideRight ? 17 : 15;
  const torsoW = isSideLeft || isSideRight ? 14 : 18;
  const torsoH = isGirl || appearance.outfitStyle === 'lab_tunic' ? 14 : 12;

  px(torsoX - 1, 18 + bob, torsoW + 2, torsoH + 2, '#1e1b18');
  px(torsoX, 19 + bob, torsoW, torsoH, outfit.primary);
  px(torsoX + 2, 19 + bob, torsoW - 4, torsoH - 1, outfit.highlight);

  if (appearance.outfitStyle === 'kurta_vest') {
    if (!isBack) {
      px(torsoX + 1, 19 + bob, 4, 10, outfit.accent);
      px(torsoX + torsoW - 5, 19 + bob, 4, 10, outfit.accent);
      px(torsoX + Math.floor(torsoW / 2) - 2, 19 + bob, 4, 4, '#fef3c7');
    } else {
      px(torsoX + 1, 19 + bob, torsoW - 2, 9, outfit.accent);
    }
  } else if (appearance.outfitStyle === 'explorer_jacket') {
    // Explorer scarf / collar + diagonal satchel strap
    px(torsoX + 1, 19 + bob, torsoW - 2, 3, '#fbbf24');
    if (!isBack) {
      px(torsoX + 3, 22 + bob, 2, 8, '#78350f');
      px(torsoX + torsoW - 6, 24 + bob, 4, 4, outfit.dark); // Pocket
    }
  } else if (appearance.outfitStyle === 'lab_tunic') {
    // Crisp white STEM lab lapel coat over colored shirt
    if (!isBack) {
      px(torsoX, 19 + bob, 5, torsoH, '#f8fafc');
      px(torsoX + torsoW - 5, 19 + bob, 5, torsoH, '#f8fafc');
      px(torsoX + 1, 25 + bob, 3, 3, '#cbd5e1');
    } else {
      px(torsoX + 1, 19 + bob, torsoW - 2, torsoH - 1, '#f1f5f9');
    }
  }

  // Waist belt / sash
  px(torsoX, 29 + bob, torsoW, 2, '#78350f');
  px(23, 29 + bob, 2, 2, '#fbbf24');

  // Tunic skirt flare for girl presentation
  if (isGirl && !isSideLeft && !isSideRight) {
    px(14, 31 + bob, 20, 3, outfit.dark);
    px(15, 31 + bob, 18, 2, outfit.primary);
  }

  // Side profile swinging arm on top of torso
  if (isSideLeft || isSideRight) {
    px(21 + Math.round(armSwing * 0.7), 21 + bob, 5, 9, outfit.primary);
    px(22 + Math.round(armSwing * 0.7), 29 + bob, 4, 3, skin.base);
  }

  // 6. Hair Back Layer (for braids / ponytail / bob behind head)
  const hairDark = '#231712';
  const hairMid = '#3b241d';
  const hairShine = '#5c3c31';
  const ribbonColor = outfit.accent;

  if (appearance.hairStyle === 'braids') {
    if (!isSideLeft && !isSideRight) {
      // Twin neat braids framing shoulders with colorful hair ribbons
      px(12, 11 + bob, 4, 12, hairDark);
      px(13, 12 + bob, 2, 10, hairMid);
      px(12, 20 + bob, 4, 2, ribbonColor);

      px(32, 11 + bob, 4, 12, hairDark);
      px(33, 12 + bob, 2, 10, hairMid);
      px(32, 20 + bob, 4, 2, ribbonColor);
    } else {
      const bx = isSideLeft ? 28 : 16;
      px(bx, 11 + bob, 4, 13, hairDark);
      px(bx + 1, 12 + bob, 2, 10, hairMid);
      px(bx, 21 + bob, 4, 2, ribbonColor);
    }
  } else if (appearance.hairStyle === 'ponytail') {
    if (isBack || isSideLeft || isSideRight) {
      const pxPos = isSideLeft ? 31 : isSideRight ? 12 : 21;
      px(pxPos, 8 + bob, 6, 13, hairDark);
      px(pxPos + 1, 9 + bob, 4, 10, hairMid);
      px(pxPos + 1, 8 + bob, 4, 2, ribbonColor);
    } else {
      // High ponytail peeking behind crown
      px(29, 7 + bob, 5, 11, hairDark);
      px(30, 8 + bob, 3, 9, hairMid);
      px(29, 8 + bob, 4, 2, ribbonColor);
    }
  } else if (appearance.hairStyle === 'bob') {
    px(13, 7 + bob, 22, 11, hairDark);
    px(14, 8 + bob, 20, 9, hairMid);
  }

  // 7. Head & Neck
  px(22, 16 + bob, 4, 3, skin.shade);
  px(15, 5 + bob, 18, 13, '#1e1b18');
  px(16, 4 + bob, 16, 15, '#1e1b18');
  px(16, 6 + bob, 16, 11, skin.base);
  px(17, 5 + bob, 14, 12, skin.light);

  if (!isBack) {
    px(17, 13 + bob, 2, 2, skin.cheek);
    px(29, 13 + bob, 2, 2, skin.cheek);
  }

  // 8. Hair Crown & Bangs
  px(15, 4 + bob, 18, 5, hairDark);
  px(16, 3 + bob, 16, 4, hairMid);
  px(18, 4 + bob, 8, 2, hairShine);

  if (appearance.hairStyle === 'spiky') {
    px(16, 1 + bob, 3, 3, hairDark);
    px(21, 0 + bob, 4, 4, hairMid);
    px(27, 1 + bob, 3, 3, hairDark);
  }

  // Hairband accent for girl hairstyles
  if (isGirl && !isBack) {
    px(17, 5 + bob, 14, 2, ribbonColor);
  }

  // 9. Directional Face / Eyes / Back Hair
  if (isBack) {
    px(16, 5 + bob, 16, 11, hairDark);
    px(17, 6 + bob, 14, 8, hairMid);
    px(19, 6 + bob, 7, 2, hairShine);
  } else if (direction === 0) {
    px(16, 7 + bob, 3, 4, hairDark);
    px(29, 7 + bob, 3, 4, hairDark);
    px(19, 10 + bob, 2, 3, '#111827');
    px(27, 10 + bob, 2, 3, '#111827');
    px(19, 10 + bob, 1, 1, '#ffffff');
    px(27, 10 + bob, 1, 1, '#ffffff');
    if (isGirl) {
      px(18, 9 + bob, 1, 1, '#111827'); // Eyelash accent
      px(29, 9 + bob, 1, 1, '#111827');
    }
    px(22, 14 + bob, 4, 1, '#9a3412');
  } else if (direction === 1) {
    px(28, 7 + bob, 4, 5, hairDark);
    px(18, 10 + bob, 2, 3, '#111827');
    px(24, 10 + bob, 2, 3, '#111827');
    px(18, 10 + bob, 1, 1, '#ffffff');
    px(24, 10 + bob, 1, 1, '#ffffff');
    px(20, 14 + bob, 3, 1, '#9a3412');
  } else if (direction === 2) {
    px(23, 6 + bob, 9, 9, hairDark);
    px(18, 10 + bob, 2, 3, '#111827');
    px(18, 10 + bob, 1, 1, '#ffffff');
  } else if (direction === 6) {
    px(16, 6 + bob, 9, 9, hairDark);
    px(28, 10 + bob, 2, 3, '#111827');
    px(29, 10 + bob, 1, 1, '#ffffff');
  } else if (direction === 7) {
    px(16, 7 + bob, 4, 5, hairDark);
    px(22, 10 + bob, 2, 3, '#111827');
    px(28, 10 + bob, 2, 3, '#111827');
    px(23, 10 + bob, 1, 1, '#ffffff');
    px(29, 10 + bob, 1, 1, '#ffffff');
    px(25, 14 + bob, 3, 1, '#9a3412');
  }
}
