import { ObjectId } from 'mongodb';
import z from 'zod';

export class SecuritySchema {
    constructor(private allowedOrigins: string[]) {}

    authenticate = z
        .object({
            userId: z
                .string()
                .refine((val) => ObjectId.isValid(val))
                .transform((val) => new ObjectId(val)),
        })
        .strict();

    authorize = z
        .object({
            transactionId: z
                .string()
                .refine((val) => ObjectId.isValid(val))
                .transform((val) => new ObjectId(val)),
        })
        .strict();

    sendVerificationEmail = z
        .object({
            frontendBaseUrl: z
                .string()
                .url()
                .refine((val) => this.allowedOrigins.includes(val)),
        })
        .strict();

    verifyEmail = z
        .object({
            jwt: z.string().jwt(),
        })
        .strict();
}
