import { NewTransaction, Transaction } from './transaction-types';

export interface TransactionRepository {
    create: (newTransaction: NewTransaction) => Promise<Transaction>;
    findManyByUserId: (userId: string) => Promise<Transaction[]>;
    findById: (id: string) => Promise<Transaction | null>;
    save: (transaction: Transaction) => Promise<void>;
    deleteById: (id: string) => Promise<Transaction | null>;
}
