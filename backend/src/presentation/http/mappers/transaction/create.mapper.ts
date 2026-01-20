import type { Transaction } from '../../../../domain/entities/transaction.js';
import type { CreateDto } from '../../dto/transaction/create.dto.js';
import { toTransactionDto } from '../common/transaction.mapper.js';

export const toCreateDto = (transaction: Transaction): CreateDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
