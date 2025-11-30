import { Collection } from 'mongodb';
import { Transaction } from './transaction-types';

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

        // Ensure the database reflects the exact shape of the Transaction object
        // Some fields (like expenseCategory) must disappear when they no longer apply,
        // otherwise old values could remain in MongoDB and create inconsistent documents
        const updateQuery: {
            $set: typeof rest;
            $unset?: Record<string, ''>;
        } = { $set: rest };

        if (!('expenseCategory' in rest)) {
            updateQuery.$unset = { expenseCategory: '' };
        }

        await this.transactionCollection.updateOne({ _id }, updateQuery);
    };

    deleteOne = async (transaction: Transaction): Promise<void> => {
        await this.transactionCollection.deleteOne({ _id: transaction._id });
    };
}
