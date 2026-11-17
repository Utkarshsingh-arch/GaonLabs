import { describe, it, expect } from 'vitest';
import {
  DEFAULT_BOY_AVATAR,
  DEFAULT_GIRL_AVATAR,
  decodeAvatarId,
  encodeAvatarId,
  AvatarCustomization,
} from '../game/graphics/avatarAppearance';
import { progressStore } from '../storage/progressStore';
import { eventBus } from '../game/eventBus';
import { SupportedGrade } from '../learning/curriculum/ncertRegistry';

describe('Adventure Onboarding & Live Boy/Girl Character Creation Tests', () => {
  it('encodes and decodes Boy and Girl customised character appearances losslessly', () => {
    const boyCustom: AvatarCustomization = {
      presentation: 'boy',
      skinTone: 'wheatish',
      hairStyle: 'spiky',
      outfitStyle: 'explorer_jacket',
      outfitColor: 'emerald',
    };

    const girlCustom: AvatarCustomization = {
      presentation: 'girl',
      skinTone: 'deep',
      hairStyle: 'ponytail',
      outfitStyle: 'lab_tunic',
      outfitColor: 'violet',
    };

    const boyId = encodeAvatarId(boyCustom);
    const girlId = encodeAvatarId(girlCustom);

    expect(boyId).toBe('char:boy:wheatish:spiky:explorer_jacket:emerald');
    expect(girlId).toBe('char:girl:deep:ponytail:lab_tunic:violet');

    expect(decodeAvatarId(boyId)).toEqual(boyCustom);
    expect(decodeAvatarId(girlId)).toEqual(girlCustom);
  });

  it('gracefully decodes legacy avatar IDs (avatar_1, avatar_2, avatar_3) without breaking saved profiles', () => {
    expect(decodeAvatarId('avatar_1').presentation).toBe('boy');
    expect(decodeAvatarId('avatar_2').presentation).toBe('girl');
    expect(decodeAvatarId('avatar_3').presentation).toBe('boy');
    expect(decodeAvatarId(undefined)).toEqual(DEFAULT_BOY_AVATAR);
  });

  it('persists nickname, language, all 7 NCERT classes (6-12), Girl/Boy character, and AI Tutor toggle', async () => {
    const classes: SupportedGrade[] = [6, 7, 8, 9, 10, 11, 12];
    const girlAvatarId = encodeAvatarId(DEFAULT_GIRL_AVATAR);

    for (const g of classes) {
      const saved = await progressStore.saveProfile({
        nickname: 'Ananya',
        lang: 'kn',
        grade: g,
        avatarId: girlAvatarId,
        aiFeaturesEnabled: false,
      });

      expect(saved.nickname).toBe('Ananya');
      expect(saved.lang).toBe('kn');
      expect(saved.grade).toBe(g);
      expect(saved.avatarId).toBe(girlAvatarId);
      expect(saved.aiFeaturesEnabled).toBe(false);
    }

    // Re-enabling AI Tutor preserves toggle state accurately
    const reEnabled = await progressStore.saveProfile({ aiFeaturesEnabled: true });
    expect(reEnabled.aiFeaturesEnabled).toBe(true);
  });

  it('synchronizes selected character into the live village via eventBus avatar:update', () => {
    let syncedAvatarId = '';
    const listener = (avatarId: string) => {
      syncedAvatarId = avatarId;
    };

    const encoded = encodeAvatarId({
      ...DEFAULT_GIRL_AVATAR,
      hairStyle: 'braids',
      outfitColor: 'sky',
    });

    eventBus.on('avatar:update', listener);
    eventBus.emit('avatar:update', encoded);

    expect(syncedAvatarId).toBe(encoded);
    expect(decodeAvatarId(syncedAvatarId).presentation).toBe('girl');
    expect(decodeAvatarId(syncedAvatarId).outfitColor).toBe('sky');

    eventBus.off('avatar:update', listener);
  });
});
