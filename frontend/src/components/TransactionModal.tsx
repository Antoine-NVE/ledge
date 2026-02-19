import { useEffect, useState, FormEvent } from 'react';
import type { $ZodErrorTree } from 'zod/v4/core';
import { createTransaction, updateTransaction } from '../api/transactions';
import type { TransactionDto } from '@shared/dto/transaction.dto';
import type { CreateTransactionSchema } from '@shared/schemas/transaction/create.schema';
import type { UpdateTransactionSchema } from '@shared/schemas/transaction/update.schema';
import Modal from './Modal.tsx';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    initialTransaction: TransactionDto | null;
    defaultType: 'income' | 'expense';
    month: string;
    onSave: (transaction: TransactionDto) => void;
}

const TransactionModal = ({ isOpen, onClose, initialTransaction, defaultType, month, onSave }: Props) => {
    const [fixedType, setFixedType] = useState<'income' | 'expense'>(defaultType);

    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState('');
    const [value, setValue] = useState('');
    const [expenseCategory, setExpenseCategory] = useState<'need' | 'want' | 'investment' | null>(null);

    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<$ZodErrorTree<CreateTransactionSchema['body']> | null>(null);

    useEffect(() => {
        if (isOpen) {
            setGlobalError(null);
            setFieldErrors(null);
            setIsLoading(false);

            if (initialTransaction) {
                setName(initialTransaction.name);
                setValue(String(initialTransaction.value));
                setExpenseCategory(initialTransaction.type === 'expense' ? initialTransaction.expenseCategory : null);
                setFixedType(initialTransaction.type);
            } else {
                setName('');
                setValue('');
                setExpenseCategory(null);
                setFixedType(defaultType);
            }
        }
    }, [isOpen, initialTransaction, defaultType]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setGlobalError(null);
        setFieldErrors(null);

        const numValue = Number(value.replace(',', '.'));
        let response;

        if (initialTransaction) {
            let body: UpdateTransactionSchema['body'];

            if (fixedType === 'expense') {
                body = {
                    name,
                    value: numValue,
                    type: 'expense',
                    expenseCategory: expenseCategory,
                };
            } else {
                body = {
                    name,
                    value: numValue,
                    type: 'income',
                    expenseCategory: null,
                };
            }
            response = await updateTransaction(body, { transactionId: initialTransaction.id });
        } else {
            let body: CreateTransactionSchema['body'];

            if (fixedType === 'expense') {
                body = {
                    name,
                    value: numValue,
                    type: 'expense',
                    month,
                    expenseCategory: expenseCategory,
                };
            } else {
                body = {
                    name,
                    value: numValue,
                    type: 'income',
                    month,
                    expenseCategory: null,
                };
            }
            response = await createTransaction(body);
        }

        setIsLoading(false);

        if (response.success) {
            onSave(response.data);
        } else {
            if (response.code === 'BAD_REQUEST') {
                if (response.tree.properties?.body) {
                    setFieldErrors(response.tree.properties.body);
                } else {
                    setGlobalError(response.code);
                }
            } else {
                setGlobalError(response.code);
            }
        }
    };

    const properties = fieldErrors?.properties;

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={initialTransaction ? `Edit ${fixedType}` : `Add ${fixedType}`}>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label
                        className="block text-sm font-medium mb-1 text-gray-700 cursor-pointer select-none"
                        htmlFor="name"
                    >
                        Name
                    </label>
                    <input
                        id="name"
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                                ${properties?.name?.errors?.length ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                    />
                    {properties?.name?.errors?.[0] && (
                        <p className="text-red-500 text-xs mt-1">{properties.name.errors[0]}</p>
                    )}
                </div>

                <div>
                    <label
                        className="block text-sm font-medium mb-1 text-gray-700 cursor-pointer select-none"
                        htmlFor="value"
                    >
                        Value (€)
                    </label>
                    <input
                        id="value"
                        type="text"
                        inputMode="decimal"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className={`w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
                                ${properties?.value?.errors?.length ? 'border-red-500 focus:ring-red-200' : 'border-gray-300'}`}
                    />
                    {properties?.value?.errors?.[0] && (
                        <p className="text-red-500 text-xs mt-1">{properties.value.errors[0]}</p>
                    )}
                </div>

                {fixedType === 'expense' && (
                    <div className="animate-fade-in">
                        <label className="block text-sm font-medium mb-2 text-gray-700 select-none">Category</label>
                        <div className="flex gap-2 flex-wrap">
                            <button
                                key="need"
                                type="button"
                                onClick={() => setExpenseCategory(expenseCategory === 'need' ? null : 'need')}
                                className={`px-3 py-1 rounded-full text-white text-sm cursor-pointer transition select-none bg-blue-500
                                            ${expenseCategory === 'need' ? 'opacity-100 ring-2 ring-offset-1 ring-gray-300' : 'opacity-40 hover:opacity-70'}
                                        `}
                            >
                                Need
                            </button>
                            <button
                                key="want"
                                type="button"
                                onClick={() => setExpenseCategory(expenseCategory === 'want' ? null : 'want')}
                                className={`px-3 py-1 rounded-full text-white text-sm cursor-pointer transition select-none bg-red-500
                                            ${expenseCategory === 'want' ? 'opacity-100 ring-2 ring-offset-1 ring-gray-300' : 'opacity-40 hover:opacity-70'}
                                        `}
                            >
                                Want
                            </button>
                            <button
                                key="investment"
                                type="button"
                                onClick={() =>
                                    setExpenseCategory(expenseCategory === 'investment' ? null : 'investment')
                                }
                                className={`px-3 py-1 rounded-full text-white text-sm cursor-pointer transition select-none bg-green-500
                                            ${expenseCategory === 'investment' ? 'opacity-100 ring-2 ring-offset-1 ring-gray-300' : 'opacity-40 hover:opacity-70'}
                                        `}
                            >
                                Investment
                            </button>
                        </div>

                        {properties && properties.expenseCategory?.errors?.[0] && (
                            <p className="text-red-500 text-xs mt-1">{properties.expenseCategory.errors[0]}</p>
                        )}
                    </div>
                )}

                {globalError && (
                    <div className="p-3 rounded bg-red-50 text-red-600 text-sm text-center border border-red-100">
                        {globalError}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full text-white font-semibold px-4 py-2 rounded text-sm disabled:opacity-50 cursor-pointer transition select-none bg-blue-600 hover:bg-blue-700
                        `}
                >
                    {isLoading ? 'Saving...' : initialTransaction ? 'Update' : 'Add'}
                </button>
            </form>
        </Modal>
    );
};

export default TransactionModal;
