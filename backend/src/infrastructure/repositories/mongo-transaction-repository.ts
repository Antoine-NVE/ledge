import { Collection, ObjectId } from 'mongodb';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { NewTransaction, Transaction } from '../../domain/transaction/transaction-types';
import { fail, ok, Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

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
    constructor(private transactionCollection: Collection<TransactionDocument>) {}

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
    }: NewTransaction): Promise<Result<Transaction, Error>> => {
        const document: TransactionDocument = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            month,
            name,
            value,
            type,
            ...(expenseCategory !== undefined ? { expenseCategory } : {}), // "undefined" is converted to "null" by MongoDB
            createdAt,
        };

        try {
            await this.transactionCollection.insertOne(document);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findManyByUserId = async (userId: string): Promise<Result<Transaction[], Error>> => {
        try {
            const documents = await this.transactionCollection.find({ userId: new ObjectId(userId) }).toArray();
            return ok(documents.map((document) => this.toDomain(document)));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findById = async (id: string): Promise<Result<Transaction, NotFoundError | Error>> => {
        try {
            const document = await this.transactionCollection.findOne({
                _id: new ObjectId(id),
            });
            if (!document) {
                return fail(new NotFoundError({ message: 'Transaction not found' }));
            }
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    save = async ({
        id,
        name,
        value,
        type,
        expenseCategory,
        updatedAt,
    }: Transaction): Promise<Result<void, NotFoundError | Error>> => {
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

        try {
            const document = await this.transactionCollection.findOneAndUpdate({ _id: new ObjectId(id) }, query);
            if (!document) {
                return fail(new NotFoundError({ message: 'Transaction not found' }));
            }
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    deleteById = async (id: string): Promise<Result<Transaction, NotFoundError | Error>> => {
        try {
            const document = await this.transactionCollection.findOneAndDelete({
                _id: new ObjectId(id),
            });
            if (!document) {
                return fail(new NotFoundError({ message: 'Transaction not found' }));
            }
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
