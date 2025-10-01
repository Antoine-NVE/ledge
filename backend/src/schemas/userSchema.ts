import z from 'zod';

export const registerSchema = z
    .object({
        email: z.string().trim().toLowerCase().email('Invalid email address'),
        password: z
            .string()
            .regex(
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                'Password must be at least 8 characters, and include an uppercase letter, a lowercase letter, a number, and a special character',
            ),
        confirmPassword: z.string(),
    })
    .refine((schema) => schema.password === schema.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })
    .strict();

export const loginSchema = z
    .object({
        email: z.string().trim().toLowerCase().email('Invalid email address'),
        password: z.string(),
        rememberMe: z.boolean(),
    })
    .strict();
