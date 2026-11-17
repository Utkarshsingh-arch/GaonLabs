import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env if present
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .default(
      process.env.POSTGRES_PORT === '54329'
        ? 'postgresql://postgres:postgres@localhost:54329/gaonlab_dev?schema=public'
        : 'postgresql://postgres:postgres@localhost:5432/gaonlab_dev?schema=public'
    ),
  DIRECT_URL: z.string().optional(),
  FALLBACK_DATABASE_URL: z
    .string()
    .optional()
    .default(
      process.env.POSTGRES_PORT === '54329'
        ? 'postgresql://postgres:postgres@localhost:54329/gaonlab_dev?schema=public'
        : 'postgresql://postgres:postgres@localhost:5432/gaonlab_dev?schema=public'
    ),
  CORS_ORIGIN: z.string().default('*'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  GATEWAY_BHASHINI_MODE: z.enum(['LIVE', 'CACHED', 'MOCK', 'OFF']).default('MOCK'),
  GATEWAY_DIKSHA_MODE: z.enum(['LIVE', 'CACHED', 'MOCK', 'OFF']).default('MOCK'),
  GATEWAY_UDISE_MODE: z.enum(['LIVE', 'CACHED', 'MOCK', 'OFF']).default('MOCK'),
  GATEWAY_APAAR_MODE: z.enum(['LIVE', 'CACHED', 'MOCK', 'OFF']).default('OFF'),
  GATEWAY_SATS_MODE: z.enum(['LIVE', 'CACHED', 'MOCK', 'OFF']).default('OFF'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables configuration:', parsed.error.format());
  throw new Error('Environment configuration validation failed');
}

export const env = parsed.data;

// Guarantee process.env has the parsed configuration (including defaults like DATABASE_URL)
// so that Prisma Client, which reads directly from process.env, always has the connection string
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.DATABASE_URL;
}
if (env.DIRECT_URL && !process.env.DIRECT_URL) {
  process.env.DIRECT_URL = env.DIRECT_URL;
}
if (env.FALLBACK_DATABASE_URL && !process.env.FALLBACK_DATABASE_URL) {
  process.env.FALLBACK_DATABASE_URL = env.FALLBACK_DATABASE_URL;
}

export type Env = z.infer<typeof envSchema>;
