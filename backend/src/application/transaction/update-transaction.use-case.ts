import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import type { Logger } from '../../domain/ports/logger.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type UpdateTransactionInput = { transactionId: string; userId: string; name: string; value: number } & (
    | { type: 'expense'; expenseCategory: 'need' | 'want' | 'investment' | null }
    | { type: 'income'; expenseCategory: null }
);

type UpdateTransactionResult = Result<
    { transaction: Transaction },
    { type: 'TRANSACTION_NOT_FOUND' } | { type: 'TRANSACTION_NOT_OWNED' }
>;

export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async (
        { transactionId, userId, ...rest }: UpdateTransactionInput,
        logger: Logger,
    ): Promise<UpdateTransactionResult> => {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) return fail({ type: 'TRANSACTION_NOT_FOUND' });
        if (transaction.userId !== userId) return fail({ type: 'TRANSACTION_NOT_OWNED' });

        const updatedTransaction: Transaction = {
            ...transaction,
            ...rest,
            updatedAt: new Date(),
        };
        await this.transactionRepository.save(updatedTransaction);
        logger.info('Transaction updated', { transactionId: transaction.id, userId: transaction.userId });

        return ok({ transaction: updatedTransaction });
    };
}
