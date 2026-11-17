import { z } from 'zod';
import { AiProvider } from './provider';

export class GeminiAiProvider implements AiProvider {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  }

  async generateJson<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY not configured on server');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const jsonRes = (await response.json()) as any;
    const rawText = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error('Empty response received from Gemini');
    }

    const parsedJson = JSON.parse(rawText);
    return schema.parse(parsedJson);
  }
}
