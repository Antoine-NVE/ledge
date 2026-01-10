import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';

type Input = {
    userId: string;
};

type Output = {
    transactions: Transaction[];
};

export class GetUserTransactionsUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ userId }: Input): Promise<Output> => {
        const transactions = await this.transactionRepository.findManyByUserId(userId);

        return { transactions };
    };
}
