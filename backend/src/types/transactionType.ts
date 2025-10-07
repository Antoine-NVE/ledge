import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { WithId } from 'mongodb';
import { partialTransactionSchema, transactionSchema } from '../schemas/transactionSchema';

export type TransactionData = z.infer<typeof transactionSchema>;

export type PartialTransactionData = z.infer<typeof partialTransactionSchema>;

export type Transaction = WithId<TransactionData>;
