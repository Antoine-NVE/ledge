import type { TransactionDto } from '../common/transaction.dto.js';

export type DeleteDto = Readonly<{
    transaction: TransactionDto;
}>;
