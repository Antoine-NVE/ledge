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

const incomeTypeSchema = z.literal('income');

const expenseTypeSchema = z.literal('expense');

const expenseCategorySchema = z.enum(['need', 'want', 'investment']).nullable();

const createIncomeSchema = z.object({
    month: monthSchema,
    name: nameSchema,
    value: valueSchema,
    type: incomeTypeSchema,
    expenseCategory: z.null(),
});

const createExpenseSchema = z.object({
    month: monthSchema,
    name: nameSchema,
    value: valueSchema,
    type: expenseTypeSchema,
    expenseCategory: expenseCategorySchema,
});

const updateIncomeSchema = z.object({
    name: nameSchema,
    value: valueSchema,
    type: incomeTypeSchema,
    expenseCategory: z.null(),
});

const updateExpenseSchema = z.object({
    name: nameSchema,
    value: valueSchema,
    type: expenseTypeSchema,
    expenseCategory: expenseCategorySchema,
});

export const createBodySchema = z.discriminatedUnion('type', [createIncomeSchema, createExpenseSchema]);

export const readParamsSchemaFactory = (idGenerator: IdGenerator) => {
    return z.object({
        transactionId: z.string().refine((value) => idGenerator.validate(value)),
    });
};

export const updateParamsSchemaFactory = (idGenerator: IdGenerator) => {
    return z.object({
        transactionId: z.string().refine((value) => idGenerator.validate(value)),
    });
};

export const updateBodySchema = z.discriminatedUnion('type', [updateIncomeSchema, updateExpenseSchema]);

export const deleteParamsSchemaFactory = (idGenerator: IdGenerator) => {
    return z.object({
        transactionId: z.string().refine((value) => idGenerator.validate(value)),
    });
};
