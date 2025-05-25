import { ReactNode, useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import TransactionsContext from '../contexts/TransactionsContext';

const TransactionsProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        refreshTransactions();
    }, []);

    const refreshTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/transactions', { credentials: 'include' });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to refresh transactions');
            }
            setTransactions(data.data.transactions || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    };

    const addTransaction = (transaction: Transaction) => {
        setTransactions((prev) => [...prev, transaction]);
    };

    const deleteTransaction = (transaction: Transaction) => {
        setTransactions((prev) => prev.filter((t) => t._id !== transaction._id));
    };

    const updateTransaction = (transaction: Transaction) => {
        setTransactions((prev) => prev.map((t) => (t._id === transaction._id ? transaction : t)));
    };

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                loading,
                error,
                refreshTransactions,
                addTransaction,
                deleteTransaction,
                updateTransaction,
            }}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;
