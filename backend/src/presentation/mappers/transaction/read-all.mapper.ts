import type { Transaction } from '../../../domain/entities/transaction.js';
import { toTransactionDto } from '../common/transaction.mapper.js';
import type { ReadAllTransactionsDto } from '@shared/dto/transaction/read-all.dto.js';

export const toReadAllTransactionsDto = (transactions: Transaction[]): ReadAllTransactionsDto => ({
    transactions: transactions.map((transaction) => toTransactionDto(transaction)),
});
