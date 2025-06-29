import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import TransactionListSection from '../components/TransactionListSection';
import { Transaction } from '../types/transaction';
import TransactionModal from '../components/TransactionModal';
import DeleteTransactionModal from '../components/DeleteTransactionModal';
import { getAllTransactions } from '../api/transactions';
import useUser from '../hooks/useUser';

type SortOption = 'value-desc' | 'value-asc' | 'alphabetical' | 'reverse-alphabetical';

const Month = () => {
    const params = useParams<{ month: string }>();
    const month = params.month;

    const { isLoading: isUserLoading } = useUser();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const addTransaction = (transaction: Transaction) => {
        setTransactions((prev) => [...prev, transaction]);
    };
    const updateTransaction = (updatedTransaction: Transaction) => {
        setTransactions((prev) => prev.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t)));
    };
    const deleteTransaction = (transaction: Transaction) => {
        setTransactions((prev) => prev.filter((t) => t._id !== transaction._id));
    };

    useEffect(() => {
        if (isUserLoading) return;

        const fetchTransactions = async () => {
            const [result, response] = await getAllTransactions();
            if (!response || !response.ok) {
                console.error(result.message);
                return;
            }
            setTransactions(result.data!.transactions);
        };
        fetchTransactions();
    }, [isUserLoading]);

    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (!month || !regex.test(month)) {
        return <Navigate to="/" replace />;
    }

    const [year, monthNumber] = month.split('-');
    const label = `${monthNumber}/${year}`;

    const [sort, setSort] = useState<SortOption>('value-desc');

    // Filtrage par mois (source stable)
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => t.month === month);
    }, [transactions, month]);

    // Tri selon l'option active
    const displayedTransactions = useMemo(() => {
        const sorted = [...filteredTransactions];
        switch (sort) {
            case 'value-desc':
                return sorted.sort((a, b) => b.value - a.value);
            case 'value-asc':
                return sorted.sort((a, b) => a.value - b.value);
            case 'alphabetical':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'reverse-alphabetical':
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return sorted;
        }
    }, [filteredTransactions, sort]);

    // Séparation et totaux dynamiques
    const incomes = displayedTransactions.filter((t) => t.isIncome);
    const expenses = displayedTransactions.filter((t) => !t.isIncome);
    const totalIncomes = incomes.reduce((acc, t) => acc + t.value / 100, 0);
    const totalExpenses = expenses.reduce((acc, t) => acc + t.value / 100, 0);
    const total = totalIncomes - totalExpenses;

    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isDeleteTransactionModalOpen, setIsDeleteTransactionModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const handleAddTransaction = () => {
        setSelectedTransaction(null);
        setIsTransactionModalOpen(true);
    };
    const handleEditTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsTransactionModalOpen(true);
    };
    const handleCloseTransactionModal = useCallback(() => {
        setSelectedTransaction(null);
        setIsTransactionModalOpen(false);
    }, []);

    const handleDeleteTransaction = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteTransactionModalOpen(true);
    };
    const handleCloseDeleteTransactionModal = useCallback(() => {
        setSelectedTransaction(null);
        setIsDeleteTransactionModalOpen(false);
    }, []);

    return (
        <>
            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={handleCloseTransactionModal}
                initialTransaction={selectedTransaction}
                month={month}
                onSave={(transaction: Transaction) => {
                    if (selectedTransaction) {
                        // Update transaction
                        updateTransaction(transaction);

                        setSelectedTransaction(null);
                    } else {
                        // Create transaction
                        addTransaction(transaction);
                    }
                    setIsTransactionModalOpen(false);
                }}
            />

            <DeleteTransactionModal
                isOpen={isDeleteTransactionModalOpen}
                onClose={handleCloseDeleteTransactionModal}
                transaction={selectedTransaction!}
                onDelete={(transaction: Transaction) => {
                    // Delete transaction
                    deleteTransaction(transaction);

                    setSelectedTransaction(null);
                    setIsDeleteTransactionModalOpen(false);
                }}
            />

            <div className="flex flex-col flex-1 items-center p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Ledge</h1>

                <div className="flex flex-col items-center gap-4 mb-6 w-full max-w-5xl">
                    {/* Bouton "Aujourd'hui" */}
                    <button
                        onClick={() => navigate(`/month/${new Date().toISOString().slice(0, 7)}`)}
                        disabled={month === new Date().toISOString().slice(0, 7)}
                        className={`rounded-md px-3 py-1 text-sm shadow cursor-pointer transition ${
                            month === new Date().toISOString().slice(0, 7)
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-200 text-gray-800'
                        }`}>
                        Today
                    </button>

                    {/* Flèches + mois affiché */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => {
                                const [y, m] = month.split('-').map(Number);
                                const date = new Date(y, m - 1); // mois précédent
                                navigate(`/month/${date.toISOString().slice(0, 7)}`);
                            }}
                            className="text-2xl px-2 hover:text-gray-600 cursor-pointer">
                            ←
                        </button>

                        <div className="text-lg font-semibold text-center">{label}</div>

                        <button
                            onClick={() => {
                                const [y, m] = month.split('-').map(Number);
                                const date = new Date(y, m + 1); // mois suivant
                                navigate(`/month/${date.toISOString().slice(0, 7)}`);
                            }}
                            className="text-2xl px-2 hover:text-gray-600 cursor-pointer">
                            →
                        </button>
                    </div>
                </div>

                {/* Filtres / Tris */}
                <div className="flex flex-col gap-4 mb-6 w-full max-w-5xl">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                            { label: 'Value ↓', value: 'value-desc' },
                            { label: 'Value ↑', value: 'value-asc' },
                            { label: 'A-Z', value: 'alphabetical' },
                            { label: 'Z-A', value: 'reverse-alphabetical' },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSort(option.value as SortOption)}
                                className={`px-3 py-2 rounded-md text-sm shadow transition cursor-pointer w-full ${
                                    sort === option.value
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white hover:bg-gray-200 text-gray-800'
                                }`}>
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* Ajouter transaction */}
                    <button
                        onClick={handleAddTransaction}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-3 text-sm shadow cursor-pointer transition w-full">
                        + Add transaction
                    </button>
                </div>

                {/* Total global */}
                <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 mb-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800">Total balance</h3>
                    <p
                        className={`text-2xl font-bold ${
                            total > 0 ? 'text-green-900' : total < 0 ? 'text-red-900' : 'text-black'
                        }`}>
                        {total.toFixed(2)} €
                    </p>
                </div>

                {/* 2 colonnes : Revenus / Dépenses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    {/* Incomes */}
                    <TransactionListSection
                        transactions={incomes}
                        total={totalIncomes}
                        isIncome={true}
                        onEdit={(transaction: Transaction) => handleEditTransaction(transaction)}
                        onDelete={(transaction: Transaction) => handleDeleteTransaction(transaction)}
                    />

                    {/* Expenses */}
                    <TransactionListSection
                        transactions={expenses}
                        total={totalExpenses}
                        isIncome={false}
                        onEdit={(transaction: Transaction) => handleEditTransaction(transaction)}
                        onDelete={(transaction: Transaction) => handleDeleteTransaction(transaction)}
                    />
                </div>
            </div>
        </>
    );
};

export default Month;
