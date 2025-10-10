import { ObjectId } from 'mongodb';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction } from '../types/Transaction';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    insertOne = async (
        month: string,
        name: string,
        value: number,
        isIncome: boolean,
        isRecurring: boolean,
        userId: ObjectId,
    ): Promise<Transaction> => {
        const transaction: Transaction = {
            _id: new ObjectId(),
            month,
            name,
            value,
            isIncome,
            isRecurring,
            userId,
            createdAt: new Date(),
            updatedAt: null,
        };

        await this.transactionRepository.insertOne(transaction);

        return transaction;
    };

    findByUserId = async (userId: ObjectId): Promise<Transaction[]> => {
        return await this.transactionRepository.find('userId', userId);
    };

    findOneById = async (id: ObjectId): Promise<Transaction | null> => {
        return await this.transactionRepository.findOne('_id', id);
    };

    updateOne = async (transaction: Transaction): Promise<Transaction> => {
        transaction.updatedAt = new Date();

        await this.transactionRepository.updateOne(transaction);

        return transaction;
    };

    deleteOneById = async (id: ObjectId): Promise<void> => {
        await this.transactionRepository.deleteOne('_id', id);
    };
}
