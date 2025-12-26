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
    transaction: Transaction;
};

export class DeleteTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ transactionId, userId }: Input): Promise<Result<Output, Error | NotFoundError>> => {
        const getResult = await this.transactionRepository.getByIdAndUserId(transactionId, userId);
        if (!getResult.success) return fail(getResult.error);
        const transaction = getResult.value;

        const deleteResult = await this.transactionRepository.delete(transaction);
        if (!deleteResult.success) return fail(deleteResult.error);

        return ok({ transaction });
    };
}
