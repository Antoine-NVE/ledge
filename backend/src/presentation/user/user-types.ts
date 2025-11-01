import z from 'zod';
import {
    sendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';

export type SendVerificationEmailBody = z.infer<
    typeof sendVerificationEmailBodySchema
>;

export type VerifyEmailBody = z.infer<typeof verifyEmailBodySchema>;
