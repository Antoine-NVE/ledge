import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import type { IdManager } from '../ports/id-manager.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type Input = {
    userId: string;
    month: string;
    name: string;
    value: number;
} & (
    | {
          type: 'expense';
          expenseCategory: 'need' | 'want' | 'investment' | null;
      }
    | {
          type: 'income';
          expenseCategory: null;
      }
);

type Output = {
    transaction: Transaction;
};

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionRepository,
        private idManager: IdManager,
    ) {}

    execute = async (input: Input): Promise<Result<Output, Error>> => {
        const now = new Date();

        const transaction: Transaction = {
            id: this.idManager.generate(),
            ...input,
            createdAt: now,
            updatedAt: now,
        };

        const result = await this.transactionRepository.create(transaction);
        if (!result.success) return fail(result.error);

        return ok({ transaction });
    };
}
