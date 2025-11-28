import z from 'zod';

export const createSendVerificationEmailBodySchema = (
    allowedOrigins: string[],
) => {
    return z.object({
        frontendBaseUrl: z.url().refine((val) => allowedOrigins.includes(val)),
    });
};

export const verifyEmailBodySchema = z.object({
    jwt: z.jwt(),
});
