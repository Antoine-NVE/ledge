export interface NewTransaction {
    month: string;
    isIncome: boolean;
    isFixed: boolean;
    name: string;
    value: number;
}

export interface Transaction extends NewTransaction {
    _id: string;
    createdAt: string;
    updatedAt: string;
}
