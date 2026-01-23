import z from 'zod';
import type { IdManager } from '../../domain/ports/id-manager.js';

const monthSchema = () => {
    return z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
};

const nameSchema = () => {
    return z.string().trim().min(1, 'Name is required').max(99, 'Name is too long');
};

const valueSchema = () => {
    return z
        .number()
        .min(0.01, 'Value is too short')
        .refine((val) => {
            // We cannot return Number.isInteger(val * 100)
            // It doesn't work with some values (ex.: 542.42) due to binary conversions
            const str = val.toString();
            const decimals = str.split('.')[1];
            return !decimals || decimals.length <= 2;
        }, 'Value must have at most 2 decimal places')
        .max(999999999.99, 'Value is too big');
};

const expenseCategorySchema = () => {
    return z.enum(['need', 'want', 'investment']).nullable();
};

export const createTransactionSchema = () => {
    return z.object({
        body: z.discriminatedUnion('type', [
            z.object({
                month: monthSchema(),
                name: nameSchema(),
                value: valueSchema(),
                type: z.literal('expense'),
                expenseCategory: expenseCategorySchema(),
            }),
            z.object({
                month: monthSchema(),
                name: nameSchema(),
                value: valueSchema(),
                type: z.literal('income'),
                expenseCategory: z.null(),
            }),
        ]),
    });
};

export const readTransactionSchema = (idManager: IdManager) => {
    return z.object({
        params: z.object({
            transactionId: z.string().refine((value) => idManager.validate(value)),
        }),
    });
};

export const updateTransactionSchema = (idManager: IdManager) => {
    return z.object({
        body: z.discriminatedUnion('type', [
            z.object({
                name: nameSchema(),
                value: valueSchema(),
                type: z.literal('expense'),
                expenseCategory: expenseCategorySchema(),
            }),
            z.object({
                name: nameSchema(),
                value: valueSchema(),
                type: z.literal('income'),
                expenseCategory: z.null(),
            }),
        ]),
        params: z.object({
            transactionId: z.string().refine((value) => idManager.validate(value)),
        }),
    });
};

export const deleteTransactionSchema = (idManager: IdManager) => {
    return z.object({
        params: z.object({
            transactionId: z.string().refine((value) => idManager.validate(value)),
        }),
    });
};
