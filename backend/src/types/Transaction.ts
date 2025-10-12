import z from 'zod';
import { refreshTokenSchema } from '../schemas/RefreshTokenSchema';
import { WithId } from 'mongodb';
import { transactionSchema } from '../schemas/TransactionSchema';

export type Transaction = z.infer<typeof transactionSchema>;
