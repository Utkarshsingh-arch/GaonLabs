import Dexie, { Table } from 'dexie';
import { Lang, ZoneId } from '../learning/types';

export interface UserProfileRecord {
  id: string; // 'current'
  nickname: string;
  avatarId: string;
  lang: Lang;
  grade: 6 | 7 | 8;
  xp: number;
  aiFeaturesEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface CompletedLabRecord {
  zoneId: ZoneId;
  completedAt: number;
  score: number;
  questionsCount: number;
}

export interface ConceptMasteryRecord {
  concept: string;
  zoneId: ZoneId;
  attempts: number;
  correctCount: number;
  masteryScore: number; // 0..1
  lastAttemptAt: number;
}

export interface BadgeRecord {
  badgeId: string;
  zoneId: ZoneId;
  title: Record<Lang, string>;
  icon: string;
  description: Record<Lang, string>;
  earnedAt: number;
}

export class VillageExplorerDB extends Dexie {
  profile!: Table<UserProfileRecord, string>;
  completedLabs!: Table<CompletedLabRecord, ZoneId>;
  conceptMastery!: Table<ConceptMasteryRecord, string>;
  badges!: Table<BadgeRecord, string>;

  constructor() {
    super('VillageExplorerDB');

    this.version(1).stores({
      profile: 'id',
      completedLabs: 'zoneId, completedAt',
      conceptMastery: 'concept, zoneId, masteryScore',
      badges: 'badgeId, zoneId, earnedAt',
    });
  }
}

export const db = new VillageExplorerDB();
