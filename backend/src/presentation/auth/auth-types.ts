import z from 'zod';
import { loginBodySchema, registerBodySchema } from './auth-schemas';

export type RegisterBody = z.infer<typeof registerBodySchema>;

export type LoginBody = z.infer<typeof loginBodySchema>;
