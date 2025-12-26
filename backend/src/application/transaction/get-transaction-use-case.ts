import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { Result } from '../../core/types/result';
import { Transaction } from '../../domain/transaction/transaction-types';
import { NotFoundError } from '../../core/errors/not-found-error';
import { fail, ok } from '../../core/utils/result';

type Input = {
    id: string;
};

type Output = {
    transaction: Transaction;
};

export class GetTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async (input: Input): Promise<Result<Output, Error | NotFoundError>> => {
        const result = await this.transactionRepository.getById(input.id);
        if (!result.success) return fail(result.error);
        const transaction = result.value;

        return ok({ transaction });
    };
}
