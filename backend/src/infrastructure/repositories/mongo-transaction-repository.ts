import { Collection, ObjectId } from 'mongodb';
import { TransactionRepository } from '../../domain/transaction/transaction-repository';
import { Transaction } from '../../domain/transaction/transaction-types';
import { fail, ok, Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

type TransactionDocument = {
    _id: ObjectId;
    userId: ObjectId;
    month: string;
    name: string;
    value: number;
    type: 'expense' | 'income';
    expenseCategory?: 'need' | 'want' | 'investment' | null;
    createdAt: Date;
    updatedAt: Date;
};

export class MongoTransactionRepository implements TransactionRepository {
    constructor(private transactionCollection: Collection<TransactionDocument>) {}

    private toDocument = ({ id, userId, expenseCategory, ...rest }: Transaction): TransactionDocument => {
        return {
            _id: new ObjectId(id),
            userId: new ObjectId(userId),
            ...(expenseCategory !== undefined && { expenseCategory }),
            ...rest,
        };
    };

    private toDomain = ({ _id, userId, expenseCategory, ...rest }: TransactionDocument): Transaction => {
        return {
            id: _id.toString(),
            userId: userId.toString(),
            expenseCategory,
            ...rest,
        };
    };

    create = async (transaction: Transaction): Promise<Result<void, Error>> => {
        const document = this.toDocument(transaction);
        try {
            await this.transactionCollection.insertOne(document);
            return ok(undefined);
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

    findById = async (id: string): Promise<Result<Transaction, Error | NotFoundError>> => {
        try {
            const document = await this.transactionCollection.findOne({ _id: new ObjectId(id) });
            if (!document) return fail(new NotFoundError({ message: 'Transaction not found' }));
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    save = async (transaction: Transaction): Promise<Result<void, Error | NotFoundError>> => {
        const { _id, expenseCategory, ...rest } = this.toDocument(transaction);
        try {
            const result = await this.transactionCollection.updateOne(
                { _id },
                {
                    $set: {
                        ...(expenseCategory !== undefined && { expenseCategory }),
                        ...rest,
                    },
                    $unset: {
                        ...(expenseCategory === undefined && { expenseCategory: 1 }),
                    },
                },
            );
            if (result.matchedCount === 0) return fail(new NotFoundError({ message: 'Transaction not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    delete = async (transaction: Transaction): Promise<Result<void, Error | NotFoundError>> => {
        const { _id } = this.toDocument(transaction);
        try {
            const result = await this.transactionCollection.deleteOne({ _id });
            if (result.deletedCount === 0) return fail(new NotFoundError({ message: 'Transaction not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
