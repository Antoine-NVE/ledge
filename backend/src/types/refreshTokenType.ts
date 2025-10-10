import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { WithId } from 'mongodb';

export type RefreshToken = z.infer<typeof refreshTokenSchema>;
