import { Collection, ObjectId } from 'mongodb';
import type { TransactionRepository } from '../../domain/repositories/transaction.repository.js';
import type { Transaction } from '../../domain/entities/transaction.js';
import type { TransactionDocument } from '../types/mongo.transaction.document.js';
import { toTransaction, toTransactionDocument } from '../mappers/mongo.transaction.mapper.js';

export class MongoTransactionRepository implements TransactionRepository {
    constructor(private transactionCollection: Collection<TransactionDocument>) {}

    create = async (transaction: Transaction): Promise<void> => {
        const document = toTransactionDocument(transaction);

        await this.transactionCollection.insertOne(document);
    };

    findManyByUserId = async (userId: string): Promise<Transaction[]> => {
        const documents = await this.transactionCollection.find({ userId: new ObjectId(userId) }).toArray();

        return documents.map((document) => toTransaction(document));
    };

    findById = async (id: string): Promise<Transaction | null> => {
        const document = await this.transactionCollection.findOne({ _id: new ObjectId(id) });

        return document ? toTransaction(document) : null;
    };

    save = async (transaction: Transaction): Promise<void> => {
        const { _id, ...rest } = toTransactionDocument(transaction);

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
        const { _id } = toTransactionDocument(transaction);

        await this.transactionCollection.deleteOne({ _id });
    };
}
