import { db, UserProfileRecord, CompletedLabRecord, BadgeRecord, ConceptMasteryRecord } from './db';
import { Lang, ZoneId } from '../learning/types';

export const BADGE_DEFINITIONS: Record<ZoneId, { title: Record<Lang, string>; icon: string; description: Record<Lang, string> }> = {
  house: {
    icon: '🏛️',
    title: {
      en: 'Eco-Architect',
      hi: 'पर्यावरण-वास्तुकार',
      kn: 'ಪರಿಸರ-ವಾಸ್ತುಶಿಲ್ಪಿ',
    },
    description: {
      en: 'Mastered passive cooling, rainwater harvesting, and vernacular architecture.',
      hi: 'प्राकृतिक ठंडक, वर्षा जल संचयन और ग्रामीण भवन निर्माण में दक्षता।',
      kn: 'ನೈಸರ್ಗಿಕ ತಂಪಾಗಿಸುವಿಕೆ ಮತ್ತು ಮಳೆನೀರು ಕೊಯ್ಲಿನ ಪರಿಕಲ್ಪನೆಯನ್ನು ಕರಗತ ಮಾಡಿಕೊಂಡಿದ್ದಾರೆ.',
    },
  },
  well: {
    icon: '🌊',
    title: {
      en: 'Hydrology Pioneer',
      hi: 'जल-अन्वेषक',
      kn: 'ಜಲ-ಅನ್ವೇಷಕ',
    },
    description: {
      en: 'Mastered pulleys, groundwater tables, and hydrostatic volume.',
      hi: 'घिरनी प्रणाली, भूजल स्तर और जल आयतन गणना में दक्षता।',
      kn: 'ಕಪ್ಪಿ, ಅಂತರ್ಜಲ ಮಟ್ಟ ಮತ್ತು ಜಲಸ್ಥಿತಿ ಗಾತ್ರದ ಲೆಕ್ಕಾಚಾರದಲ್ಲಿ ಪರಿಣತಿ.',
    },
  },
  farm: {
    icon: '🌾',
    title: {
      en: 'Agri-Scientist',
      hi: 'कृषि-वैज्ञानिक',
      kn: 'ಕೃಷಿ-ವಿಜ್ಞಾನಿ',
    },
    description: {
      en: 'Mastered crop water efficiency, field geometry, and nitrogen cycles.',
      hi: 'फसल जल दक्षता, खेत का क्षेत्रफल और नाइट्रोजन चक्र में महारत।',
      kn: 'ಬೆಳೆಗಳ ನೀರಿನ ಅಗತ್ಯ, ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ ಮತ್ತು ಸಾರಜನಕ ಚಕ್ರದ ಕರಗತ.',
    },
  },
  tank: {
    icon: '🗼',
    title: {
      en: 'Pressure Engineer',
      hi: 'दाब-अभियंता',
      kn: 'ಒತ್ತಡ-ಎಂಜಿನಿಯರ್',
    },
    description: {
      en: 'Mastered hydrostatic pressure, potential energy, and hydraulic head.',
      hi: 'जलस्थैतिक दबाव (P = ρgh), स्थितिज ऊर्जा और ऊंचाई के सिद्धांत में दक्षता।',
      kn: 'ಜಲಸ್ಥಿತಿ ಒತ್ತಡ ಮತ್ತು ಸ್ಥಿತಿಜ ಶಕ್ತಿಯ ತತ್ವಗಳಲ್ಲಿ ಪರಿಣಿತಿ.',
    },
  },
  solar: {
    icon: '⚡',
    title: {
      en: 'Solar Dynamo',
      hi: 'सौर-ऊर्जावान',
      kn: 'ಸೌರ-ಡೈನಮೊ',
    },
    description: {
      en: 'Mastered the photovoltaic effect, electrical power (P=VI), and solar geometry.',
      hi: 'फोटोवोल्टाइक प्रभाव, सौर ऊर्जा उत्पादन (P = V × I) और पैनल संरेखण में दक्षता।',
      kn: 'ದ್ಯುತಿವಿದ್ಯುತ್ ಪರಿಣಾಮ ಮತ್ತು ಸೌರ ವಿದ್ಯುತ್ ಉತ್ಪಾದನೆಯಲ್ಲಿ ಪರಿಣತಿ.',
    },
  },
  soil: {
    icon: '🧪',
    title: {
      en: 'Soil Alchemist',
      hi: 'मृदा-रसायनज्ञ',
      kn: 'ಮಣ್ಣಿನ-ರಸಾಯನತಜ್ಞ',
    },
    description: {
      en: 'Mastered soil pH, acid neutralization with lime, and vermicompost biology.',
      hi: 'मिट्टी का pH, अम्लता सुधार और जैविक खाद के सिद्धांतों में दक्षता।',
      kn: 'ಮಣ್ಣಿನ pH, ಆಮ್ಲೀಯತೆ ತಟಸ್ಥೀಕರಣ ಮತ್ತು ಸಾವಯವ ಕೃಷಿಯ ಪರಿಣತಿ.',
    },
  },
};

// In-memory fallback stores for non-browser / unit test environments
const memProfile: Map<string, UserProfileRecord> = new Map();
const memCompletedLabs: Map<string, CompletedLabRecord> = new Map();
const memConcepts: Map<string, ConceptMasteryRecord> = new Map();
const memBadges: Map<string, BadgeRecord> = new Map();

const isIndexedDbAvailable = () => typeof indexedDB !== 'undefined';

export const progressStore = {
  async getProfile(): Promise<UserProfileRecord | null> {
    if (!isIndexedDbAvailable()) {
      return memProfile.get('current') || null;
    }
    try {
      const profile = await db.profile.get('current');
      return profile || null;
    } catch (err) {
      console.warn('Error fetching profile from Dexie, using fallback:', err);
      return memProfile.get('current') || null;
    }
  },

  async saveProfile(data: Partial<UserProfileRecord>): Promise<UserProfileRecord> {
    const existing = await this.getProfile();
    const now = Date.now();

    const record: UserProfileRecord = {
      id: 'current',
      nickname: data.nickname || existing?.nickname || 'Learner',
      avatarId: data.avatarId || existing?.avatarId || 'avatar_1',
      lang: data.lang || existing?.lang || 'en',
      grade: data.grade || existing?.grade || 7,
      xp: data.xp !== undefined ? data.xp : existing?.xp || 0,
      aiFeaturesEnabled: data.aiFeaturesEnabled !== undefined ? data.aiFeaturesEnabled : existing?.aiFeaturesEnabled ?? true,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (isIndexedDbAvailable()) {
      try {
        await db.profile.put(record);
      } catch (err) {
        console.warn('Dexie put profile failed:', err);
      }
    }
    memProfile.set('current', record);
    return record;
  },

  async addXp(amount: number): Promise<number> {
    const profile = await this.getProfile();
    const currentXp = profile?.xp || 0;
    const newXp = currentXp + amount;
    await this.saveProfile({ xp: newXp });
    return newXp;
  },

  async recordConceptAttempt(
    concept: string,
    zoneId: ZoneId,
    isCorrect: boolean
  ): Promise<void> {
    let existing: ConceptMasteryRecord | undefined;
    if (isIndexedDbAvailable()) {
      try {
        existing = await db.conceptMastery.get(concept);
      } catch (e) {
        existing = memConcepts.get(concept);
      }
    } else {
      existing = memConcepts.get(concept);
    }

    const attempts = (existing?.attempts || 0) + 1;
    const correctCount = (existing?.correctCount || 0) + (isCorrect ? 1 : 0);
    const masteryScore = correctCount / attempts;

    const record: ConceptMasteryRecord = {
      concept,
      zoneId,
      attempts,
      correctCount,
      masteryScore,
      lastAttemptAt: Date.now(),
    };

    if (isIndexedDbAvailable()) {
      try {
        await db.conceptMastery.put(record);
      } catch (e) {
        memConcepts.set(concept, record);
      }
    }
    memConcepts.set(concept, record);
  },

  async completeLab(zoneId: ZoneId, score: number, questionsCount: number): Promise<BadgeRecord> {
    // 1. Record completed lab
    const labRecord: CompletedLabRecord = {
      zoneId,
      completedAt: Date.now(),
      score,
      questionsCount,
    };
    if (isIndexedDbAvailable()) {
      try {
        await db.completedLabs.put(labRecord);
      } catch (e) {
        memCompletedLabs.set(zoneId, labRecord);
      }
    }
    memCompletedLabs.set(zoneId, labRecord);

    // 2. Award +100 XP
    await this.addXp(100);

    // 3. Award Badge
    const badgeDef = BADGE_DEFINITIONS[zoneId];
    const badgeRecord: BadgeRecord = {
      badgeId: `badge_${zoneId}`,
      zoneId,
      title: badgeDef.title,
      icon: badgeDef.icon,
      description: badgeDef.description,
      earnedAt: Date.now(),
    };
    if (isIndexedDbAvailable()) {
      try {
        await db.badges.put(badgeRecord);
      } catch (e) {
        memBadges.set(badgeRecord.badgeId, badgeRecord);
      }
    }
    memBadges.set(badgeRecord.badgeId, badgeRecord);

    return badgeRecord;
  },

  async getCompletedLabs(): Promise<CompletedLabRecord[]> {
    if (!isIndexedDbAvailable()) return Array.from(memCompletedLabs.values());
    try {
      return await db.completedLabs.toArray();
    } catch (e) {
      return Array.from(memCompletedLabs.values());
    }
  },

  async getBadges(): Promise<BadgeRecord[]> {
    if (!isIndexedDbAvailable()) return Array.from(memBadges.values());
    try {
      return await db.badges.toArray();
    } catch (e) {
      return Array.from(memBadges.values());
    }
  },

  async getConceptMastery(): Promise<ConceptMasteryRecord[]> {
    if (!isIndexedDbAvailable()) return Array.from(memConcepts.values());
    try {
      return await db.conceptMastery.toArray();
    } catch (e) {
      return Array.from(memConcepts.values());
    }
  },
};
