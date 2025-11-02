import z from 'zod';
import { authorizeParamsSchema } from './authorize-schemas';

export type AuthorizeParams = z.infer<typeof authorizeParamsSchema>;
