import { z } from 'zod';
import { AiProvider } from './provider';

export class OllamaAiProvider implements AiProvider {
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';
    this.model = process.env.OLLAMA_MODEL || 'qwen2.5:7b';
  }

  async generateJson<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T> {
    const endpoint = `${this.baseUrl}/api/generate`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt,
        format: 'json',
        stream: false,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Ollama API error (${response.status}): ${errText}`);
    }

    const data = (await response.json()) as any;
    const rawResponse = data?.response;

    if (!rawResponse) {
      throw new Error('Empty response from Ollama');
    }

    const parsed = JSON.parse(rawResponse);
    return schema.parse(parsed);
  }
}
