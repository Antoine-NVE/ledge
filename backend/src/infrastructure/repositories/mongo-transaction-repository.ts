import { Collection, ObjectId } from 'mongodb';
import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';

type ExpenseDocument = {
    _id: ObjectId;
    userId: ObjectId;
    month: string;
    name: string;
    value: number;
    type: 'expense';
    expenseCategory?: 'need' | 'want' | 'investment';
    createdAt: Date;
    updatedAt: Date;
};

type IncomeDocument = {
    _id: ObjectId;
    userId: ObjectId;
    month: string;
    name: string;
    value: number;
    type: 'income';
    createdAt: Date;
    updatedAt: Date;
};

type TransactionDocument = ExpenseDocument | IncomeDocument;

export class MongoTransactionRepository implements TransactionRepository {
    constructor(private transactionCollection: Collection<TransactionDocument>) {}

    private toDocument = ({ id, userId, expenseCategory, ...rest }: Transaction): TransactionDocument => {
        return {
            _id: new ObjectId(id),
            userId: new ObjectId(userId),
            ...(expenseCategory !== null && { expenseCategory }),
            ...rest,
        };
    };

    private toDomain = ({ _id, userId, ...rest }: TransactionDocument): Transaction => {
        if (rest.type === 'expense') {
            return {
                id: _id.toString(),
                userId: userId.toString(),
                expenseCategory: rest.expenseCategory ?? null,
                ...rest,
            };
        }

        return {
            id: _id.toString(),
            userId: userId.toString(),
            expenseCategory: null,
            ...rest,
        };
    };

    create = async (transaction: Transaction): Promise<void> => {
        const document = this.toDocument(transaction);

        await this.transactionCollection.insertOne(document);
    };

    findManyByUserId = async (userId: string): Promise<Transaction[]> => {
        const documents = await this.transactionCollection.find({ userId: new ObjectId(userId) }).toArray();

        return documents.map((document) => this.toDomain(document));
    };

    findById = async (id: string): Promise<Transaction | null> => {
        const document = await this.transactionCollection.findOne({ _id: new ObjectId(id) });

        return document ? this.toDomain(document) : null;
    };

    save = async (transaction: Transaction): Promise<void> => {
        const { _id, ...rest } = this.toDocument(transaction);

        await this.transactionCollection.updateOne(
            { _id },
            {
                $set: rest,
                $unset: {
                    ...(!('expenseCategory' in rest) && { expenseCategory: 1 }),
                },
            },
        );
    };

    delete = async (transaction: Transaction): Promise<void> => {
        const { _id } = this.toDocument(transaction);

        await this.transactionCollection.deleteOne({ _id });
    };
}
