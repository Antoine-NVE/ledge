import type { TransactionDto } from '../common/transaction.dto.js';

export type ReadAllTransactionsDto = Readonly<{
    transactions: TransactionDto[];
}>;
