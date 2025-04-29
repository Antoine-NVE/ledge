import { Navigate, useParams } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';

const Month = () => {
    const params = useParams<{ month: string }>();
    const month = params.month;

    const { transactions } = useTransactions();

    const regex = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!month || !regex.test(month)) {
        return <Navigate to="/" replace />;
    }

    const filteredTransactions = transactions.filter((transaction) => transaction.month === month);
    const incomes = filteredTransactions.filter((transaction) => transaction.income);
    const expenses = filteredTransactions.filter((transaction) => !transaction.income);
    const totalIncomes = incomes.reduce((acc, transaction) => acc + transaction.value / 100, 0);
    const totalExpenses = expenses.reduce((acc, transaction) => acc + transaction.value / 100, 0);
    const total = totalIncomes - totalExpenses;

    return (
        <div className="flex flex-col flex-1 items-center p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Ledge</h1>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{month}</h2>

            <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-4 mb-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">Solde total</h3>
                <p
                    className={`text-2xl font-bold ${
                        total > 0 ? 'text-green-900' : total < 0 ? 'text-red-900' : 'text-black'
                    }`}>
                    {total} €
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
                <div className="bg-green-50 rounded-lg p-4 shadow-md flex flex-col">
                    <h3 className="text-lg font-bold text-green-700 mb-2">Incomes</h3>
                    <p className="text-green-800 font-semibold mb-4">{totalIncomes} €</p>

                    {incomes.length > 0 ? (
                        incomes.map((transaction) => (
                            <div key={transaction._id} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                                <h4 className="text-gray-800 font-medium">{transaction.name}</h4>
                                <p className="text-green-700 font-bold">{transaction.value / 100} €</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No income</p>
                    )}
                </div>

                <div className="bg-red-50 rounded-lg p-4 shadow-md flex flex-col">
                    <h3 className="text-lg font-bold text-red-700 mb-2">Expenses</h3>
                    <p className="text-red-800 font-semibold mb-4">{totalExpenses} €</p>

                    {expenses.length > 0 ? (
                        expenses.map((transaction) => (
                            <div key={transaction._id} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                                <h4 className="text-gray-800 font-medium">{transaction.name}</h4>
                                <p className="text-red-700 font-bold">- {transaction.value / 100} €</p>
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
