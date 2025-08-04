import { z } from 'zod';

export const addApiKeySchema = z.object({
  name: z.string().min(1, 'Key name is required').max(50, 'Name too long'),
  provider: z.enum(['openai', 'gemini'], {
    required_error: 'Please select a provider',
  }),
  apiKey: z.string().min(10, 'API key is required'),
  description: z.string().optional(),
  email: z.string().email('Invalid email address').optional(), // New email field
  rateLimit: z.number().min(1).max(10000).default(1000),
  scopes: z.array(z.string()).default([]),
  trustedPeople: z.string().optional(),
});

export const editApiKeySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Key name is required').max(50, 'Name too long'),
  description: z.string().optional(),
  rateLimit: z.number().min(1).max(10000),
  scopes: z.array(z.string()),
  isActive: z.boolean(),
});

export type AddApiKeyData = z.infer<typeof addApiKeySchema>;
export type EditApiKeyData = z.infer<typeof editApiKeySchema>;