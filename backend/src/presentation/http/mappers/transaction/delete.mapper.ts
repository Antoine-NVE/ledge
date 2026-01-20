import type { Transaction } from '../../../../domain/entities/transaction.js';
import type { DeleteDto } from '../../dto/transaction/delete.dto.js';
import { toTransactionDto } from '../common/transaction.mapper.js';

export const toDeleteDto = (transaction: Transaction): DeleteDto => {
    return {
        transaction: toTransactionDto(transaction),
    };
};
