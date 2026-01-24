import type { Transaction } from '../../../domain/entities/transaction.js';
import { toTransactionDto } from '../common/transaction.mapper.js';
import type { UpdateTransactionDto } from '@shared/dto/transaction/update.dto.js';

export const toUpdateTransactionDto = (transaction: Transaction): UpdateTransactionDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
