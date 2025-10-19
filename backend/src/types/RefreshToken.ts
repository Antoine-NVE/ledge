import z from 'zod';
import { refreshTokenSchema } from '../schemas/refresh-token';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
