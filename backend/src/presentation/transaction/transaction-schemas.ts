import z from 'zod';

const name = z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(99, 'Name is too long');
const value = z
    .number()
    .min(0.01, 'Value is too short')
    .refine(
        (val) => Number.isInteger(val * 100),
        'Value must have at most 2 decimal places',
    )
    .max(999999999.99, 'Value is too big');
const isIncome = z.boolean();
const isRecurring = z.boolean();

export const createBodySchema = z.object({
    month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    name,
    value,
    isIncome,
    isRecurring,
});

export const updateBodySchema = z.object({
    name,
    value,
    isIncome,
    isRecurring,
});
