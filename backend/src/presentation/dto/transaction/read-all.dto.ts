import type { TransactionDto } from '../common/transaction.dto.js';

export type ReadAllDto = Readonly<{
    transactions: TransactionDto[];
}>;
