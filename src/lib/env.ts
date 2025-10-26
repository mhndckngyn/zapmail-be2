import z from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  API_KEY: z.string(),
});

export function validateConfig(config: Record<string, any>) {
  const result = envSchema.parse(config);
  return result;
}

export type EnvSchema = z.infer<typeof envSchema>;
