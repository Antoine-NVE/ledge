import { TransactionRepository } from './transaction-repository';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { NewTransaction, Transaction } from './transaction-types';

type CreateTransactionInput =
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

type UpdateTransactionInput =
    | {
          month: string;
          name: string;
          value: number;
          type: 'income';
          expenseCategory: undefined;
      }
    | {
          month: string;
          name: string;
          value: number;
          type: 'expense';
          expenseCategory: 'need' | 'want' | 'investment' | null;
      };

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    create = async (data: CreateTransactionInput): Promise<Transaction> => {
        const newTransaction: NewTransaction = {
            ...data,
            createdAt: new Date(),
        };

        return await this.transactionRepository.create(newTransaction);
    };

    findManyByUserId = async (userId: string): Promise<Transaction[]> => {
        return await this.transactionRepository.findManyByUserId(userId);
    };

    findById = async (id: string): Promise<Transaction> => {
        const transaction = await this.transactionRepository.findById(id);
        if (!transaction) throw new NotFoundError('Transaction not found');
        return transaction;
    };

    update = async (
        transaction: Transaction,
        data: UpdateTransactionInput,
    ): Promise<Transaction> => {
        Object.assign(transaction, data);
        transaction.updatedAt = new Date();

        await this.transactionRepository.save(transaction);
        return transaction;
    };

    deleteById = async (id: string): Promise<Transaction> => {
        const transaction = await this.transactionRepository.deleteById(id);
        if (!transaction) throw new NotFoundError('Transaction not found');
        return transaction;
    };
}
