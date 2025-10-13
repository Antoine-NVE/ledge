import z from 'zod';
import { transactionSchema } from '../schemas/transaction';

export type Transaction = z.infer<typeof transactionSchema>;
