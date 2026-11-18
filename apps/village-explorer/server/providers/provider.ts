import { z } from 'zod';

export interface AiProvider {
  generateJson<T>(prompt: string, schema: z.ZodSchema<T>): Promise<T>;
}
