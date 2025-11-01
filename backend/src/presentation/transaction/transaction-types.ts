import z from 'zod';
import { createBodySchema, updateBodySchema } from './transaction-schemas';

export type CreateBody = z.infer<typeof createBodySchema>;

export type UpdateBody = z.infer<typeof updateBodySchema>;
