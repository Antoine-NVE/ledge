import z from 'zod';
import { WithId } from 'mongodb';
import { refreshTokenSchema } from '../schemas/refresh-token';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
