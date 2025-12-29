import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';

type Input = {
    transactionId: string;
    userId: string;
    name: string;
    value: number;
    type: 'expense' | 'income';
    expenseCategory: 'need' | 'want' | 'investment' | null;
};

type Output = {
    transaction: Transaction;
};

export class UpdateTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({
        transactionId,
        userId,
        name,
        value,
        type,
        expenseCategory,
    }: Input): Promise<Result<Output, Error | NotFoundError>> => {
        const getResult = await this.transactionRepository.getByIdAndUserId(transactionId, userId);
        if (!getResult.success) return fail(getResult.error);
        const transaction = getResult.value;

        transaction.name = name;
        transaction.value = value;
        transaction.type = type;
        transaction.expenseCategory = expenseCategory;
        transaction.updatedAt = new Date();

        const saveResult = await this.transactionRepository.save(transaction);
        if (!saveResult.success) return fail(saveResult.error);

        return ok({ transaction });
    };
}
