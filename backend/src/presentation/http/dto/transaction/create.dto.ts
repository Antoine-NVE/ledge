import type { TransactionDto } from '../common/transaction.dto.js';

export type CreateDto = Readonly<{
    transaction: TransactionDto;
}>;
