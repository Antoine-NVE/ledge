import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';

type GetUserTransactionsInput = { userId: string };

type GetUserTransactionsOutput = { transactions: Transaction[] };

export class GetUserTransactionsUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async (input: GetUserTransactionsInput): Promise<GetUserTransactionsOutput> => {
        const transactions = await this.transactionRepository.findManyByUserId(input.userId);

        return { transactions };
    };
}
