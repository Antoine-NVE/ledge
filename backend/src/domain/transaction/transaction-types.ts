import { ObjectId } from 'mongodb';

export type TransactionData = {
    month: string;
    name: string;
    value: number;
    isIncome: boolean;
    isRecurring: boolean;
    userId: ObjectId;
};

export type TransactionUpdateData = Omit<TransactionData, 'month' | 'userId'>;

export type Transaction = TransactionData & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
};
