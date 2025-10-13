import { ObjectId } from 'mongodb';
import z, { flattenError } from 'zod';
import { env } from '../config/env';
import { ValidationError } from '../errors/BadRequestError';
import { InvalidDataError } from '../errors/InternalServerError';

export const userSchema = z.strictObject({
    _id: z.custom<ObjectId>((val) => val instanceof ObjectId),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .toLowerCase()
        .email('Invalid email address'),
    passwordHash: z.string().regex(/^\$2b\$10\$[./A-Za-z0-9]{53}$/),
    isEmailVerified: z.boolean(),
    emailVerificationCooldownExpiresAt: z.date().nullable(),
    createdAt: z.date(),
    updatedAt: z.date().nullable(),
});

export const userRegisterSchema = userSchema
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
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export const userLoginSchema = userSchema
    .pick({
        email: true,
    })
    .extend({
        password: z.string().min(1, 'Password is required'),
        rememberMe: z.boolean(),
    });
