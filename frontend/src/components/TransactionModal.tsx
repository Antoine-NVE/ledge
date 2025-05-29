import { useEffect, useState } from 'react';
import { NewTransaction, Transaction } from '../types/transaction';
import { createTransaction, updateTransaction } from '../api/transactions';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialTransaction: Transaction | null;
    month: string;
    onSave: (transaction: Transaction) => void;
}

interface FormTransaction {
    name: string;
    value: string;
    isIncome: boolean | null;
    isFixed: boolean | null;
}

interface FormErrors {
    general: string;
    name: string;
    value: string;
    isIncome: string;
    isFixed: string;
}

const EMPTY_FORM: FormTransaction = {
    name: '',
    value: '',
    isIncome: null,
    isFixed: null,
};

const EMPTY_ERRORS: FormErrors = {
    general: '',
    name: '',
    value: '',
    isIncome: '',
    isFixed: '',
};

const TransactionModal = ({ isOpen, onClose, initialTransaction, month, onSave }: Props) => {
    // === State ===
    const [form, setForm] = useState<FormTransaction>(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState<FormErrors>(EMPTY_ERRORS);

    const [isFormReady, setIsFormReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // === Handlers ===
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const errors: FormErrors = {
            ...EMPTY_ERRORS,
        };
        if (form.name.trim() === '') {
            errors.name = 'Name is required';
        }
        if (form.value.trim() === '') {
            errors.value = 'Value is required';
        } else if (isNaN(Number(form.value))) {
            errors.value = 'Value must be a number';
        } else if (Number(form.value) <= 0) {
            errors.value = 'Value must be greater than 0';
        }
        if (form.isIncome === null) {
            errors.isIncome = 'Type is required';
        }
        if (form.isFixed === null) {
            errors.isFixed = 'Fixed is required';
        }
        setFormErrors(errors);
        if (Object.values(errors).some((error) => error !== '')) {
            return;
        }

        const value = Math.round(Number(form.value) * 100);

        if (initialTransaction) {
            const transaction: Transaction = {
                ...initialTransaction,
                ...form,
                value,
                isFixed: form.isFixed!,
                isIncome: form.isIncome!,
            };
            handleUpdate(transaction);
        } else {
            const transaction: NewTransaction = {
                ...form,
                value,
                isFixed: form.isFixed!,
                isIncome: form.isIncome!,
                month,
            };
            handleCreate(transaction);
        }
    };

    // Clean form and errors
    const cleanForm = () => {
        setForm(EMPTY_FORM);
    };

    const cleanFormErrors = () => {
        setFormErrors(EMPTY_ERRORS);
    };

    // === Async functions ===
    const handleCreate = async (transaction: NewTransaction) => {
        setIsLoading(true);

        const [result, response] = await createTransaction(transaction);

        if (!response || !response.ok) {
            setIsLoading(false);
            if (result.errors) {
                setFormErrors((prev) => ({ ...prev, ...result.errors, general: result.message }));
            } else {
                setFormErrors((prev) => ({ ...prev, general: result.message }));
            }
            return;
        }

        setIsLoading(false);
        onSave(result.data!.transaction);
    };

    const handleUpdate = async (transaction: Transaction) => {
        setIsLoading(true);

        const [result, response] = await updateTransaction(transaction);
        if (!response || !response.ok) {
            setIsLoading(false);
            if (result.errors) {
                setFormErrors((prev) => ({ ...prev, ...result.errors, general: result.message }));
            } else {
                setFormErrors((prev) => ({ ...prev, general: result.message }));
            }
            return;
        }

        setIsLoading(false);
        onSave(result.data!.transaction);
    };

    // === Effects ===

    // Handle Escape key to close modal
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Lock body scroll when modal is open
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

    // Initialize form values
    useEffect(() => {
        if (!isOpen) {
            cleanForm();
            cleanFormErrors();
            setIsFormReady(false);
            return;
        }

        setForm(
            initialTransaction
                ? {
                      name: initialTransaction.name,
                      value: (initialTransaction.value / 100).toFixed(2),
                      isIncome: initialTransaction.isIncome,
                      isFixed: initialTransaction.isFixed,
                  }
                : EMPTY_FORM
        );

        cleanFormErrors();
        setIsFormReady(true);
    }, [isOpen, initialTransaction]);

    return (
        isOpen &&
        isFormReady && (
            <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
                <div
                    className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
                    onClick={(e) => e.stopPropagation()}>
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
                                autoFocus
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
                                inputMode="decimal"
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
                                        name="transactionTypeModal"
                                        checked={form.isIncome === true}
                                        onChange={() => setForm({ ...form, isIncome: true })}
                                    />
                                    <span>Income</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="transactionTypeModal"
                                        checked={form.isIncome === false}
                                        onChange={() => setForm({ ...form, isIncome: false })}
                                    />
                                    <span>Expense</span>
                                </label>
                            </div>
                            {formErrors.isIncome && <p className="text-red-500 text-sm mt-1">{formErrors.isIncome}</p>}
                        </div>

                        {/* Fixed */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Fixed</label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="isFixedModal"
                                        checked={form.isFixed === true}
                                        onChange={() => setForm({ ...form, isFixed: true })}
                                    />
                                    <span>Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="isFixedModal"
                                        checked={form.isFixed === false}
                                        onChange={() => setForm({ ...form, isFixed: false })}
                                    />
                                    <span>No</span>
                                </label>
                            </div>
                            {formErrors.isFixed && <p className="text-red-500 text-sm mt-1">{formErrors.isFixed}</p>}
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
        )
    );
};

export default TransactionModal;
