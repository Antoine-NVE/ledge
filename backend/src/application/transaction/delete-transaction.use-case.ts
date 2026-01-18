import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import { ResourceNotFoundError } from '../errors/resource-not-found.error.js';
import { AuthorizationError } from '../errors/authorization.error.js';

type Input = {
    transactionId: string;
    userId: string;
};

type Output = {
    transaction: Transaction;
};

export class DeleteTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ transactionId, userId }: Input): Promise<Output> => {
        const transaction = await this.transactionRepository.findById(transactionId);
        if (!transaction) throw new ResourceNotFoundError();
        if (transaction.userId !== userId) throw new AuthorizationError();

        await this.transactionRepository.delete(transaction);

        return { transaction };
    };
}
