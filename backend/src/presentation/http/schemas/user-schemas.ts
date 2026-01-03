import z from 'zod';

export const requestEmailVerificationBodySchemaFactory = (allowedOrigins: string[]) => {
    return z.object({
        frontendBaseUrl: z.url().refine((val) => allowedOrigins.includes(val)),
    });
};

export const verifyEmailBodySchema = z.object({
    token: z.string(),
});
