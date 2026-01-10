import type { Transaction } from './transaction-types.js';

export interface TransactionRepository {
    create: (transaction: Transaction) => Promise<void>;
    findManyByUserId: (userId: string) => Promise<Transaction[]>;
    findById: (id: string) => Promise<Transaction | null>;
    save: (transaction: Transaction) => Promise<void>;
    delete: (transaction: Transaction) => Promise<void>;
}
