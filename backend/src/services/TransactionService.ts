import { ObjectId } from 'mongodb';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction } from '../types/Transaction';
import { TransactionNotFoundError } from '../errors/NotFoundError';
import { InvalidDataError } from '../errors/InternalServerError';
import { TransactionSchema } from '../schemas/TransactionSchema';
import z from 'zod';

export class TransactionService {
    constructor(
        private transactionRepository: TransactionRepository,
        private transactionSchema: TransactionSchema,
    ) {}

    insertOne = async (
        month: string,
        name: string,
        value: number,
        isIncome: boolean,
        isRecurring: boolean,
        userId: ObjectId,
    ): Promise<Transaction> => {
        const { success, data, error } = this.transactionSchema.base.safeParse({
            _id: new ObjectId(),
            month,
            name,
            value,
            isIncome,
            isRecurring,
            userId,
            createdAt: new Date(),
            updatedAt: null,
        });
        if (!success) throw new InvalidDataError(z.flattenError(error));
        const transaction = data;

        await this.transactionRepository.insertOne(transaction);

        return transaction;
    };

    findByUserId = async (userId: ObjectId): Promise<Transaction[]> => {
        return await this.transactionRepository.find('userId', userId);
    };

    findOneById = async (id: ObjectId): Promise<Transaction> => {
        const transaction = await this.transactionRepository.findOne('_id', id);
        if (!transaction) throw new TransactionNotFoundError();

        return transaction;
    };

    updateOne = async (transaction: Transaction): Promise<Transaction> => {
        transaction.updatedAt = new Date();

        const { success, data, error } = this.transactionSchema.base.safeParse(transaction);
        if (!success) throw new InvalidDataError(z.flattenError(error));
        transaction = data;

        await this.transactionRepository.updateOne(transaction);

        return transaction;
    };

    deleteOneById = async (id: ObjectId): Promise<void> => {
        await this.transactionRepository.deleteOne('_id', id);
    };
}
