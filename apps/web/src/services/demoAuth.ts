import { DemoProfile } from '../types';

export const DEMO_PROFILES: Record<string, DemoProfile & { passwordHint: string }> = {
  asha: {
    name: 'Asha Rao',
    email: 'asha.cbse@gaonlab.demo',
    passwordHint: 'Demo@123',
    boardId: 'CBSE',
    boardName: 'Central Board of Secondary Education',
    grade: 8,
    medium: 'en',
    mediumName: 'English',
    subjects: ['Mathematics', 'Science'],
    schoolName: 'Govt. Model Middle School, Hosur',
    interests: 'Robotics, Plant Biology, Star Gazing',
  },
  kavya: {
    name: 'Kavya Hegde',
    email: 'kavya.ktbs@gaonlab.demo',
    passwordHint: 'Demo@123',
    boardId: 'KARNATAKA_STATE_BOARD',
    boardName: 'Karnataka State Board',
    grade: 7,
    medium: 'kn',
    mediumName: 'Kannada (ಕನ್ನಡ)',
    subjects: ['Mathematics', 'Science'],
    schoolName: 'GHS Sirsi, Uttara Kannada',
    interests: 'Soil Science, Farming Tools, Arithmetic Puzzles',
  },
};

const STORAGE_KEY = 'gaonlab_demo_session';

export function getDemoSession(): DemoProfile | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as DemoProfile;
  } catch {
    return null;
  }
}

export function setDemoSession(profile: DemoProfile): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save demo session to sessionStorage:', err);
  }
}

export function clearDemoSession(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear demo session:', err);
  }
}
