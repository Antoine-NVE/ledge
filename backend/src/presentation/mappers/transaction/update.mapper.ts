import type { Transaction } from '../../../domain/entities/transaction.js';
import type { UpdateDto } from '../../dto/transaction/update.dto.js';
import { toTransactionDto } from '../common/transaction.mapper.js';

export const toUpdateDto = (transaction: Transaction): UpdateDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
