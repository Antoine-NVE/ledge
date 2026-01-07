import { Collection, ObjectId } from 'mongodb';
import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Transaction } from '../../domain/transaction/transaction-types.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';

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

    create = async (transaction: Transaction): Promise<Result<void, Error>> => {
        const document = this.toDocument(transaction);
        try {
            await this.transactionCollection.insertOne(document);
            return ok(undefined);
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    findManyByUserId = async (userId: string): Promise<Result<Transaction[], Error>> => {
        try {
            const documents = await this.transactionCollection.find({ userId: new ObjectId(userId) }).toArray();
            return ok(documents.map((document) => this.toDomain(document)));
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    getById = async (id: string): Promise<Result<Transaction, Error | NotFoundError>> => {
        try {
            const document = await this.transactionCollection.findOne({ _id: new ObjectId(id) });
            if (!document) return fail(new NotFoundError({ message: 'Transaction not found' }));
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    save = async (transaction: Transaction): Promise<Result<void, Error | NotFoundError>> => {
        const { _id, ...rest } = this.toDocument(transaction);
        try {
            const result = await this.transactionCollection.updateOne(
                { _id },
                {
                    $set: rest,
                    $unset: {
                        ...('expenseCategory' in rest && { expenseCategory: 1 }),
                    },
                },
            );
            if (result.matchedCount === 0) return fail(new NotFoundError({ message: 'Transaction not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    delete = async (transaction: Transaction): Promise<Result<void, Error | NotFoundError>> => {
        try {
            const result = await this.transactionCollection.deleteOne({ _id: new ObjectId(transaction.id) });
            if (result.deletedCount === 0) return fail(new NotFoundError({ message: 'Transaction not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };
}
