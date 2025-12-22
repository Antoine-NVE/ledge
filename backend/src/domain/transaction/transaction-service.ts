import { TransactionRepository } from './transaction-repository';
import { NewTransaction, Transaction } from './transaction-types';
import { NotFoundError } from '../../core/errors/not-found-error';

type CreateInput = {
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'income' | 'expense';
    expenseCategory: 'need' | 'want' | 'investment' | null | undefined;
};

type FindManyByUserIdInput = {
    userId: string;
};

type FindByIdInput = {
    id: string;
};

type UpdateInput = {
    transaction: Transaction;
    newName: string;
    newValue: number;
    newType: 'income' | 'expense';
    newExpenseCategory: 'need' | 'want' | 'investment' | null | undefined;
};

type DeleteByIdInput = {
    id: string;
};

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    create = async (data: CreateInput) => {
        const newTransaction: NewTransaction = {
            ...data,
            createdAt: new Date(),
        };

        return await this.transactionRepository.create(newTransaction);
    };

    findManyByUserId = async ({ userId }: FindManyByUserIdInput) => {
        return await this.transactionRepository.findManyByUserId(userId);
    };

    findById = async ({ id }: FindByIdInput) => {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) throw new NotFoundError({ message: 'Transaction not found' });
        return transaction;
    };

    update = async ({ transaction, newName, newValue, newType, newExpenseCategory }: UpdateInput) => {
        transaction.name = newName;
        transaction.value = newValue;
        transaction.type = newType;
        transaction.expenseCategory = newExpenseCategory;
        transaction.updatedAt = new Date();

        await this.transactionRepository.save(transaction);
        return transaction;
    };

    deleteById = async ({ id }: DeleteByIdInput) => {
        const transaction = await this.transactionRepository.deleteById(id);
        if (!transaction) throw new NotFoundError({ message: 'Transaction not found' });
        return transaction;
    };
}
