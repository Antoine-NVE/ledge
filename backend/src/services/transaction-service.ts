import { ObjectId } from 'mongodb';
import { TransactionRepository } from '../domain/transaction/transaction-repository';
import { NotFoundError } from '../errors/not-found-error';
import {
    Transaction,
    TransactionData,
    TransactionUpdateData,
} from '../domain/transaction/transaction-types';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    insertOne = async (data: TransactionData): Promise<Transaction> => {
        const transaction: Transaction = {
            _id: new ObjectId(),
            ...data,
            createdAt: new Date(),
            updatedAt: null,
        };

        await this.transactionRepository.insertOne(transaction);

        return transaction;
    };

    findByUserId = async (userId: ObjectId): Promise<Transaction[]> => {
        return await this.transactionRepository.find('userId', userId);
    };

    findOneById = async (id: ObjectId): Promise<Transaction> => {
        const transaction = await this.transactionRepository.findOne('_id', id);
        if (!transaction) throw new NotFoundError('Transaction not found');

        return transaction;
    };

    updateOne = async (
        transaction: Transaction,
        data: TransactionUpdateData,
    ): Promise<Transaction> => {
        transaction.updatedAt = new Date();

        Object.assign(transaction, data);

        await this.transactionRepository.updateOne(transaction);

        return transaction;
    };

    deleteOneById = async (id: ObjectId): Promise<void> => {
        await this.transactionRepository.deleteOne('_id', id);
    };
}
