export type Transaction = {
    id: string;
    month: string;
    name: string;
    value: number;
    type: 'expense' | 'income';
    expenseCategory: 'need' | 'want' | 'investment' | null | undefined;
    createdAt: string;
    updatedAt: string;
};

export type NewTransaction = Omit<
    Transaction,
    'id' | 'createdAt' | 'updatedAt'
>;
