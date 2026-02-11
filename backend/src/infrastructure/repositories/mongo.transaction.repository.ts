import { Collection, ObjectId } from 'mongodb';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';

type TransactionDocument = Readonly<
    | {
          _id: ObjectId;
          userId: ObjectId;
          month: string;
          name: string;
          value: number;
          type: 'expense';
          expenseCategory?: 'need' | 'want' | 'investment';
          createdAt: Date;
          updatedAt: Date;
      }
    | {
          _id: ObjectId;
          userId: ObjectId;
          month: string;
          name: string;
          value: number;
          type: 'income';
          createdAt: Date;
          updatedAt: Date;
      }
>;

export class MongoTransactionRepository implements TransactionRepository {
    constructor(private transactionCollection: Collection<TransactionDocument>) {}

    private toDocument = (transaction: Transaction): TransactionDocument => {
        return {
            _id: new ObjectId(transaction.id),
            userId: new ObjectId(transaction.userId),
            month: transaction.month,
            name: transaction.name,
            value: transaction.value,
            type: transaction.type,
            ...(transaction.expenseCategory !== null && { expenseCategory: transaction.expenseCategory }),
            createdAt: transaction.createdAt,
            updatedAt: transaction.updatedAt,
        };
    };

    private toDomain = (document: TransactionDocument): Transaction => {
        return {
            id: document._id.toString(),
            userId: document.userId.toString(),
            month: document.month,
            name: document.name,
            value: document.value,
            ...(document.type === 'expense'
                ? { type: 'expense', expenseCategory: document.expenseCategory ?? null }
                : { type: 'income', expenseCategory: null }),
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
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
