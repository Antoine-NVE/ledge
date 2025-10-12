import { ObjectId } from 'mongodb';
import z from 'zod';

export class SecuritySchema {
    constructor(private allowedOrigins: string[]) {}

    objectId = z
        .string()
        .refine((val) => ObjectId.isValid(val))
        .transform((val) => new ObjectId(val));

    allowedOrigin = z
        .string()
        .url()
        .refine((val) => this.allowedOrigins.includes(val));

    jwt = z.string().jwt();
}
