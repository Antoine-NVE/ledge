import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Result } from '../../core/types/result.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import { fail, ok } from '../../core/utils/result.js';
import { ForbiddenError } from '../../core/errors/forbidden-error.js';

type Input = {
    transactionId: string;
    userId: string;
};

type Output = {
    transaction: Transaction;
};

export class GetTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({
        transactionId,
        userId,
    }: Input): Promise<Result<Output, Error | ForbiddenError | NotFoundError>> => {
        const result = await this.transactionRepository.getById(transactionId);
        if (!result.success) return fail(result.error);
        const transaction = result.data;

        if (transaction.userId !== userId) return fail(new ForbiddenError());

        return ok({ transaction });
    };
}
