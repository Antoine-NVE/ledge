import { Collection, ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { PartialTransactionData, Transaction, TransactionData } from '../types/transaction';

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
        return this.transactionCollection.find({ userId }).toArray();
    };

    findOneById = async (id: ObjectId): Promise<Transaction | null> => {
        return this.transactionCollection.findOne({ _id: id });
    };

    findOneByIdAndUpdate = async (
        id: ObjectId,
        partialTransactionData: PartialTransactionData,
    ): Promise<Transaction | null> => {
        return this.transactionCollection.findOneAndUpdate(
            { _id: id },
            { $set: partialTransactionData },
            { returnDocument: 'after' },
        );
    };

    deleteOneById = async (id: ObjectId): Promise<void> => {
        this.transactionCollection.deleteOne({ _id: id });
    };
}
