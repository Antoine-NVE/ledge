import z, { flattenError } from 'zod';
import { ObjectId } from 'mongodb';
import { ValidationError } from '../errors/BadRequestError';
import { InvalidDataError } from '../errors/InternalServerError';

export class TransactionSchema {
    private base = z.strictObject({
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
    });

    private create = this.base.pick({
        month: true,
        name: true,
        value: true,
        isIncome: true,
        isRecurring: true,
    });

    private update = this.base.pick({
        name: true,
        value: true,
        isIncome: true,
        isRecurring: true,
    });

    parseBase = (data: object) => {
        const result = this.base.safeParse(data);
        if (!result.success) throw new InvalidDataError(flattenError(result.error));
        return result.data;
    };

    parseCreate = (data: object) => {
        const result = this.create.safeParse(data);
        if (!result.success) throw new ValidationError(flattenError(result.error));
        return result.data;
    };

    parseUpdate = (data: object) => {
        const result = this.update.safeParse(data);
        if (!result.success) throw new ValidationError(flattenError(result.error));
        return result.data;
    };
}
