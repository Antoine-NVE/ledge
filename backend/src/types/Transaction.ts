import z from 'zod';
import { WithId } from 'mongodb';
import { transactionSchema } from '../schemas/transaction';

export type Transaction = z.infer<typeof transactionSchema>;
