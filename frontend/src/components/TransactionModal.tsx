import { useState } from 'react';
import { NewTransaction, Transaction } from '../types/transaction';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialTransaction: Transaction | null;
    month: string;
    onSave: (transaction: Transaction) => void;
}

const TransactionModal = ({ isOpen, onClose, initialTransaction, month, onSave }: Props) => {
    if (!isOpen) return null;

    const [form, setForm] = useState({
        name: initialTransaction?.name ?? '',
        value: initialTransaction ? initialTransaction.value / 100 : '',
        isIncome: initialTransaction?.isIncome ?? false,
        isFixed: initialTransaction?.isFixed ?? false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});

    const createTransaction = async (transaction: NewTransaction) => {
        setIsLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            onSave(data.data.transaction);
        } catch (error: any) {
            if (error?.errors) {
                setFormErrors({ ...error.errors, general: error.message });
            } else {
                setFormErrors({ general: 'An error occurred while creating the transaction.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateTransaction = async (transaction: Transaction) => {
        setIsLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + '/transactions/' + transaction._id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transaction),
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            onSave(data.data.transaction);
        } catch (error: any) {
            if (error?.errors) {
                setFormErrors({ ...error.errors, general: error.message });
            } else {
                setFormErrors({ general: 'An error occurred while updating the transaction.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = form.value === '' ? 0 : Math.round(Number(form.value) * 100);

        if (initialTransaction) {
            const transaction: Transaction = {
                ...initialTransaction,
                ...form,
                value: amount,
            };

            updateTransaction(transaction);
        } else {
            const transaction: NewTransaction = {
                ...form,
                value: amount,
                month,
            };

            createTransaction(transaction);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 cursor-pointer">
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-6">
                    {initialTransaction ? 'Update transaction' : 'Add transaction'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full border rounded px-3 py-2 text-sm"
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                    </div>

                    {/* Value */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Value (€)</label>
                        <input
                            type="number"
                            value={form.value}
                            onChange={(e) => {
                                const val = e.target.value;
                                setForm({ ...form, value: val === '' ? '' : parseFloat(val) });
                            }}
                            className="w-full border rounded px-3 py-2 text-sm"
                            min={0}
                            step="any"
                        />
                        {formErrors.value && <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>}
                    </div>

                    {/* isIncome / isFixed */}
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                className="cursor-pointer"
                                type="checkbox"
                                checked={form.isIncome}
                                onChange={(e) => setForm({ ...form, isIncome: e.target.checked })}
                            />
                            <span>Income</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                className="cursor-pointer"
                                type="checkbox"
                                checked={form.isFixed}
                                onChange={(e) => setForm({ ...form, isFixed: e.target.checked })}
                            />
                            <span>Fixed</span>
                        </label>
                    </div>

                    {/* General error */}
                    {formErrors.general && <p className="text-red-600 text-sm">{formErrors.general}</p>}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 cursor-pointer transition">
                        {isLoading
                            ? initialTransaction
                                ? 'Updating...'
                                : 'Adding...'
                            : initialTransaction
                            ? 'Update'
                            : 'Add'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionModal;
