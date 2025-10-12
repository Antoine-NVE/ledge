import { ObjectId } from 'mongodb';
import z, { flattenError } from 'zod';
import { InvalidDataError } from '../errors/InternalServerError';

export class SecuritySchema {
    private objectId = z
        .string()
        .refine((val) => ObjectId.isValid(val))
        .transform((val) => new ObjectId(val));

    private allowedOrigin = z
        .string()
        .url()
        .refine((val) => this.allowedOrigins.includes(val));

    private jwt = z.string().jwt();

    constructor(private allowedOrigins: string[]) {}

    parseObjectId = (data: unknown) => {
        const result = this.objectId.safeParse(data);
        if (!result.success) throw new InvalidDataError(flattenError(result.error));
        return result.data;
    };

    parseAllowedOrigin = (data: unknown) => {
        const result = this.allowedOrigin.safeParse(data);
        if (!result.success) throw new InvalidDataError(flattenError(result.error));
        return result.data;
    };

    parseJwt = (data: unknown) => {
        const result = this.jwt.safeParse(data);
        if (!result.success) throw new InvalidDataError(flattenError(result.error));
        return result.data;
    };
}
