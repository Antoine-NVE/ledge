import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type GetTransactionInput = { transactionId: string; userId: string };

type GetTransactionResult = Result<
    { transaction: Transaction },
    { type: 'TRANSACTION_NOT_FOUND' } | { type: 'TRANSACTION_NOT_OWNED' }
>;

export class GetTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async (input: GetTransactionInput): Promise<GetTransactionResult> => {
        const transaction = await this.transactionRepository.findById(input.transactionId);
        if (!transaction) return fail({ type: 'TRANSACTION_NOT_FOUND' });
        if (transaction.userId !== input.userId) return fail({ type: 'TRANSACTION_NOT_OWNED' });

        return ok({ transaction });
    };
}
