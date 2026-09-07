import { Transaction } from '../../../domain/entities/transaction.js';
import type { MongoTransactionDocument } from '../documents/mongo.transaction.document.js';
import { ObjectId } from 'mongodb';

export const MongoTransactionMapper = {
    toDocument: (transaction: Transaction): MongoTransactionDocument => ({
        _id: new ObjectId(transaction.id),
        userId: new ObjectId(transaction.userId),
        name: transaction.name,
        value: transaction.value,
        type: transaction.type,
        ...(transaction.category ? { category: transaction.category } : {}),
        date: transaction.date,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
    }),

    toEntity: (document: MongoTransactionDocument): Transaction =>
        Transaction.reconstitute(
            document._id.toString(),
            document.userId.toString(),
            document.name,
            document.value,
            document.type,
            document.category,
            document.date,
            document.createdAt,
            document.updatedAt,
        ),
};
