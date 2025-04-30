export interface Transaction {
    _id: string;
    month: string;
    isIncome: boolean;
    isFixed: boolean;
    name: string;
    value: number;
    createdAt: string;
    updatedAt: string;
}
