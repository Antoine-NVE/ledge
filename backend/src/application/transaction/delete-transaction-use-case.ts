import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ForbiddenError } from '../../core/errors/forbidden-error.js';
import type { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';

type Input = {
    transactionId: string;
    userId: string;
};

type Output = {
    transaction: Transaction;
};

export class DeleteTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({
        transactionId,
        userId,
    }: Input): Promise<Result<Output, Error | ForbiddenError | NotFoundError>> => {
        const getResult = await this.transactionRepository.getById(transactionId);
        if (!getResult.success) return fail(getResult.error);
        const transaction = getResult.data;

        if (transaction.userId !== userId) return fail(new ForbiddenError());

        const deleteResult = await this.transactionRepository.delete(transaction);
        if (!deleteResult.success) return fail(deleteResult.error);

        return ok({ transaction });
    };
}
