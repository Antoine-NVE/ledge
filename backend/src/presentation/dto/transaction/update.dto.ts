import type { TransactionDto } from '../common/transaction.dto.js';

export type UpdateDto = Readonly<{
    transaction: TransactionDto;
}>;
