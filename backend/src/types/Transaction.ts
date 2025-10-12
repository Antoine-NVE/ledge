import z from 'zod';
import { refreshTokenSchema } from '../schemas/RefreshTokenSchema';
import { WithId } from 'mongodb';
import { TransactionSchema } from '../schemas/TransactionSchema';

type TransactionSchemaInstance = InstanceType<typeof TransactionSchema>;

export type Transaction = z.infer<TransactionSchemaInstance['base']>;
