import type { Transaction } from '../../../domain/entities/transaction.js';
import type { ReadDto } from '../../dto/transaction/read.dto.js';
import { toTransactionDto } from '../common/transaction.mapper.js';

export const toReadDto = (transaction: Transaction): ReadDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
