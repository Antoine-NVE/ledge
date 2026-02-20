import type { Transaction } from '../../../domain/entities/transaction.js';
import type { TransactionDto } from '@shared/dto/common/transaction.dto.js';

export const toTransactionDto = (transaction: Transaction): TransactionDto => ({
    id: transaction.id,
    userId: transaction.userId,
    month: transaction.month,
    name: transaction.name,
    value: transaction.value,
    ...(transaction.type === 'expense'
        ? { type: 'expense', expenseCategory: transaction.expenseCategory ?? null }
        : { type: 'income', expenseCategory: null }),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.createdAt.toISOString(),
});
