import type { Transaction } from '../../../../domain/entities/transaction.js';
import type { ReadAllDto } from '../../dto/transaction/read-all.dto.js';
import { toTransactionDto } from '../common/transaction.mapper.js';

export const toReadAllDto = (transactions: Transaction[]): ReadAllDto => {
    return {
        transactions: transactions.map((transaction) => toTransactionDto(transaction)),
    };
};
