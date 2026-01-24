import type { Transaction } from '../../../domain/entities/transaction.js';
import { toTransactionDto } from '../common/transaction.mapper.js';
import type { ReadTransactionDto } from '@shared/dto/transaction/read.dto.js';

export const toReadTransactionDto = (transaction: Transaction): ReadTransactionDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
