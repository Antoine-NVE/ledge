import z from 'zod';
import type { IdGenerator } from '../../../application/ports/id-generator.js';

const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

const nameSchema = z.string().trim().min(1, 'Name is required').max(99, 'Name is too long');

const valueSchema = z
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

const expenseCategorySchema = z.enum(['need', 'want', 'investment']).nullable();

export const createSchema = z.object({
    body: z.discriminatedUnion('type', [
        z.object({
            month: monthSchema,
            name: nameSchema,
            value: valueSchema,
            type: z.literal('expense'),
            expenseCategory: expenseCategorySchema,
        }),
        z.object({
            month: monthSchema,
            name: nameSchema,
            value: valueSchema,
            type: z.literal('income'),
            expenseCategory: z.null(),
        }),
    ]),
});

export const readSchema = (idGenerator: IdGenerator) => {
    return z.object({
        params: z.object({
            transactionId: z.string().refine((value) => idGenerator.validate(value)),
        }),
    });
};

export const updateSchema = (idGenerator: IdGenerator) => {
    return z.object({
        body: z.discriminatedUnion('type', [
            z.object({
                name: nameSchema,
                value: valueSchema,
                type: z.literal('expense'),
                expenseCategory: expenseCategorySchema,
            }),
            z.object({
                name: nameSchema,
                value: valueSchema,
                type: z.literal('income'),
                expenseCategory: z.null(),
            }),
        ]),
        params: z.object({
            transactionId: z.string().refine((value) => idGenerator.validate(value)),
        }),
    });
};

export const deleteSchema = (idGenerator: IdGenerator) => {
    return z.object({
        params: z.object({
            transactionId: z.string().refine((value) => idGenerator.validate(value)),
        }),
    });
};
