import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import { Transaction } from '../../domain/entities/transaction.js';
import type { IdGenerator } from '../../domain/ports/id-generator.js';

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionRepository,
        private idGenerator: IdGenerator,
    ) {}

    execute = async (
        userId: string,
        name: string,
        value: number,
        type: 'income' | 'expense',
        category: 'need' | 'want' | 'investment' | undefined,
        date: Date,
    ) => {
        const result = Transaction.create(this.idGenerator.generate(), userId, name, value, type, category, date);
        if (!result.success) return result;
        const transaction = result.data;

        await this.transactionRepository.create(transaction);

        return { success: true, data: transaction } as const;
    };
}
