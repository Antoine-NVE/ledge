import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import type { IdManager } from '../../domain/ports/id-manager.js';
import type { Logger } from '../../domain/ports/logger.js';

type CreateTransactionInput = { userId: string; month: string; name: string; value: number } & (
    | { type: 'expense'; expenseCategory: 'need' | 'want' | 'investment' | null }
    | { type: 'income'; expenseCategory: null }
);

type CreateTransactionOutput = { transaction: Transaction };

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionRepository,
        private idManager: IdManager,
    ) {}

    execute = async (input: CreateTransactionInput, logger: Logger): Promise<CreateTransactionOutput> => {
        const now = new Date();

        const transaction: Transaction = {
            id: this.idManager.generate(),
            userId: input.userId,
            month: input.month,
            name: input.name,
            value: input.value,
            ...(input.type === 'expense'
                ? { type: 'expense', expenseCategory: input.expenseCategory }
                : { type: 'income', expenseCategory: null }),
            createdAt: now,
            updatedAt: now,
        };
        await this.transactionRepository.create(transaction);
        logger.info('Transaction created', { transactionId: transaction.id, userId: transaction.userId });

        return { transaction };
    };
}
