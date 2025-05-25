import { createContext } from 'react';
import { Transaction } from '../types/transaction';

interface TransactionContextType {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    refreshTransactions: () => Promise<void>;
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (transaction: Transaction) => void;
    updateTransaction: (transaction: Transaction) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export default TransactionContext;
