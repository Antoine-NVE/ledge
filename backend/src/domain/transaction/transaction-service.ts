import { ObjectId } from 'mongodb';
import { TransactionRepository } from './transaction-repository';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import {
    Transaction,
    TransactionData,
    UpdateTransactionData,
} from './transaction-types';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    create = async (data: TransactionData): Promise<Transaction> => {
        const transaction: Transaction = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date(),
        };

        await this.transactionRepository.insertOne(transaction);

        return transaction;
    };

    readAll = async (userId: ObjectId): Promise<Transaction[]> => {
        return await this.transactionRepository.find('userId', userId);
    };

    read = async (id: ObjectId): Promise<Transaction> => {
        const transaction = await this.transactionRepository.findOne('_id', id);
        if (!transaction) throw new NotFoundError('Transaction not found');

        return transaction;
    };

    update = async (
        transaction: Transaction,
        data: UpdateTransactionData,
    ): Promise<Transaction> => {
        // I previously used Object.assign(transaction, data), but this can create invalid Transaction objects
        // TypeScript cannot reliably understand this mutation pattern and may not warn about inconsistent states
        // Example: switching from "expense" to "income" would keep the old expenseCategory, which should not exist
        // To avoid this, we rebuild a new Transaction object based on the new type
        const base = {
            _id: transaction._id,
            month: transaction.month,
            name: data.name,
            value: data.value,
            userId: transaction.userId,
            createdAt: transaction.createdAt,
            updatedAt: new Date(),
        };

        const updated: Transaction =
            data.type === 'income'
                ? { ...base, type: 'income' }
                : {
                      ...base,
                      type: 'expense',
                      expenseCategory: data.expenseCategory,
                  };

        await this.transactionRepository.updateOne(updated);

        return updated;
    };

    delete = async (id: ObjectId): Promise<void> => {
        await this.transactionRepository.deleteOne('_id', id);
    };
}
