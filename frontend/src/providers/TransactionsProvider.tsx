import { ReactNode, useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import TransactionsContext from '../contexts/TransactionsContext';
import { getAllTransactions } from '../api/transactions';

const TransactionsProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const syncTransactions = async () => {
        setLoading(true);
        setError(null);

        const [result, response] = await getAllTransactions();
        if (!response || !response.ok) {
            setError(result.message);
            setLoading(false);
            return;
        }

        setTransactions(result.data!.transactions);
        setLoading(false);
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

    useEffect(() => {
        syncTransactions();
    }, []);

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                loading,
                error,
                syncTransactions,
                addTransaction,
                deleteTransaction,
                updateTransaction,
            }}>
            {children}
        </TransactionsContext.Provider>
    );
};

export default TransactionsProvider;
