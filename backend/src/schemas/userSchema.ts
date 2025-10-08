import { ObjectId } from 'mongodb';
import z from 'zod';

export const userSchema = z
    .object({
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
    })
    .strict();

export const userDataSchema = userSchema.omit({
    _id: true,
});

export const partialUserDataSchema = userDataSchema.partial();

export const userBaseInputSchema = userDataSchema.omit({
    passwordHash: true,
    isEmailVerified: true,
    emailVerificationCooldownExpiresAt: true,
    createdAt: true,
    updatedAt: true,
});

export const userRegisterInputSchema = userBaseInputSchema
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

export const userLoginInputSchema = userBaseInputSchema.extend({
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean(),
});

export const userVerifyEmailInputSchema = z
    .object({
        token: z.string().min(1).jwt(),
    })
    .strict();

export const userSendEmailVerificationEmailInputSchema = z
    .object({
        frontendBaseUrl: z.string().url(),
    })
    .strict();

export const userOuputSchema = userSchema.omit({
    passwordHash: true,
});
