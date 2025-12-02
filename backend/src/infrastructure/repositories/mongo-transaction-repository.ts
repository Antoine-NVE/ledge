import { Collection, ObjectId } from 'mongodb';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import {
    NewTransaction,
    Transaction,
} from '../../domain/transaction/transaction-types';

type TransactionDocument = {
    _id: ObjectId;
    userId: ObjectId;
    month: string;
    name: string;
    value: number;
    type: 'income' | 'expense';
    expenseCategory?: 'need' | 'want' | 'investment' | null;
    createdAt: Date;
    updatedAt?: Date;
};

export class MongoTransactionRepository implements TransactionRepository {
    constructor(
        private transactionCollection: Collection<TransactionDocument>,
    ) {}

    private toDomain({
        _id,
        userId,
        month,
        name,
        value,
        type,
        expenseCategory,
        createdAt,
        updatedAt,
    }: TransactionDocument): Transaction {
        return {
            id: _id.toString(),
            userId: userId.toString(),
            month,
            name,
            value,
            type,
            expenseCategory,
            createdAt,
            updatedAt,
        };
    }

    create = async ({
        userId,
        month,
        name,
        value,
        type,
        expenseCategory,
        createdAt,
    }: NewTransaction) => {
        const document: TransactionDocument = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            month,
            name,
            value,
            type,
            ...(expenseCategory !== undefined ? { expenseCategory } : {}), // "undefined" is converted to "null" by MongoDB, and "undefined" isn't "not defined" for JS
            createdAt,
        };
        await this.transactionCollection.insertOne(document);
        return this.toDomain(document);
    };

    findManyByUserId = async (userId: string) => {
        const documents = await this.transactionCollection
            .find({ userId: new ObjectId(userId) })
            .toArray();
        return documents.map((document) => this.toDomain(document));
    };

    findById = async (id: string) => {
        const document = await this.transactionCollection.findOne({
            _id: new ObjectId(id),
        });
        return document ? this.toDomain(document) : null;
    };

    save = async ({
        id,
        name,
        value,
        type,
        expenseCategory,
        updatedAt,
    }: Transaction) => {
        const query: {
            $set: Record<string, unknown>;
            $unset?: Record<string, 1>;
        } = {
            $set: {
                name,
                value,
                type,
                updatedAt,
            },
        };

        // If expenseCategory is undefined, we need to tell Mongo to unset it
        // Else, we just set it
        if (expenseCategory === undefined) {
            query.$unset = { expenseCategory: 1 };
        } else {
            query.$set.expenseCategory = expenseCategory;
        }

        await this.transactionCollection.updateOne(
            { _id: new ObjectId(id) },
            query,
        );
    };

    deleteById = async (id: string) => {
        const document = await this.transactionCollection.findOneAndDelete({
            _id: new ObjectId(id),
        });
        return document ? this.toDomain(document) : null;
    };
}
