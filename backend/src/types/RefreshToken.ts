import z from 'zod';
import { refreshTokenSchema } from '../schemas/RefreshTokenSchema';
import { WithId } from 'mongodb';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
