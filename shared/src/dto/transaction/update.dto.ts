import type { TransactionDto } from '../common/transaction.dto.js';

export type UpdateTransactionDto = Readonly<{
    transaction: TransactionDto;
}>;
