type Income = {
    month: string;
    name: string;
    value: number;
    type: "income";
};

type Expense = {
    month: string;
    name: string;
    value: number;
    type: "expense";
    expenseCategory: "need" | "want" | "investment" | null;
};

export type NewTransaction = Income | Expense;

export type Transaction = NewTransaction & {
    _id: string;
    createdAt: string;
    updatedAt: string;
};
