import { z } from 'zod';

export const createServiceSchema = z.object({
  title: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
  duration: z.number().min(1, { message: 'Duration is required' }),
  price: z.number().min(0, { message: 'Price is required' }),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
