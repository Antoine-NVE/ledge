import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';

export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async (
        id: string,
        userId: string,
        name: string,
        value: number,
        type: 'income' | 'expense',
        category: 'need' | 'want' | 'investment' | undefined,
        date: Date,
    ) => {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) return { success: false, code: 'TRANSACTION_NOT_FOUND' } as const;
        if (transaction.userId !== userId) return { success: false, code: 'TRANSACTION_NOT_OWNED' } as const;

        const result = transaction.update(name, value, type, category, date);
        if (!result.success) return result;
        const updated = result.data;

        await this.transactionRepository.save(updated);

        return { success: true, data: updated } as const;
    };
}
