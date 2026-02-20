import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TransactionListSection from '../components/TransactionListSection';
import TransactionModal from '../components/TransactionModal';
import DeleteTransactionModal from '../components/DeleteTransactionModal';
import DateNavigator from '../components/DateNavigator';
import { readAllTransactions } from '../api/transactions';
import type { TransactionDto } from '@shared/dto/transaction.dto';
import { useAuth } from '../hooks/useAuth.ts';

const Month = () => {
    const { user, isLoading: isUserLoading } = useAuth();
    const navigate = useNavigate();
    const params = useParams<{ month: string }>();
    const currentMonth = params.month;

    const [transactions, setTransactions] = useState<TransactionDto[]>([]);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionDto | null>(null);
    const [defaultModalType, setDefaultModalType] = useState<'income' | 'expense'>('expense');

    useEffect(() => {
        if (isUserLoading || !user) return;
        const fetchData = async () => {
            setIsLoadingTransactions(true);
            const response = await readAllTransactions();
            setIsLoadingTransactions(false);
            if (response.success) setTransactions(response.data);
        };
        fetchData();
    }, [isUserLoading, user]);

    const handleTransactionSaved = (savedTransaction: TransactionDto) => {
        setTransactions((prev) => {
            const exists = prev.find((t) => t.id === savedTransaction.id);
            if (exists) return prev.map((t) => (t.id === savedTransaction.id ? savedTransaction : t));
            return [...prev, savedTransaction];
        });
        setIsTransactionModalOpen(false);
        setSelectedTransaction(null);
    };

    const handleTransactionDeleted = (deletedTransaction: TransactionDto) => {
        setTransactions((prev) => prev.filter((t) => t.id !== deletedTransaction.id));
        setIsDeleteModalOpen(false);
        setSelectedTransaction(null);
    };

    const currentMonthTransactions = useMemo(() => {
        return transactions.filter((t) => t.month === currentMonth).sort((a, b) => b.value - a.value);
    }, [transactions, currentMonth]);

    const openEditModal = useCallback((transaction: TransactionDto) => {
        setSelectedTransaction(transaction);
        setIsTransactionModalOpen(true);
    }, []);

    const openDeleteModal = useCallback((transaction: TransactionDto) => {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
    }, []);

    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;
    if (isUserLoading) return <div className="flex flex-col flex-1 items-center justify-center p-4">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (!currentMonth || !regex.test(currentMonth)) return <Navigate to="/" replace />;

    const [yearStr, monthStr] = currentMonth.split('-');
    const label = `${monthStr}/${yearStr}`;
    const todayStr = new Date().toISOString().slice(0, 7);

    const navigateToMonthOffset = (offset: number) => {
        const [y, m] = currentMonth.split('-').map(Number);
        const date = new Date(y, m - 1 + offset);
        date.setDate(15);
        navigate(`/month/${date.toISOString().slice(0, 7)}`);
    };

    const incomes = currentMonthTransactions.filter((t) => t.type === 'income');
    const expenses = currentMonthTransactions.filter((t) => t.type === 'expense');
    const totalIncomes = incomes.reduce((acc, t) => acc + t.value, 0);
    const totalExpenses = expenses.reduce((acc, t) => acc + t.value, 0);
    const total = totalIncomes - totalExpenses;

    const openAddModal = (type: 'income' | 'expense') => {
        setSelectedTransaction(null);
        setDefaultModalType(type);
        setIsTransactionModalOpen(true);
    };

    return (
        <>
            <Navbar />

            <TransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                initialTransaction={selectedTransaction}
                defaultType={defaultModalType}
                month={currentMonth}
                onSave={handleTransactionSaved}
            />

            {selectedTransaction && (
                <DeleteTransactionModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    transaction={selectedTransaction}
                    onDelete={handleTransactionDeleted}
                />
            )}

            <div className="flex flex-col flex-1 items-center p-4">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 select-none">Ledge</h1>

                <DateNavigator
                    label={label}
                    onPrev={() => navigateToMonthOffset(-1)}
                    onNext={() => navigateToMonthOffset(1)}
                    onToday={() => navigate(`/month/${todayStr}`)}
                    isCurrent={currentMonth === todayStr}
                />

                <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-5xl">
                    <button
                        onClick={() => openAddModal('income')}
                        className="bg-green-600 hover:bg-green-700 text-white rounded-md px-4 py-3 text-sm shadow cursor-pointer transition select-none font-semibold flex items-center justify-center gap-2"
                    >
                        + Income
                    </button>
                    <button
                        onClick={() => openAddModal('expense')}
                        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-3 text-sm shadow cursor-pointer transition select-none font-semibold flex items-center justify-center gap-2"
                    >
                        + Expense
                    </button>
                </div>

                <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 mb-6 text-center">
                    <h3 className="text-xl font-semibold text-gray-800 select-none">Total balance</h3>
                    <p
                        className={`text-2xl font-bold select-none ${total > 0 ? 'text-green-900' : total < 0 ? 'text-red-900' : 'text-black'}`}
                    >
                        {isLoadingTransactions ? '...' : `${total.toFixed(2)} €`}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                    <TransactionListSection
                        transactions={incomes}
                        total={totalIncomes}
                        type="income"
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />
                    <TransactionListSection
                        transactions={expenses}
                        total={totalExpenses}
                        type="expense"
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />
                </div>
            </div>
        </>
    );
};

export default Month;
