export type Transaction = {
    id: string;
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'income' | 'expense';
    expenseCategory?: 'need' | 'want' | 'investment' | null;
    createdAt: Date;
    updatedAt?: Date;
};

export type NewTransaction = Omit<Transaction, 'id' | 'updatedAt'>;
