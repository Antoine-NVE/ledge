import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { WithId } from 'mongodb';

export type TransactionData = z.infer<typeof refreshTokenSchema>;

export type Transaction = WithId<TransactionData>;
