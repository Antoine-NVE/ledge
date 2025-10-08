import z from 'zod';
import { refreshTokenSchema } from '../schemas/refreshTokenSchema';
import { WithId } from 'mongodb';
import { transactionSchema } from '../schemas/transactionSchema';

export type Transaction = z.infer<typeof transactionSchema>;
