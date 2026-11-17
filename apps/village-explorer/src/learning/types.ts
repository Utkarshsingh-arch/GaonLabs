export type Lang = 'en' | 'hi' | 'kn';
export type QType = 'mcq' | 'fill_blank' | 'numeric' | 'scenario' | 'open';
export type ZoneId = 'house' | 'well' | 'farm' | 'tank' | 'solar' | 'soil';

export interface Question {
  id: string; // e.g. "house.g7.012"
  zone: ZoneId;
  grade: 6 | 7 | 8;
  difficulty: 1 | 2 | 3;
  type: QType;
  concept: string; // e.g. "rainwater_harvest_volume"
  text: Record<Lang, string>;
  // Type-specific fields
  options?: Record<Lang, string[]>; // mcq / scenario
  correctIndex?: number; // mcq / scenario
  blanks?: { answer: string[] }[]; // fill_blank: accepted answers
  numeric?: { answer: number; tolerance: number; unit?: string };
  // Open-ended grading rubric (for AI evaluation in Phase 5)
  rubric?: {
    keyPoints: Record<Lang, string[]>;
    commonMisconceptions?: Record<Lang, string[]>;
    modelAnswer: Record<Lang, string>;
  };
  hints: Record<Lang, string[]>; // 2-3 progressive hints
  explanation: Record<Lang, string>; // shown after answering
}

export interface Evaluation {
  correct: boolean;
  score: number; // 0..1
  feedback: string;
  hitKeyPoints?: string[];
  missedKeyPoints?: string[];
  misconception?: string;
  nextAction: 'continue' | 'hint' | 'followup' | 'retry';
}

export interface ZoneDef {
  id: ZoneId;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  intro: Record<Lang, string>;
  icon: string;
  labQuestionIds?: string[];
}
