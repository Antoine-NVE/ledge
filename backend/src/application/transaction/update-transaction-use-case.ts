import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import { ForbiddenError } from '../../core/errors/forbidden-error.js';

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

    execute = async ({ transactionId, userId, ...rest }: Input): Promise<Result<Output, Error | NotFoundError>> => {
        const getResult = await this.transactionRepository.getById(transactionId);
        if (!getResult.success) return fail(getResult.error);
        const transaction = getResult.data;

        if (transaction.userId !== userId) return fail(new ForbiddenError());

        // We absolutely need to create a new object to use TypeScript validation
        const updatedTransaction: Transaction = {
            ...transaction,
            ...rest,
            updatedAt: new Date(),
        };

        const saveResult = await this.transactionRepository.save(updatedTransaction);
        if (!saveResult.success) return fail(saveResult.error);

        return ok({ transaction: updatedTransaction });
    };
}
