import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { Result } from '../../core/types/result';
import { Transaction } from '../../domain/transaction/transaction-types';
import { fail, ok } from '../../core/utils/result';

type Input = {
    userId: string;
};

type Output = {
    transactions: Transaction[];
};

export class GetUserTransactionsUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ userId }: Input): Promise<Result<Output, Error>> => {
        const result = await this.transactionRepository.findManyByUserId(userId);
        if (!result.success) return fail(result.error);
        const transactions = result.value;

        return ok({ transactions });
    };
}
