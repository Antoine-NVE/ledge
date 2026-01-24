import type { Transaction } from '../../../domain/entities/transaction.js';
import type { TransactionDto } from '@shared/dto/common/transaction.dto.js';

export const toTransactionDto = (transaction: Transaction): TransactionDto => {
    switch (transaction.type) {
        case 'expense':
            return {
                id: transaction.id,
                userId: transaction.userId,
                month: transaction.month,
                name: transaction.name,
                value: transaction.value,
                type: transaction.type,
                expenseCategory: transaction.expenseCategory,
                createdAt: transaction.createdAt.toISOString(),
                updatedAt: transaction.createdAt.toISOString(),
            };
        case 'income':
            return {
                id: transaction.id,
                userId: transaction.userId,
                month: transaction.month,
                name: transaction.name,
                value: transaction.value,
                type: transaction.type,
                expenseCategory: transaction.expenseCategory,
                createdAt: transaction.createdAt.toISOString(),
                updatedAt: transaction.createdAt.toISOString(),
            };
    }
};
