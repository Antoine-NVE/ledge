export type Transaction = {
    id: string;
    userId: string;
    month: string;
    name: string;
    value: number;
    type: 'expense' | 'income';
    expenseCategory: 'need' | 'want' | 'investment' | null;
    createdAt: Date;
    updatedAt: Date;
};
