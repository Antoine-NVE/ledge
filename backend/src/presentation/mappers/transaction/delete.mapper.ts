import type { Transaction } from '../../../domain/entities/transaction.js';
import { toTransactionDto } from '../common/transaction.mapper.js';
import type { DeleteTransactionDto } from '@shared/dto/transaction/delete.dto.js';

export const toDeleteTransactionDto = (transaction: Transaction): DeleteTransactionDto => ({
    transaction: toTransactionDto(transaction),
});
