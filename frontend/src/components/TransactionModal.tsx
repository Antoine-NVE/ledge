import { useEffect, useState } from 'react';
import { NewTransaction, Transaction } from '../types/transaction';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialTransaction: Transaction | null;
    month: string;
    onSave: (transaction: Transaction) => void;
}

const TransactionModal = ({ isOpen, onClose, initialTransaction, month, onSave }: Props) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup the event listener when the component unmounts or isOpen changes
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const [form, setForm] = useState<{
        name: string;
        value: string; // Keep as string for input
        isIncome: boolean;
        isFixed: boolean;
    }>({
        name: '',
        value: '',
        isIncome: false,
        isFixed: false,
    });

    const [isFormReady, setIsFormReady] = useState(false);
    useEffect(() => {
        if (isOpen) {
            if (initialTransaction) {
                setForm({
                    name: initialTransaction.name,
                    value: (initialTransaction.value / 100).toFixed(2),
                    isIncome: initialTransaction.isIncome,
                    isFixed: initialTransaction.isFixed,
                });
            } else {
                setForm({
                    name: '',
                    value: '',
                    isIncome: false,
                    isFixed: false,
                });
            }

            setIsFormReady(true);
        } else {
            setForm({
                name: '',
                value: '',
                isIncome: false,
                isFixed: false,
            });

            setIsFormReady(false);
        }
    }, [isOpen, initialTransaction]);

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

    const [IsFetching, setIsFetching] = useState(false);
    const [formErrors, setFormErrors] = useState<{ [field: string]: string }>({});

    const createTransaction = async (transaction: NewTransaction) => {
        setIsFetching(true);
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
            setIsFetching(false);
        }
    };

    const updateTransaction = async (transaction: Transaction) => {
        setIsFetching(true);
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
            setIsFetching(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Convert to number and round to cents
        const amount = form.value === '' || isNaN(Number(form.value)) ? 0 : Math.round(Number(form.value) * 100);

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
        isOpen &&
        isFormReady && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
                <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
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
                                type="text"
                                value={form.value}
                                onChange={(e) => {
                                    const val = e.target.value.replace(',', '.');

                                    if (val === '' || /^(?:\d+(?:\.\d{0,2})?)?$/.test(val)) {
                                        setForm({ ...form, value: val });
                                    }
                                }}
                                onBlur={() => {
                                    if (form.value !== '') {
                                        const cleaned = form.value.replace(/\.$/, '');

                                        setForm({ ...form, value: cleaned });
                                    }
                                }}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                            {formErrors.value && <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="transactionType"
                                        checked={form.isIncome === true}
                                        onChange={() => setForm({ ...form, isIncome: true })}
                                    />
                                    <span>Income</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="transactionType"
                                        checked={form.isIncome === false}
                                        onChange={() => setForm({ ...form, isIncome: false })}
                                    />
                                    <span>Expense</span>
                                </label>
                            </div>
                        </div>

                        {/* Fixed */}
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                className="cursor-pointer"
                                type="checkbox"
                                checked={form.isFixed}
                                onChange={(e) => setForm({ ...form, isFixed: e.target.checked })}
                            />
                            <span>Fixed</span>
                        </label>

                        {/* General error */}
                        {formErrors.general && <p className="text-red-600 text-sm">{formErrors.general}</p>}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={IsFetching}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 cursor-pointer transition">
                            {IsFetching
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
        )
    );
};

export default TransactionModal;
