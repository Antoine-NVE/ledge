import { ObjectId } from 'mongodb';

export type NewTransaction = {
    month: string;
    name: string;
    value: number;
    isIncome: boolean;
    isRecurring: boolean;
    userId: ObjectId;
};

export type Transaction = NewTransaction & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
};
