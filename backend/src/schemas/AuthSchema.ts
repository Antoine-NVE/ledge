import z from 'zod';
import { userSchema } from './UserSchema';

export const registerInputSchema = userSchema
    .pick({
        email: true,
    })
    .extend({
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
    .refine((schema) => schema.password === schema.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const loginInputSchema = userSchema
    .pick({
        email: true,
    })
    .extend({
        password: z.string().min(1, 'Password is required'),
        rememberMe: z.boolean(),
    });
