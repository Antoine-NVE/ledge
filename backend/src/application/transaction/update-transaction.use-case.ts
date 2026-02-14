import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import type { Logger } from '../../domain/ports/logger.js';
import { fail, ok, type Result } from '../../core/result.js';

type UpdateTransactionInput = { transactionId: string; userId: string; name: string; value: number } & (
    | { type: 'expense'; expenseCategory: 'need' | 'want' | 'investment' | null }
    | { type: 'income'; expenseCategory: null }
);

type UpdateTransactionResult = Result<{ transaction: Transaction }, 'TRANSACTION_NOT_FOUND' | 'TRANSACTION_NOT_OWNED'>;

export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async (input: UpdateTransactionInput, logger: Logger): Promise<UpdateTransactionResult> => {
        const transaction = await this.transactionRepository.findById(input.transactionId);
        if (!transaction) return fail('TRANSACTION_NOT_FOUND');
        if (transaction.userId !== input.userId) return fail('TRANSACTION_NOT_OWNED');

        const updatedTransaction: Transaction = {
            id: transaction.id,
            userId: transaction.userId,
            month: transaction.month,
            name: input.name,
            value: input.value,
            ...(input.type === 'expense'
                ? { type: 'expense', expenseCategory: input.expenseCategory }
                : { type: 'income', expenseCategory: null }),
            createdAt: transaction.createdAt,
            updatedAt: new Date(),
        };
        await this.transactionRepository.save(updatedTransaction);
        logger.info('Transaction updated', { transactionId: transaction.id, userId: transaction.userId });

        return ok({ transaction: updatedTransaction });
    };
}
