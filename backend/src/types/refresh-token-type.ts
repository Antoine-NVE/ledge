import z from 'zod';
import { refreshTokenSchema } from '../schemas/refresh-token-schemas';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
