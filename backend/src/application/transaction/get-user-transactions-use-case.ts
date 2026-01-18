import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';

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
