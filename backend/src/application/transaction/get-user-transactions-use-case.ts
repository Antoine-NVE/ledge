import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Result } from '../../core/types/result.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import { fail, ok } from '../../core/utils/result.js';

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
        const transactions = result.data;

        return ok({ transactions });
    };
}
