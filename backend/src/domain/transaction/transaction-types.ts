import { ObjectId } from 'mongodb';
import { BaseDocument } from '../shared/shared-types';

export type TransactionData = {
    month: string;
    name: string;
    value: number;
    isIncome: boolean;
    isRecurring: boolean;
    userId: ObjectId;
};

export type Transaction = TransactionData & BaseDocument;
