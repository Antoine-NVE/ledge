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
    type: 'income' | 'expense' | null;
    expenseCategory?: 'need' | 'want' | 'investment' | null;
}

interface FormErrors {
    general: string;
    name: string;
    value: string;
    type: string;
}

const EMPTY_FORM: FormTransaction = {
    name: '',
    value: '',
    type: null,
    expenseCategory: undefined,
};

const EMPTY_ERRORS: FormErrors = {
    general: '',
    name: '',
    value: '',
    type: '',
};

const TransactionModal = ({
    isOpen,
    onClose,
    initialTransaction,
    month,
    onSave,
}: Props) => {
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
        if (form.type === null) {
            errors.type = 'Type is required';
        }
        setFormErrors(errors);
        if (Object.values(errors).some((error) => error !== '')) {
            return;
        }

        const value = Number(form.value);

        if (initialTransaction) {
            const transaction: Transaction = {
                ...initialTransaction,
                ...form,
                value,
                type: form.type!,
                expenseCategory:
                    form.type === 'expense' ? form.expenseCategory : undefined,
            };
            handleUpdate(transaction);
        } else {
            const transaction: NewTransaction = {
                ...form,
                value,
                type: form.type!,
                month,
                expenseCategory:
                    form.type === 'expense' ? form.expenseCategory : undefined,
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
                setFormErrors((prev) => ({
                    ...prev,
                    ...result.errors,
                    general: result.message,
                }));
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
                setFormErrors((prev) => ({
                    ...prev,
                    ...result.errors,
                    general: result.message,
                }));
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
                      value: String(initialTransaction.value),
                      type: initialTransaction.type,
                      expenseCategory:
                          initialTransaction.type === 'expense'
                              ? (initialTransaction.expenseCategory ?? null)
                              : null,
                  }
                : EMPTY_FORM,
        );

        cleanFormErrors();
        setIsFormReady(true);
    }, [isOpen, initialTransaction]);

    return (
        isOpen &&
        isFormReady && (
            <div
                className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
                onClick={onClose}
            >
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

                    <h2 className="text-xl font-bold mb-6">
                        {initialTransaction
                            ? 'Update transaction'
                            : 'Add transaction'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                autoFocus
                                type="text"
                                value={form.name}
                                onChange={(e) =>
                                    setForm({ ...form, name: e.target.value })
                                }
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.name}
                                </p>
                            )}
                        </div>

                        {/* Value */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Value (€)
                            </label>
                            <input
                                type="text"
                                inputMode="decimal"
                                value={form.value}
                                onChange={(e) => {
                                    const val = e.target.value.replace(
                                        ',',
                                        '.',
                                    );

                                    if (
                                        val === '' ||
                                        /^(?:\d+(?:\.\d{0,2})?)?$/.test(val)
                                    ) {
                                        setForm({ ...form, value: val });
                                    }
                                }}
                                onBlur={() => {
                                    if (form.value !== '') {
                                        const cleaned = form.value.replace(
                                            /\.$/,
                                            '',
                                        );

                                        setForm({ ...form, value: cleaned });
                                    }
                                }}
                                className="w-full border rounded px-3 py-2 text-sm"
                            />
                            {formErrors.value && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.value}
                                </p>
                            )}
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Type
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="transactionTypeModal"
                                        checked={form.type === 'income'}
                                        onChange={() =>
                                            setForm({
                                                ...form,
                                                type: 'income',
                                                expenseCategory: undefined,
                                            })
                                        }
                                    />
                                    <span>Income</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        className="cursor-pointer"
                                        type="radio"
                                        name="transactionTypeModal"
                                        checked={form.type === 'expense'}
                                        onChange={() =>
                                            setForm({
                                                ...form,
                                                type: 'expense',
                                                expenseCategory: null,
                                            })
                                        }
                                    />
                                    <span>Expense</span>
                                </label>
                            </div>
                            {formErrors.type && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formErrors.type}
                                </p>
                            )}
                        </div>

                        {/* Expense category */}
                        {form.type === 'expense' && (
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {[
                                        {
                                            key: 'need',
                                            label: 'Need',
                                            color: 'bg-blue-500',
                                        },
                                        {
                                            key: 'want',
                                            label: 'Want',
                                            color: 'bg-red-500',
                                        },
                                        {
                                            key: 'investment',
                                            label: 'Investment',
                                            color: 'bg-green-500',
                                        },
                                    ].map((cat) => (
                                        <button
                                            key={cat.key}
                                            type="button"
                                            onClick={() =>
                                                setForm({
                                                    ...form,
                                                    expenseCategory:
                                                        form.expenseCategory ===
                                                        cat.key
                                                            ? null
                                                            : (cat.key as any),
                                                })
                                            }
                                            className={`
                        px-3 py-1 rounded-full text-white text-sm cursor-pointer transition
                        ${cat.color}
                        ${
                            form.expenseCategory === cat.key
                                ? 'opacity-100'
                                : 'opacity-40 hover:opacity-70'
                        }
                    `}
                                        >
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* General error */}
                        {formErrors.general && (
                            <p className="text-red-600 text-sm">
                                {formErrors.general}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50 cursor-pointer transition"
                        >
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
