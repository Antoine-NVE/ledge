import z from 'zod';

export const transactionCreateSchema = z
    .object({
        month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
        isIncome: z.boolean(),
        isRecurring: z.boolean(),
        name: z.string().trim().min(1, 'Name is required').max(99, 'Name is too long'),
        value: z.number().min(0.01, 'Value is too small').max(999999999.99, 'Value is too big'),
    })
    .strict();

export const transactionUpdateSchema = z
    .object({
        isIncome: z.boolean(),
        isRecurring: z.boolean(),
        name: z.string().trim().min(1, 'Name is required').max(99, 'Name is too long'),
        value: z.number().min(0.01, 'Value is too small').max(999999999.99, 'Value is too big'),
    })
    .strict();
