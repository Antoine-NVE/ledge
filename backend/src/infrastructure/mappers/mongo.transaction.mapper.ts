import type { Transaction } from '../../domain/entities/transaction.js';
import type { TransactionDocument } from '../types/mongo.transaction.document.js';
import { ObjectId } from 'mongodb';

export const toTransactionDocument = (transaction: Transaction): TransactionDocument => {
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

export const toTransaction = (document: TransactionDocument): Transaction => {
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
