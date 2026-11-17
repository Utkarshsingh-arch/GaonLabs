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
  buildEvaluatorPrompt,
} from '../prompts';
import { checkRateLimit, getCachedResponse, setCachedResponse } from '../rateLimit';

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
  grade: z.number().min(6).max(8),
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
      attemptNumber
    );

    const provider = getProvider();
    const evaluation = await provider.generateJson(prompt, EvaluationSchema);

    // Cache valid result
    setCachedResponse(cacheKey, evaluation);

    return res.json(evaluation);
  } catch (err: any) {
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

aiRouter.post('/hint', async (req: Request, res: Response) => {
  try {
    const { concept, questionText, lang } = req.body;
    const prompt = `You are Mitra, a kind science guide. Provide ONE gentle, Socratic hint in ${lang || 'English'} for a student struggling with the question: "${questionText}". Do NOT give the direct answer. Focus on the physical concept: "${concept}". Respond in JSON: {"hint": "your hint"}`;

    const provider = getProvider();
    const result = await provider.generateJson(prompt, HintSchema);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({
      hint: 'Think about the core scientific principle at play in this village structure!',
    });
  }
});

aiRouter.post('/followup', async (req: Request, res: Response) => {
  try {
    const { concept, grade, lang } = req.body;
    const prompt = `Generate ONE adaptive multiple-choice follow-up question for Grade ${grade || 7} on the STEM concept: "${concept}" in ${lang || 'English'}. Respond in JSON: {"questionText": "...", "options": ["A", "B", "C"], "correctIndex": 0, "explanation": "..."}`;

    const provider = getProvider();
    const result = await provider.generateJson(prompt, FollowupSchema);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Followup question generation failed' });
  }
});
