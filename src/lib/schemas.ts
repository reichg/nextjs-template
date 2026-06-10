import { z } from 'zod';

export const createItemSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().max(2000).optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
