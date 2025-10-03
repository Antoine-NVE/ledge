import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
