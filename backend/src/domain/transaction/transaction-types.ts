type Income = {
    id: string;
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'income';
    expenseCategory: undefined;
    createdAt: Date;
    updatedAt?: Date;
};

type Expense = {
    id: string;
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'expense';
    expenseCategory: 'need' | 'want' | 'investment' | null;
    createdAt: Date;
    updatedAt?: Date;
};

export type Transaction = Income | Expense;

export type NewTransaction = Omit<Transaction, 'id'>;
