import { ObjectId } from 'mongodb';
import { BaseDocument } from '../shared/shared-types';

type Income = {
    month: string;
    name: string;
    value: number;
    type: 'income';
    userId: ObjectId;
};

type Expense = {
    month: string;
    name: string;
    value: number;
    type: 'expense';
    expenseCategory: 'need' | 'want' | 'investment' | null;
    userId: ObjectId;
};

export type TransactionData = Income | Expense;

export type Transaction = TransactionData & BaseDocument;

export type UpdateTransactionData =
    | Pick<Income, 'name' | 'value' | 'type'>
    | Pick<Expense, 'name' | 'value' | 'type' | 'expenseCategory'>;
