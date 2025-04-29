import { useMemo, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';

type SortOption = 'value-desc' | 'value-asc' | 'date-newest' | 'date-oldest';

const Month = () => {
    const params = useParams<{ month: string }>();
    const month = params.month;

    const { transactions } = useTransactions();

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
            case 'date-newest':
                return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            case 'date-oldest':
                return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            default:
                return sorted;
        }
    }, [filteredTransactions, sort]);

    // Séparation et totaux dynamiques
    const incomes = displayedTransactions.filter((t) => t.income);
    const expenses = displayedTransactions.filter((t) => !t.income);
    const totalIncomes = incomes.reduce((acc, t) => acc + t.value / 100, 0);
    const totalExpenses = expenses.reduce((acc, t) => acc + t.value / 100, 0);
    const total = totalIncomes - totalExpenses;

    return (
        <div className="flex flex-col flex-1 items-center p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Ledge</h1>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{label}</h2>

            {/* Filtres / Tris */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                {[
                    { label: 'Value ↓', value: 'value-desc' },
                    { label: 'Value ↑', value: 'value-asc' },
                    { label: 'Newest', value: 'date-newest' },
                    { label: 'Oldest', value: 'date-oldest' },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => setSort(option.value as SortOption)}
                        className={`px-3 py-1 rounded-md text-sm shadow transition cursor-pointer ${
                            sort === option.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-white hover:bg-gray-200 text-gray-800'
                        }`}>
                        {option.label}
                    </button>
                ))}
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
                <div className="bg-green-50 rounded-lg p-4 shadow-md flex flex-col">
                    <h3 className="text-lg font-bold text-green-700 mb-2">Incomes</h3>
                    <p className="text-green-800 font-semibold mb-4">{totalIncomes.toFixed(2)} €</p>
                    {incomes.length > 0 ? (
                        incomes.map((transaction) => (
                            <div key={transaction._id} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                                <h4 className="text-gray-800 font-medium">{transaction.name}</h4>
                                <p className="text-green-700 font-bold">{(transaction.value / 100).toFixed(2)} €</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                                {transaction.fixed && <p className="text-blue-700 text-sm font-medium">Fixed</p>}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No income</p>
                    )}
                </div>

                {/* Expenses */}
                <div className="bg-red-50 rounded-lg p-4 shadow-md flex flex-col">
                    <h3 className="text-lg font-bold text-red-700 mb-2">Expenses</h3>
                    <p className="text-red-800 font-semibold mb-4">{totalExpenses.toFixed(2)} €</p>
                    {expenses.length > 0 ? (
                        expenses.map((transaction) => (
                            <div key={transaction._id} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                                <h4 className="text-gray-800 font-medium">{transaction.name}</h4>
                                <p className="text-red-700 font-bold">- {(transaction.value / 100).toFixed(2)} €</p>
                                <p className="text-gray-500 text-sm">
                                    {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                                </p>
                                {transaction.fixed && <p className="text-blue-700 text-sm font-medium">Fixed</p>}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No expense</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Month;
