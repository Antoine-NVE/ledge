import z from 'zod';
import { WithId } from 'mongodb';
import { RefreshTokenSchema } from '../schemas/RefreshTokenSchema';

type RefreshTokenSchemaInstance = InstanceType<typeof RefreshTokenSchema>;

export type RefreshToken = z.infer<RefreshTokenSchemaInstance['base']>;
