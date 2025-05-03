import { useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
    onDelete: (transaction: Transaction) => void;
}

const DeleteTransactionModal = ({ isOpen, onClose, transaction, onDelete }: Props) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteTransaction = async (transaction: Transaction) => {
        setIsLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/transactions/' + transaction._id, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            onDelete(transaction);
        } catch (error: any) {
            if (error?.message) {
                setError(error.message);
            } else {
                setError('An error occurred while deleting the transaction.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 cursor-pointer">
                        ✕
                    </button>

                    <h2 className="text-xl font-bold mb-6">Delete transaction</h2>

                    <p className="mb-4">
                        Are you sure you want to delete the transaction <strong>{transaction.name}</strong> of{' '}
                        <strong>{(transaction.value / 100).toFixed(2)} €</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mb-4">This action cannot be undone. Please confirm.</p>

                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm shadow cursor-pointer transition"
                            disabled={isLoading}>
                            Cancel
                        </button>
                        <button
                            onClick={() => deleteTransaction(transaction)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm shadow cursor-pointer transition"
                            disabled={isLoading}>
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default DeleteTransactionModal;
