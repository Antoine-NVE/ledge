import z from 'zod';
import { transactionSchema } from '../schemas/transaction-schemas';

export type Transaction = z.infer<typeof transactionSchema>;
