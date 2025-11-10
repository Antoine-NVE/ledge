import { ObjectId } from 'mongodb';
import { TransactionRepository } from './transaction-repository';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { Transaction, TransactionData } from './transaction-types';

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
        data: Omit<TransactionData, 'month' | 'userId'>,
    ): Promise<Transaction> => {
        transaction.updatedAt = new Date();

        Object.assign(transaction, data);

        await this.transactionRepository.updateOne(transaction);

        return transaction;
    };

    delete = async (id: ObjectId): Promise<void> => {
        await this.transactionRepository.deleteOne('_id', id);
    };
}
