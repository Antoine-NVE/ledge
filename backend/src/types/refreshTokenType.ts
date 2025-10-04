import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { WithId } from 'mongodb';

export type RefreshTokenData = z.infer<typeof refreshTokenSchema>;

export type RefreshToken = WithId<RefreshTokenData>;
