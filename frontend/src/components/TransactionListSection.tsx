import type { TransactionDto } from '@shared/dto/transaction.dto';
import { Pencil, Trash2 } from 'lucide-react';

interface Props {
    transactions: TransactionDto[];
    total: number;
    type: 'income' | 'expense';
    onEdit: (transaction: TransactionDto) => void;
    onDelete: (transaction: TransactionDto) => void;
}

const TransactionListSection = ({ transactions, total, type, onEdit, onDelete }: Props) => {
    const bgColor = type === 'income' ? 'bg-green-50' : 'bg-red-50';
    const titleColor = type === 'income' ? 'text-green-700' : 'text-red-700';
    const totalColor = type === 'income' ? 'text-green-800' : 'text-red-800';
    const valueColor = type === 'income' ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`${bgColor} rounded-lg p-4 shadow-md flex flex-col transition-all`}>
            <div className="flex justify-between items-end mb-4 border-b pb-2 border-black/5">
                <h3 className={`text-lg font-bold ${titleColor} select-none`}>
                    {type === 'income' ? 'Incomes' : 'Expenses'}
                </h3>
                <p className={`font-semibold ${totalColor} select-none`}>{total.toFixed(2)} €</p>
            </div>

            <div className="flex flex-col gap-2">
                {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="bg-white p-3 rounded-md shadow-sm border border-gray-100 hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-gray-800 font-medium select-none">{transaction.name}</h4>

                                    <p className="text-gray-400 text-xs mt-0.5 select-none">
                                        {new Date(transaction.createdAt).toLocaleString('en-UK')}
                                    </p>
                                </div>

                                <div className="flex flex-col items-end">
                                    <p className={`font-bold ${valueColor} select-none`}>
                                        {type === 'income' ? '+' : '-'} {transaction.value} €
                                    </p>

                                    {transaction.type === 'expense' && transaction.expenseCategory && (
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full mt-1 capitalize select-none font-medium
                                            ${
                                                transaction.expenseCategory === 'need'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : transaction.expenseCategory === 'want'
                                                      ? 'bg-red-100 text-red-700'
                                                      : 'bg-green-100 text-green-700'
                                            }`}
                                        >
                                            {transaction.expenseCategory}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-3 pt-2 border-t border-gray-50">
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="text-gray-400 hover:text-blue-600 transition cursor-pointer p-1"
                                    aria-label="Edit"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => onDelete(transaction)}
                                    className="text-gray-400 hover:text-red-600 transition cursor-pointer p-1"
                                    aria-label="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-sm text-center italic py-4 select-none">
                        No {type} for this month.
                    </p>
                )}
            </div>
        </div>
    );
};

export default TransactionListSection;
