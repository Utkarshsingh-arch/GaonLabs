import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { DemoProfile } from '../types';
import { setDemoSession, clearDemoSession, getDemoSession } from './demoAuth';

function cleanEnvString(val: any, fallback: string): string {
  if (!val || typeof val !== 'string') return fallback;
  const cleaned = val.replace(/^["']|["']$/g, '').trim();
  try {
    if (fallback.startsWith('http')) {
      new URL(cleaned);
    }
    return cleaned || fallback;
  } catch {
    return fallback;
  }
}

const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

const SUPABASE_URL = cleanEnvString(rawUrl, 'https://eqiklrnddocsymrnsppk.supabase.co');
const SUPABASE_ANON_KEY = cleanEnvString(rawKey, 'sb_publishable_Fn-AHpU2VKpfj9HFRaCklg_nJI3JZdj');

function createSafeSupabaseClient(): SupabaseClient {
  try {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (err) {
    console.warn('Failed to initialize Supabase client:', err);
    return {
      auth: {
        signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
    } as any;
  }
}

export const supabase: SupabaseClient = createSafeSupabaseClient();

export interface SignUpStudentParams {
  name: string;
  email: string;
  password: string;
  boardId: string;
  boardName: string;
  grade: number;
  medium: string;
  mediumName: string;
  schoolName?: string;
}

/**
 * Register a new individual student with Supabase Auth and save profile metadata.
 */
export async function signUpStudent(params: SignUpStudentParams) {
  const { name, email, password, boardId, boardName, grade, medium, mediumName, schoolName } = params;

  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        name: name.trim(),
        boardId,
        boardName,
        grade,
        medium,
        mediumName,
        schoolName: schoolName || 'Rural Model School',
        subjects: ['Mathematics', 'Science'],
      },
    },
  });

  if (error) {
    throw error;
  }

  // Build the active student profile
  const profile: DemoProfile = {
    name: name.trim(),
    email: email.trim(),
    boardId,
    boardName,
    grade,
    medium,
    mediumName,
    subjects: ['Mathematics', 'Science'],
    schoolName: schoolName || 'Rural Model School',
  };

  setDemoSession(profile);
  return { user: data.user, session: data.session, profile };
}

/**
 * Sign in an existing individual student with email & password.
 */
export async function signInStudent(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    throw error;
  }

  const user = data.user;
  const meta = user.user_metadata || {};

  const profile: DemoProfile = {
    name: meta.name || email.split('@')[0],
    email: user.email || email.trim(),
    boardId: meta.boardId || 'CBSE',
    boardName: meta.boardName || 'Central Board of Secondary Education',
    grade: Number(meta.grade) || 8,
    medium: meta.medium || 'en',
    mediumName: meta.mediumName || (meta.medium === 'kn' ? 'Kannada (ಕನ್ನಡ)' : 'English'),
    subjects: meta.subjects || ['Mathematics', 'Science'],
    schoolName: meta.schoolName || 'Rural Model School',
  };

  setDemoSession(profile);
  return { user: data.user, session: data.session, profile };
}

/**
 * Sign out current student from Supabase and clear session.
 */
export async function signOutStudent() {
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn('Supabase signOut warning:', err);
  } finally {
    clearDemoSession();
  }
}

/**
 * Check if a student is authenticated via Supabase session or demo session.
 */
export async function getActiveStudentSession(): Promise<DemoProfile | null> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      const user = data.session.user;
      const meta = user.user_metadata || {};
      const profile: DemoProfile = {
        name: meta.name || user.email?.split('@')[0] || 'Student',
        email: user.email || '',
        boardId: meta.boardId || 'CBSE',
        boardName: meta.boardName || 'Central Board of Secondary Education',
        grade: Number(meta.grade) || 8,
        medium: meta.medium || 'en',
        mediumName: meta.mediumName || 'English',
        subjects: meta.subjects || ['Mathematics', 'Science'],
        schoolName: meta.schoolName,
      };
      setDemoSession(profile);
      return profile;
    }
  } catch (err) {
    console.warn('Error fetching Supabase session:', err);
  }

  return getDemoSession();
}
