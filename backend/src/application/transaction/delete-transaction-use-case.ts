import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { Transaction } from '../../domain/transaction/transaction-types';
import { Result } from '../../core/types/result';
import { NotFoundError } from '../../core/errors/not-found-error';
import { fail, ok } from '../../core/utils/result';

type Input = {
    transactionId: string;
    userId: string;
};

type Output = {
    transaction: Transaction | null;
};

export class DeleteTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ transactionId, userId }: Input): Promise<Result<Output, Error>> => {
        const result = await this.transactionRepository.findByIdAndUserIdAndDelete(transactionId, userId);
        if (!result.success) return fail(result.error);
        const transaction = result.value;

        return ok({ transaction });
    };
}
