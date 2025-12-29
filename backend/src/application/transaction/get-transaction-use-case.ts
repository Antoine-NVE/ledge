import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Result } from '../../core/types/result.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import { fail, ok } from '../../core/utils/result.js';

type Input = {
    transactionId: string;
    userId: string;
};

type Output = {
    transaction: Transaction;
};

export class GetTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ transactionId, userId }: Input): Promise<Result<Output, Error | NotFoundError>> => {
        const result = await this.transactionRepository.getByIdAndUserId(transactionId, userId);
        if (!result.success) return fail(result.error);
        const transaction = result.value;

        return ok({ transaction });
    };
}
