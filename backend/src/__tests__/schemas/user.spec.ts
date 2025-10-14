import { ObjectId } from 'mongodb';
import { User } from '../../types/User';
import {
    userLoginSchema,
    userRegisterSchema,
    userSchema,
} from '../../schemas/user';

describe('user schemas', () => {
    describe('userSchema', () => {
        const validUser: User = {
            _id: new ObjectId(),
            email: 'test@example.com',
            passwordHash:
                '$2b$10$/Fcv9vkV0sDEZgK06AGn9uh1alqOVSyScU4tuHF4YGNEHCBNI1xfy',
            isEmailVerified: true,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date(),
            updatedAt: null,
        };

        const invalidUser = {
            _id: 'not-an-objectid',
            email: 'not-an-email',
            passwordHash: 12345,
            isEmailVerified: 'not-a-boolean',
            emailVerificationCooldownExpiresAt: 'not-a-date',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
        };

        it('should validate a correct user object', () => {
            expect(() => {
                userSchema.parse(validUser);
            }).not.toThrow();
        });

        it('should throw an error for an incorrect user object', () => {
            expect(() => {
                userSchema.parse(invalidUser);
            }).toThrow();
        });

        it('should throw an error if there are unknown keys', () => {
            const validUserWithExtra = {
                ...validUser,
                extraKey: 'extra_value',
            };
            expect(() => {
                userSchema.parse(validUserWithExtra);
            }).toThrow();
        });
    });

    describe('userRegisterSchema', () => {
        const validRegisterData = {
            email: 'test@example.com',
            password: 'ValidPass1!',
            confirmPassword: 'ValidPass1!',
        };

        const invalidRegisterData = {
            email: 'not-an-email',
            password: 'short',
            confirmPassword: 'different',
        };

        it('should validate correct registration data', () => {
            expect(() => {
                userRegisterSchema.parse(validRegisterData);
            }).not.toThrow();
        });

        it('should throw an error for incorrect registration data', () => {
            expect(() => {
                userRegisterSchema.parse(invalidRegisterData);
            }).toThrow();
        });

        it('should throw an error if passwords do not match', () => {
            const mismatchedPasswords = {
                ...validRegisterData,
                confirmPassword: 'DifferentPass1!',
            };
            expect(() => {
                userRegisterSchema.parse(mismatchedPasswords);
            }).toThrow();
        });
    });

    describe('userLoginSchema', () => {
        const validLoginData = {
            email: 'test@example.com',
            password: 'ValidPass1!',
            rememberMe: true,
        };

        const invalidLoginData = {
            email: 'not-an-email',
            password: '',
            rememberMe: 'not-a-boolean',
        };

        it('should validate correct login data', () => {
            expect(() => {
                userLoginSchema.parse(validLoginData);
            }).not.toThrow();
        });

        it('should throw an error for incorrect login data', () => {
            expect(() => {
                userLoginSchema.parse(invalidLoginData);
            }).toThrow();
        });
    });
});
