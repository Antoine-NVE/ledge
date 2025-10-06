import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { WithId } from 'mongodb';
import { transactionSchema } from '../schemas/transactionSchema';

export type TransactionData = z.infer<typeof transactionSchema>;

export type Transaction = WithId<TransactionData>;
