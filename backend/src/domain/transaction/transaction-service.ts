import { TransactionRepository } from './transaction-repository';
import { NewTransaction, Transaction } from './transaction-types';
import { NotFoundError } from '../../core/errors/not-found-error';

type CreateInput = {
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'income' | 'expense';
    expenseCategory?: 'need' | 'want' | 'investment' | null;
};

type FindManyByUserIdInput = {
    userId: string;
};

type FindByIdInput = {
    id: string;
};

type UpdateInput = {
    transaction: Transaction;
    name: string;
    value: number;
    type: 'income' | 'expense';
    expenseCategory?: 'need' | 'want' | 'investment' | null;
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
        if (!transaction) throw new NotFoundError('Transaction not found');
        return transaction;
    };

    update = async ({
        transaction,
        name,
        value,
        type,
        expenseCategory,
    }: UpdateInput) => {
        transaction.name = name;
        transaction.value = value;
        transaction.type = type;
        transaction.expenseCategory = expenseCategory;
        transaction.updatedAt = new Date();

        await this.transactionRepository.save(transaction);
        return transaction;
    };

    deleteById = async ({ id }: DeleteByIdInput) => {
        const transaction = await this.transactionRepository.deleteById(id);
        if (!transaction) throw new NotFoundError('Transaction not found');
        return transaction;
    };
}
