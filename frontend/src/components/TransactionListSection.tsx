import { Transaction } from '../types/transaction';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
    transactions: Transaction[];
    total: number;
    type: 'income' | 'expense';
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
}

const TransactionListSection = ({ transactions, total, type, onEdit, onDelete }: Props) => {
    const bgColor = type === 'income' ? 'bg-green-50' : 'bg-red-50';
    const titleColor = type === 'income' ? 'text-green-700' : 'text-red-700';
    const totalColor = type === 'income' ? 'text-green-800' : 'text-red-800';
    const valueColor = type === 'income' ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`${bgColor} rounded-lg p-4 shadow-md flex flex-col`}>
            <h3 className={`text-lg font-bold mb-2 ${titleColor}`}>{type === 'income' ? 'Incomes' : 'Expenses'}</h3>
            <p className={`font-semibold mb-4 ${totalColor}`}>{total.toFixed(2)} €</p>

            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <div key={transaction.id} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                        <div className="flex justify-between items-center">
                            <h4 className="text-gray-800 font-medium">{transaction.name}</h4>
                            <div>
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => onDelete(transaction)}
                                    className="text-red-500 hover:text-red-700 cursor-pointer ml-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                        <p className={`font-bold ${valueColor}`}>
                            {type === 'income' ? '' : '- '}
                            {transaction.value} €
                        </p>
                        {transaction.type === 'expense' && transaction.expenseCategory ? (
                            <p
                                className={`capitalize font-bold ${transaction.expenseCategory === 'need' ? 'text-blue-500' : transaction.expenseCategory === 'want' ? 'text-red-500' : 'text-green-500'}`}
                            >
                                {transaction.expenseCategory}
                            </p>
                        ) : undefined}
                        <p className="text-gray-500 text-sm">
                            Added on {new Date(transaction.createdAt).toLocaleDateString('fr-FR')} at{' '}
                            {new Date(transaction.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                        {transaction.updatedAt && (
                            <p className="text-gray-500 text-sm">
                                Updated on {new Date(transaction.updatedAt).toLocaleDateString('fr-FR')} at{' '}
                                {new Date(transaction.updatedAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">{type === 'income' ? 'No income' : 'No expense'}</p>
            )}
        </div>
    );
};

export default TransactionListSection;
