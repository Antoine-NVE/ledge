import z from 'zod';
import {
    createSendVerificationEmailBodySchema,
    verifyEmailBodySchema,
} from './user-schemas';

export type SendVerificationEmailBody = z.infer<
    ReturnType<typeof createSendVerificationEmailBodySchema>
>;

export type VerifyEmailBody = z.infer<typeof verifyEmailBodySchema>;
