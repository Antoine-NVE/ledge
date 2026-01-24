import type { TransactionDto } from '../common/transaction.dto.js';

export type DeleteTransactionDto = Readonly<{
    transaction: TransactionDto;
}>;
