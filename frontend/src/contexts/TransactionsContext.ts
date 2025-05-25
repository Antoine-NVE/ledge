import { createContext } from 'react';
import { Transaction } from '../types/transaction';

interface TransactionsContextType {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    syncTransactions: () => Promise<void>;
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (transaction: Transaction) => void;
    updateTransaction: (transaction: Transaction) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export default TransactionsContext;
