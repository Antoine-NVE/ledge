export interface NewTransaction {
    month: string;
    name: string;
    value: number;
    type: 'income' | 'expense';
}

export interface Transaction extends NewTransaction {
    _id: string;
    createdAt: string;
    updatedAt: string;
}
