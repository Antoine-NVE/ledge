import { useEffect, useState } from 'react';
import { Transaction } from '../types/transaction';
import { deleteTransaction } from '../api/transactions';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
    onDelete: (transaction: Transaction) => void;
}

const DeleteTransactionModal = ({ isOpen, onClose, transaction, onDelete }: Props) => {
    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async (transaction: Transaction) => {
        setIsLoading(true);

        const [result, response] = await deleteTransaction(transaction);
        if (!response || !response.ok) {
            setError(result.message);
            setIsLoading(false);
            return;
        }

        setIsLoading(false);
        onDelete(transaction);
        onClose();
        setError(null);
    };

    return (
        isOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
                <div
                    className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 cursor-pointer"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-bold mb-6">Delete transaction</h2>

                    <p className="mb-4">
                        Are you sure you want to delete the transaction <strong>{transaction.name}</strong> of{' '}
                        <strong>{transaction.value} €</strong>?
                    </p>
                    <p className="text-sm text-gray-500 mb-4">This action cannot be undone. Please confirm.</p>

                    {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

                    <div className="flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md px-4 py-2 text-sm shadow cursor-pointer transition"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDelete(transaction)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 text-sm shadow cursor-pointer transition"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default DeleteTransactionModal;
