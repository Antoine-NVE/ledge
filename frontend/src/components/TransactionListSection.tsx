import { Transaction } from '../types/transaction';

interface Props {
    title: string;
    transactions: Transaction[];
    total: number;
    isIncome: boolean;
}

const TransactionListSection = ({ title, transactions, total, isIncome }: Props) => {
    const bgColor = isIncome ? 'bg-green-50' : 'bg-red-50';
    const titleColor = isIncome ? 'text-green-700' : 'text-red-700';
    const totalColor = isIncome ? 'text-green-800' : 'text-red-800';
    const valueColor = isIncome ? 'text-green-700' : 'text-red-700';

    return (
        <div className={`${bgColor} rounded-lg p-4 shadow-md flex flex-col`}>
            <h3 className={`text-lg font-bold mb-2 ${titleColor}`}>{title}</h3>
            <p className={`font-semibold mb-4 ${totalColor}`}>{total.toFixed(2)} €</p>

            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <div key={transaction._id} className="bg-white p-3 rounded-md mb-2 shadow-sm">
                        <h4 className="text-gray-800 font-medium">{transaction.name}</h4>
                        <p className={`font-bold ${valueColor}`}>
                            {isIncome ? '' : '- '}
                            {(transaction.value / 100).toFixed(2)} €
                        </p>
                        <p className="text-gray-500 text-sm">
                            {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                        </p>
                        {transaction.isFixed && <p className="text-blue-700 text-sm font-medium">Fixed</p>}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">{isIncome ? 'No income' : 'No expense'}</p>
            )}
        </div>
    );
};

export default TransactionListSection;
