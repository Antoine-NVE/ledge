import type { Transaction } from '../../../domain/entities/transaction.js';
import { toTransactionDto } from '../common/transaction.mapper.js';
import type { CreateTransactionDto } from '@shared/dto/transaction/create.dto.js';

export const toCreateTransactionDto = (transaction: Transaction): CreateTransactionDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
