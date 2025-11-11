import { ObjectId } from 'mongodb';
import { BaseDocument } from '../shared/shared-types';

export type TransactionData = {
    month: string;
    name: string;
    value: number;
    isIncome: boolean;
    userId: ObjectId;
};

export type Transaction = TransactionData & BaseDocument;

export type UpdateTransactionData = Pick<
    TransactionData,
    'name' | 'value' | 'isIncome'
>;
