import type { ObjectId } from 'mongodb';

export type TransactionDocument = Readonly<
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
