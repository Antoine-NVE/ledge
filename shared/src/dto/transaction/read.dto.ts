import type { TransactionDto } from '../common/transaction.dto.js';

export type ReadTransactionDto = Readonly<{
    transaction: TransactionDto;
}>;
