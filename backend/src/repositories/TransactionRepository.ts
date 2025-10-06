import { Collection, ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionData } from '../types/transaction';

export class TransactionRepository {
    constructor(private transactionCollection: Collection<TransactionData>) {}

    insertOne = async (transactionData: TransactionData): Promise<Transaction> => {
        const result = await this.transactionCollection.insertOne(transactionData);

        return {
            _id: result.insertedId,
            ...transactionData,
        };
    };

    findAllByUserId = async (userId: ObjectId): Promise<Transaction[] | null> => {
        return await this.transactionCollection.find({ userId }).toArray();
    };
}
