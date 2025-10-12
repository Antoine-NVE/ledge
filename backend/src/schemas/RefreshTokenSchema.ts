import z, { flattenError } from 'zod';
import { ObjectId } from 'mongodb';
import { InvalidDataError } from '../errors/InternalServerError';

export class RefreshTokenSchema {
    private base = z.strictObject({
        _id: z.custom<ObjectId>((val) => val instanceof ObjectId),
        token: z.string().length(64),
        expiresAt: z.date(),
        userId: z.custom<ObjectId>((val) => val instanceof ObjectId),
        createdAt: z.date(),
        updatedAt: z.date().nullable(),
    });

    parseBase = (data: unknown) => {
        const result = this.base.safeParse(data);
        if (!result.success) throw new InvalidDataError(flattenError(result.error));
        return result.data;
    };
}
