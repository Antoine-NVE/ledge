import z from 'zod';
import { ObjectId } from 'mongodb';

export const transactionSchema = z
    .object({
        _id: z.custom<ObjectId>((val) => val instanceof ObjectId),
        month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
        name: z.string().trim().min(1, 'Name is required').max(99, 'Name is too long'),
        value: z
            .number()
            .min(0.01, 'Value is too short')
            .refine(
                (val) => Number.isInteger(val * 100),
                'Value must have at most 2 decimal places',
            )
            .max(999999999.99, 'Value is too big'),
        isIncome: z.boolean(),
        isRecurring: z.boolean(),
        userId: z.custom<ObjectId>((val) => val instanceof ObjectId),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
    })
    .strict();

export const transactionCreateInputSchema = transactionSchema.omit({
    _id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export const transactionUpdateInputSchema = transactionSchema.omit({
    _id: true,
    month: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
});

export const partialTransactionSchema = transactionSchema.partial();
