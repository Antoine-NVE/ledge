import z from 'zod';

const emailSchema = z.email('Invalid email address').toLowerCase();

export const registerSchema = z.object({
    body: z
        .object({
            email: emailSchema,
            password: z
                .string()
                .min(1, 'Password is required')
                .regex(/^\S.*\S$|^\S$/, 'Password cannot start or end with whitespace')
                .regex(
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                    'Password must be at least 8 characters, and include an uppercase letter, a lowercase letter, a number, and a special character',
                ),
            confirmPassword: z.string().min(1, 'Please confirm password'),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword'],
        }),
});

export const loginSchema = z.object({
    body: z.object({
        email: emailSchema,
        password: z.string().min(1, 'Password is required'),
        rememberMe: z.boolean(),
    }),
});
