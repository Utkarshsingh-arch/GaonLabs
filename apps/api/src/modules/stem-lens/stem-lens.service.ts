import {
  IStemLensService,
  StemLensStatusResponse,
  StemLensChatRequest,
  StemLensChatResponse,
  StemLensGenerateImageResponse,
  StemLensSessionRecord,
} from './stem-lens.contracts';
import { STEM_LENS_MANIFEST } from './stem-lens.manifest';
import { STEM_LENS_SYSTEM_PROMPT } from './stemLensPrompt';
import { featureFlagsService } from '../feature-flags';
import { FeatureModuleManifest, LearnerContext } from '@gaonlab/shared-types';
import { env } from '../../config/env';
import { logger } from '../../shared/utils/logger';
import { prisma } from '../../shared/database/prisma';

export class StemLensService implements IStemLensService {
  private getApiKey(): string {
    const key =
      env.GEMINI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      env.XAI_API_KEY ||
      process.env.XAI_API_KEY ||
      process.env.GROQ_API_KEY ||
      '';
    if (!key) {
      logger.warn('[StemLensService] No AI API key (GEMINI_API_KEY / XAI_API_KEY) configured in environment.');
    }
    return key;
  }

  private getApiBaseUrl(): string {
    if (env.GEMINI_API_KEY || process.env.GEMINI_API_KEY) {
      return env.GEMINI_API_URL || 'https://generativelanguage.googleapis.com/v1beta/openai';
    }
    return env.XAI_API_URL || 'https://api.x.ai/v1';
  }

  private getChatModel(): string {
    return env.GEMINI_MODEL || process.env.GEMINI_MODEL || env.AI_MODEL || process.env.AI_MODEL || '';
  }

  private getImageModel(): string {
    return env.AI_IMAGE_MODEL || process.env.AI_IMAGE_MODEL || this.getChatModel();
  }

  getManifest(): FeatureModuleManifest {
    return STEM_LENS_MANIFEST;
  }

  getPromptTemplate(): { systemPrompt: string; filePath: string } {
    return {
      systemPrompt: STEM_LENS_SYSTEM_PROMPT,
      filePath: 'apps/api/src/modules/stem-lens/stemLensPrompt.ts',
    };
  }

  async getStatus(learnerContext?: Partial<LearnerContext>): Promise<StemLensStatusResponse> {
    const isEnabled = await featureFlagsService.isEnabled(
      STEM_LENS_MANIFEST.featureFlagKey,
      learnerContext
        ? {
            environment: 'development',
            learnerCategory: learnerContext.learnerCategory,
            organisationId: learnerContext.institution?.schoolId,
          }
        : undefined
    );

    return {
      featureId: 'STEM_LENS',
      moduleName: STEM_LENS_MANIFEST.name,
      owner: 'Robin',
      description: STEM_LENS_MANIFEST.description,
      frontendRoute: '/app/stem-lens',
      status: isEnabled ? 'INTEGRATION_PENDING' : 'REGISTERED',
      isFeatureFlagActive: isEnabled,
      supportedLearnerSegments: STEM_LENS_MANIFEST.supportedLearnerSegments,
      requiredPermissions: STEM_LENS_MANIFEST.requiredPermissions,
      integrationReadiness: {
        contractsDefined: true,
        routerMounted: true,
        uiPlaceholderReady: true,
        businessLogicImplemented: true,
      },
      supportedIdentifiers: STEM_LENS_MANIFEST.supportedIdentifiers,
      note: 'STEM Lens multimodal intelligence (Robin) powered by xAI Grok and persistent Supabase database.',
    };
  }

  /**
   * Fetch all active sessions stored in Supabase for a student
   */
  async getSessions(userId?: string): Promise<StemLensSessionRecord[]> {
    const targetUser = userId || 'student-robin';
    const sessions = await prisma.stemLensSession.findMany({
      where: {
        userId: targetUser,
        isArchived: false,
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return sessions.map((s) => ({
      id: s.id,
      userId: s.userId,
      title: s.title,
      isArchived: s.isArchived,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
      messages: s.messages.map((m) => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.role as any,
        content: m.content,
        imageUrl: m.imageUrl,
        generatedImageUrl: m.generatedImageUrl,
        model: m.model,
        tokensUsed: m.tokensUsed,
        createdAt: m.createdAt.toISOString(),
      })),
    }));
  }

  /**
   * Fetch single session by ID from Supabase
   */
  async getSessionById(sessionId: string): Promise<StemLensSessionRecord | null> {
    const session = await prisma.stemLensSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!session) return null;

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      isArchived: session.isArchived,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      messages: session.messages.map((m) => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.role as any,
        content: m.content,
        imageUrl: m.imageUrl,
        generatedImageUrl: m.generatedImageUrl,
        model: m.model,
        tokensUsed: m.tokensUsed,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Create a new persistent chat session in Supabase
   */
  async createSession(title?: string, userId?: string): Promise<StemLensSessionRecord> {
    const session = await prisma.stemLensSession.create({
      data: {
        title: title || 'New STEM Investigation',
        userId: userId || 'student-robin',
      },
      include: {
        messages: true,
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      isArchived: session.isArchived,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      messages: [],
    };
  }

  /**
   * Update session title in Supabase
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<StemLensSessionRecord> {
    const session = await prisma.stemLensSession.update({
      where: { id: sessionId },
      data: { title },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    return {
      id: session.id,
      userId: session.userId,
      title: session.title,
      isArchived: session.isArchived,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString(),
      messages: session.messages.map((m) => ({
        id: m.id,
        sessionId: m.sessionId,
        role: m.role as any,
        content: m.content,
        imageUrl: m.imageUrl,
        generatedImageUrl: m.generatedImageUrl,
        model: m.model,
        tokensUsed: m.tokensUsed,
        createdAt: m.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Delete session and cascade delete all its messages from Supabase
   */
  async deleteSession(sessionId: string): Promise<{ success: boolean; id: string }> {
    await prisma.stemLensSession.delete({
      where: { id: sessionId },
    });
    return { success: true, id: sessionId };
  }

  /**
   * Generates a scientific visual/diagram using the configured AI image model from .env
   */
  async generateImage(prompt: string): Promise<StemLensGenerateImageResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('AI API key is missing. Please configure GEMINI_API_KEY or XAI_API_KEY in your .env file.');
    }

    const imageModel = this.getImageModel();
    if (!imageModel) {
      throw new Error('AI image model name is missing. Please configure AI_IMAGE_MODEL or GEMINI_MODEL in your .env file.');
    }

    const apiUrl = `${this.getApiBaseUrl()}/images/generations`;

    logger.info(`[StemLensService] Generating image via AI (${imageModel}) for prompt: "${prompt.slice(0, 80)}..."`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: imageModel,
        prompt,
        n: 1,
        response_format: 'url',
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error(`[StemLensService] AI Image API error (${response.status}): ${errText}`);
      throw new Error(`AI Image Generation failed (${response.status}): ${errText}`);
    }

    const result = (await response.json()) as { data?: Array<{ url: string }> };

    if (!result.data || result.data.length === 0 || !result.data[0].url) {
      throw new Error('No image URL returned from AI image generation service.');
    }

    return {
      imageUrl: result.data[0].url,
      prompt,
      model: imageModel,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Handles multimodal chat:
   * 1. Automatically locates or creates the persistent session in Supabase.
   * 2. Persists the student's message & uploaded image in Supabase.
   * 3. Calls the configured AI model (from .env).
   * 4. Persists the assistant's response & generated image URL in Supabase.
   * 5. Returns the complete response with session metadata.
   */
  async chat(request: StemLensChatRequest): Promise<StemLensChatResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('AI API key is missing. Please configure GEMINI_API_KEY or XAI_API_KEY in your .env file.');
    }

    const chatModel = this.getChatModel();
    if (!chatModel) {
      throw new Error('AI model name is missing. Please configure GEMINI_MODEL or AI_MODEL in your .env file.');
    }

    const trimmedMsg = (request.message || '').trim();
    const userId = request.userId || 'student-robin';

    // 1. Ensure or retrieve persistent session in Supabase
    let activeSessionId = request.sessionId;
    let sessionTitle = 'New STEM Investigation';

    if (activeSessionId) {
      const existingSession = await prisma.stemLensSession.findUnique({
        where: { id: activeSessionId },
      });
      if (existingSession) {
        sessionTitle = existingSession.title;
        // If session still has default title, update it with student's first prompt
        if (
          existingSession.title === 'New STEM Investigation' &&
          trimmedMsg &&
          trimmedMsg.length > 2
        ) {
          const newTitle =
            trimmedMsg.length > 36 ? trimmedMsg.slice(0, 36) + '...' : trimmedMsg;
          await prisma.stemLensSession.update({
            where: { id: activeSessionId },
            data: { title: newTitle },
          });
          sessionTitle = newTitle;
        }
      } else {
        // ID didn't exist in DB, create new
        const newTitle =
          trimmedMsg.length > 36 ? trimmedMsg.slice(0, 36) + '...' : trimmedMsg || 'STEM Specimen Analysis';
        const created = await prisma.stemLensSession.create({
          data: { id: activeSessionId, title: newTitle, userId },
        });
        sessionTitle = created.title;
      }
    } else {
      // Create fresh session in Supabase
      const newTitle =
        trimmedMsg.length > 36 ? trimmedMsg.slice(0, 36) + '...' : trimmedMsg || 'STEM Specimen Analysis';
      const created = await prisma.stemLensSession.create({
        data: { title: newTitle, userId },
      });
      activeSessionId = created.id;
      sessionTitle = created.title;
    }

    // 2. Prepare image data URL if present
    let dataUrl: string | undefined = undefined;
    if (request.imageBase64) {
      dataUrl = request.imageBase64.trim();
      if (!dataUrl.startsWith('data:')) {
        const mime = request.imageMimeType || 'image/jpeg';
        dataUrl = `data:${mime};base64,${dataUrl}`;
      }
    }

    // 3. Persist User Message to Supabase
    const userMsgRecord = await prisma.stemLensMessage.create({
      data: {
        sessionId: activeSessionId,
        role: 'user',
        content: trimmedMsg || 'Please analyze this STEM specimen.',
        imageUrl: dataUrl || null,
      },
    });

    // 4. Load recent conversation history from Database (up to 8 messages before this user message)
    const recentHistory = await prisma.stemLensMessage.findMany({
      where: {
        sessionId: activeSessionId,
        id: { not: userMsgRecord.id },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    // 5. Image Generation ONLY if requested explicitly via request.mode === 'image'
    // (Strictly adheres to user toggle: do not use regex patterns, only generate when mode is 'image')
    const isImageMode = request.mode === 'image';
    let generatedImageUrl: string | undefined = undefined;

    if (isImageMode) {
      const visualPrompt = trimmedMsg
        .replace(
          /^(generate|create|draw|visualize|make|paint|illustrate)\s+(me\s+)?(an?\s+)?(image|picture|diagram|drawing|schematic|illustration)\s+(of|showing|depicting)?\s*/i,
          ''
        )
        .trim();

      const enhancedPrompt = `High quality educational STEM science diagram, clean labeled flat style: ${
        visualPrompt || trimmedMsg || 'STEM concept'
      }`;

      try {
        logger.info(
          `[StemLensService] User toggled Create Image mode. Calling xAI Grok Imagine with prompt: "${enhancedPrompt}"`
        );
        const imgRes = await this.generateImage(enhancedPrompt);
        generatedImageUrl = imgRes.imageUrl;
      } catch (imgErr: any) {
        logger.warn(`[StemLensService] Image generation unavailable, continuing with text explanation: ${imgErr?.message}`);
      }
    }

    // 6. Standard Multimodal Chat Completion (also provides detailed breakdown when user asks for both image + description)
    const apiUrl = `${this.getApiBaseUrl()}/chat/completions`;

    const messages: any[] = [
      {
        role: 'system',
        content: STEM_LENS_SYSTEM_PROMPT,
      },
    ];

    // Invert to chronological order
    recentHistory.reverse().forEach((msg) => {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    });

    // Append current user message
    const textPrompt = generatedImageUrl
      ? `A scientific visual diagram has already been generated for the student. Now, please provide a comprehensive educational explanation addressing their request: "${trimmedMsg}". Detail the scientific, mechanical, and curriculum concepts.`
      : (trimmedMsg || 'Hello STEM Lens!');

    if (dataUrl) {
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: textPrompt,
          },
          {
            type: 'image_url',
            image_url: {
              url: dataUrl,
            },
          },
        ],
      });
    } else {
      messages.push({
        role: 'user',
        content: textPrompt,
      });
    }

    logger.info(
      `[StemLensService] Sending prompt to xAI Grok (sessionId: ${activeSessionId}, hasImage: ${Boolean(
        dataUrl
      )}, hasGeneratedVisual: ${Boolean(generatedImageUrl)})...`
    );

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: chatModel,
        messages,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      logger.error(`[StemLensService] AI Chat API error (${response.status}): ${errText}`);
      throw new Error(`AI Chat API error (${response.status}): ${errText}`);
    }

    const result = (await response.json()) as any;
    let answer =
      result.choices?.[0]?.message?.content ||
      'I was unable to generate a response for this query. Please try again.';
    const totalTokens = result.usage?.total_tokens;

    // If an image was also generated alongside the description, add a brief visual header
    if (generatedImageUrl) {
      answer = `### STEM Visual Diagram & Mechanical Analysis\n\n${answer}`;
    }

    const imageModel = this.getImageModel();
    const resolvedModel = generatedImageUrl
      ? `${imageModel || chatModel} + ${chatModel}`
      : result.model || chatModel;

    // 6. Persist Assistant Response in Database
    const assistantMsgRecord = await prisma.stemLensMessage.create({
      data: {
        sessionId: activeSessionId,
        role: 'assistant',
        content: answer,
        generatedImageUrl: generatedImageUrl || null,
        model: resolvedModel,
        tokensUsed: totalTokens || null,
      },
    });

    // Update session updatedAt timestamp
    await prisma.stemLensSession.update({
      where: { id: activeSessionId },
      data: { updatedAt: new Date() },
    });

    return {
      sessionId: activeSessionId,
      sessionTitle,
      userMessageId: userMsgRecord.id,
      assistantMessageId: assistantMsgRecord.id,
      reply: answer,
      generatedImageUrl,
      model: resolvedModel,
      timestamp: assistantMsgRecord.createdAt.toISOString(),
      tokensUsed: totalTokens,
    };
  }
}

export const stemLensService = new StemLensService();
