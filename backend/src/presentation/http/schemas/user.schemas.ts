import z from 'zod';

export const requestEmailVerificationSchema = (allowedOrigins: string[]) => {
    return z.object({
        body: z.object({
            frontendBaseUrl: z.url().refine((value) => allowedOrigins.includes(value)),
        }),
    });
};

export const verifyEmailSchema = () => {
    return z.object({
        body: z.object({
            token: z.string(),
        }),
    });
};
