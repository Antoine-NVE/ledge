import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import { ResourceNotFoundError } from '../errors/resource-not-found.error.js';
import { AuthorizationError } from '../errors/authorization.error.js';

type Input = {
    transactionId: string;
    userId: string;
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

export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ transactionId, userId, ...rest }: Input): Promise<Output> => {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) throw new ResourceNotFoundError();
        if (transaction.userId !== userId) throw new AuthorizationError();

        // We absolutely need to create a new object to use TypeScript validation
        const updatedTransaction: Transaction = {
            ...transaction,
            ...rest,
            updatedAt: new Date(),
        };
        await this.transactionRepository.save(updatedTransaction);

        return { transaction: updatedTransaction };
    };
}
