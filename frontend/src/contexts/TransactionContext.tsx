import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Transaction {
    _id: string;
    month: string;
    income: boolean;
    fixed: boolean;
    name: string;
    value: number;
}

interface TransactionContextType {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    updateTransaction: (id: string, updatedFields: Partial<Transaction>) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/transactions');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Failed to fetch transactions');
                }

                setTransactions(data.data.transactions || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const addTransaction = (transaction: Transaction) => {
        setTransactions((prev) => [...prev, transaction]);
    };

    const deleteTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
    };

    const updateTransaction = (id: string, updatedFields: Partial<Transaction>) => {
        setTransactions((prev) => prev.map((t) => (t._id === id ? { ...t, ...updatedFields } : t)));
    };

    return (
        <TransactionContext.Provider
            value={{ transactions, loading, error, addTransaction, deleteTransaction, updateTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
