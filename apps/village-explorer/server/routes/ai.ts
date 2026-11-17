import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AiProvider } from '../providers/provider';
import { MockAiProvider } from '../providers/mock';
import { GeminiAiProvider } from '../providers/gemini';
import { OllamaAiProvider } from '../providers/ollama';
import {
  EvaluationSchema,
  HintSchema,
  FollowupSchema,
  GeneratedCurriculumQuestionSchema,
  buildEvaluatorPrompt,
  buildCurriculumQuestionPrompt,
} from '../prompts';
import { checkRateLimit, getCachedResponse, setCachedResponse } from '../rateLimit';
import { SupportedGrade } from '../../src/learning/curriculum/ncertRegistry';

export const aiRouter = Router();

// Provider factory
function getProvider(): AiProvider {
  const providerType = (process.env.AI_PROVIDER || 'mock').toLowerCase();

  if (providerType === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiAiProvider();
  }
  if (providerType === 'ollama') {
    return new OllamaAiProvider();
  }
  return new MockAiProvider();
}

const EvaluateRequestSchema = z.object({
  zone: z.string(),
  grade: z.number().min(6).max(12),
  lang: z.enum(['en', 'hi', 'kn']),
  questionId: z.string().optional(),
  questionText: z.string().min(1),
  rubric: z.object({
    keyPoints: z.array(z.string()),
    modelAnswer: z.string(),
  }),
  studentAnswer: z.string().max(500),
  attemptNumber: z.number().default(1),
  sessionId: z.string().default('anonymous_session'),
  curriculumContext: z
    .object({
      curriculumId: z.string(),
      textbook: z.string(),
      chapterNumber: z.number().int().min(1),
      chapterTitle: z.string(),
      learningObjective: z.string(),
    })
    .optional(),
});

const GenerateCurriculumQuestionRequestSchema = z.object({
  curriculumId: z.string().min(1),
  studentGrade: z.number().int().min(6).max(12),
  ncertGrade: z.number().int().min(6).max(12),
  subject: z.string().min(1),
  textbook: z.string().min(1),
  chapterNumber: z.number().int().min(1),
  chapterTitle: z.string().min(1),
  subtopic: z.string().min(1),
  learningObjective: z.string().min(1),
  villageObject: z.string().min(1),
  currentActivity: z.string().default('Exploring village structure'),
  questionType: z.enum(['mcq', 'fill_blank', 'scenario', 'application', 'critical_thinking']).default('mcq'),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2),
  lang: z.enum(['en', 'hi', 'kn']).default('en'),
  isEnrichment: z.boolean().optional(),
  sessionId: z.string().default('anonymous_session'),
});

aiRouter.post('/evaluate', async (req: Request, res: Response) => {
  try {
    const parsedBody = EvaluateRequestSchema.safeParse(req.body);
    if (!parsedBody.success) {
      return res.status(400).json({
        error: 'Invalid request payload',
        details: parsedBody.error.format(),
      });
    }

    const {
      grade,
      lang,
      questionId,
      questionText,
      rubric,
      studentAnswer,
      attemptNumber,
      sessionId,
      curriculumContext,
    } = parsedBody.data;

    // Rate limiting check
    const rateCheck = checkRateLimit(sessionId);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Maximum 30 AI tutoring calls per hour.',
      });
    }

    // Cache lookup
    const normalizedAns = studentAnswer.trim().toLowerCase();
    const cacheKey = `eval_${questionId || questionText}_${normalizedAns}_${lang}`;
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    // Build Prompt & call provider
    const prompt = buildEvaluatorPrompt(
      grade,
      lang,
      questionText,
      rubric.keyPoints,
      rubric.modelAnswer,
      studentAnswer,
      attemptNumber,
      curriculumContext
    );

    const provider = getProvider();
    const evaluation = await provider.generateJson(prompt, EvaluationSchema);

    // Cache valid result
    setCachedResponse(cacheKey, evaluation);

    return res.json(evaluation);
  } catch (err: unknown) {
    console.error('[AI /evaluate Error]', err);
    return res.status(500).json({
      error: 'Evaluation failed',
      fallback: {
        correct: true,
        score: 0.8,
        feedback: 'Your answer contains valid scientific thinking! Keep exploring the lab.',
        nextAction: 'continue',
      },
    });
  }
});

aiRouter.post('/generate-question', async (req: Request, res: Response) => {
  try {
    const parsed = GenerateCurriculumQuestionRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid NCERT curriculum question request',
        details: parsed.error.format(),
      });
    }

    const data = parsed.data;
    const rateCheck = checkRateLimit(data.sessionId);
    if (!rateCheck.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Maximum 30 AI tutoring calls per hour.',
      });
    }

    const cacheKey = `genq_${data.curriculumId}_g${data.studentGrade}_${data.villageObject}_${data.questionType}_${data.difficulty}_${data.lang}`;
    const cached = getCachedResponse(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const prompt = buildCurriculumQuestionPrompt({
      ...data,
      studentGrade: data.studentGrade as SupportedGrade,
      ncertGrade: data.ncertGrade as SupportedGrade,
    });

    const provider = getProvider();
    const rawGenerated = await provider.generateJson(prompt, GeneratedCurriculumQuestionSchema);

    // Enforce exact verified NCERT metadata retention (AI cannot alter textbook/chapter!)
    const verifiedResult = {
      ...rawGenerated,
      curriculumId: data.curriculumId,
      grade: data.ncertGrade,
      subject: data.subject,
      textbook: data.textbook,
      chapterNumber: data.chapterNumber,
      chapterTitle: data.chapterTitle,
      isEnrichment: Boolean(data.isEnrichment || data.ncertGrade > data.studentGrade),
    };

    setCachedResponse(cacheKey, verifiedResult);
    return res.json(verifiedResult);
  } catch (err: unknown) {
    console.error('[AI /generate-question Error]', err);
    return res.status(500).json({ error: 'Curriculum question generation failed' });
  }
});

aiRouter.post('/hint', async (req: Request, res: Response) => {
  try {
    const { concept, questionText, lang, chapterTitle, grade } = req.body;
    const ncertNote = chapterTitle ? ` Align strictly with NCERT Class ${grade || 7} chapter "${chapterTitle}".` : '';
    const prompt = `You are Mitra, a kind science guide. Provide ONE gentle, Socratic hint in ${lang || 'English'} for a student struggling with the question: "${questionText}". Do NOT give the direct answer. Focus on the physical concept: "${concept}".${ncertNote} Respond in JSON: {"hint": "your hint"}`;

    const provider = getProvider();
    const result = await provider.generateJson(prompt, HintSchema);
    return res.json(result);
  } catch {
    return res.status(500).json({
      hint: 'Think about the core scientific principle at play in this village structure!',
    });
  }
});

aiRouter.post('/followup', async (req: Request, res: Response) => {
  try {
    const { concept, grade, lang, chapterTitle, textbook } = req.body;
    const ncertRef = chapterTitle ? ` grounded in NCERT ${textbook || 'Science'} chapter "${chapterTitle}"` : '';
    const prompt = `Generate ONE adaptive multiple-choice follow-up question for Class ${grade || 7} on the STEM concept: "${concept}"${ncertRef} in ${lang || 'English'}. Do not invent chapter names. Respond in JSON: {"questionText": "...", "options": ["A", "B", "C"], "correctIndex": 0, "explanation": "..."}`;

    const provider = getProvider();
    const result = await provider.generateJson(prompt, FollowupSchema);
    return res.json(result);
  } catch {
    return res.status(500).json({ error: 'Followup question generation failed' });
  }
});
