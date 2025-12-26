import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { Transaction } from '../../domain/transaction/transaction-types';
import { IdGenerator } from '../ports/id-generator';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';

type Input = {
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'expense' | 'income';
    expenseCategory: 'need' | 'want' | 'investment' | null;
};

type Output = {
    transaction: Transaction;
};

export class CreateTransactionUseCase {
    constructor(
        private transactionRepository: TransactionRepository,
        private idGenerator: IdGenerator,
    ) {}

    execute = async (input: Input): Promise<Result<Output, Error>> => {
        const now = new Date();

        const transaction: Transaction = {
            id: this.idGenerator.generate(),
            ...input,
            createdAt: now,
            updatedAt: now,
        };
        const result = await this.transactionRepository.create(transaction);
        if (!result.success) return fail(result.error);

        return ok({ transaction });
    };
}
