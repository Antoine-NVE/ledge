import z from 'zod';
import { envSchema } from '../schemas/env-config-schemas';

export type Env = z.infer<typeof envSchema>;
