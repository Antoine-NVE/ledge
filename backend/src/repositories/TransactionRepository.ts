import { Collection, ObjectId, OptionalId } from 'mongodb';
import { Transaction } from '../types/transactionType';

export class TransactionRepository {
    constructor(private transactionCollection: Collection<Transaction>) {}

    insertOne = async (transaction: Transaction): Promise<void> => {
        await this.transactionCollection.insertOne(transaction);
    };

    find = async <K extends keyof Transaction>(
        key: K,
        value: Transaction[K],
    ): Promise<Transaction[]> => {
        return this.transactionCollection.find({ [key]: value }).toArray();
    };

    findOne = async <K extends keyof Transaction>(
        key: K,
        value: Transaction[K],
    ): Promise<Transaction | null> => {
        return this.transactionCollection.findOne({ [key]: value });
    };

    updateOne = async (transaction: Transaction): Promise<void> => {
        const { _id, ...rest } = transaction;
        await this.transactionCollection.updateOne({ _id }, { $set: rest });
    };

    deleteOne = async <K extends keyof Transaction>(
        key: K,
        value: Transaction[K],
    ): Promise<void> => {
        await this.transactionCollection.deleteOne({ [key]: value });
    };
}
