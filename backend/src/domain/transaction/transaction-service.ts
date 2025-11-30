import { TransactionRepository } from './transaction-repository';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { NewTransaction, Transaction } from './transaction-types';

type CreateInput =
    | {
          userId: string;
          month: string;
          name: string;
          value: number;
          type: 'income';
          expenseCategory: undefined;
      }
    | {
          userId: string;
          month: string;
          name: string;
          value: number;
          type: 'expense';
          expenseCategory: 'need' | 'want' | 'investment' | null;
      };

type FindManyByUserId = {
    userId: string;
};

type FindById = {
    id: string;
};

type UpdateInput =
    | {
          transaction: Transaction;
          name: string;
          value: number;
          type: 'income';
          expenseCategory: undefined;
      }
    | {
          transaction: Transaction;
          name: string;
          value: number;
          type: 'expense';
          expenseCategory: 'need' | 'want' | 'investment' | null;
      };

type DeleteById = {
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

    findManyByUserId = async ({ userId }: FindManyByUserId) => {
        return await this.transactionRepository.findManyByUserId(userId);
    };

    findById = async ({ id }: FindById) => {
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

    deleteById = async ({ id }: DeleteById) => {
        const transaction = await this.transactionRepository.deleteById(id);
        if (!transaction) throw new NotFoundError('Transaction not found');
        return transaction;
    };
}
