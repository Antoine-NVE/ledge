import { ObjectId } from 'mongodb';
import {
    userLoginSchema,
    userRegisterSchema,
    userSchema,
} from '../../schemas/user-schemas';

describe('user schemas', () => {
    describe('userSchema', () => {
        const validData = {
            _id: new ObjectId(),
            email: 'alice@example.com',
            passwordHash:
                '$2b$10$/Fcv9vkV0sDEZgK06AGn9uh1alqOVSyScU4tuHF4YGNEHCBNI1xfy',
            isEmailVerified: false,
            emailVerificationCooldownExpiresAt: null,
            createdAt: new Date('2023-01-01T00:00:00.000Z'),
            updatedAt: null,
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = userSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() => userSchema.parse(validDataWithExtraKey)).toThrow();
        });
    });

    describe('userRegisterSchema', () => {
        const validData = {
            email: 'alice@example.com',
            password: 'Azerty123!',
            confirmPassword: 'Azerty123!',
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = userRegisterSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() =>
                userRegisterSchema.parse(validDataWithExtraKey),
            ).toThrow();
        });
    });

    describe('userLoginSchema', () => {
        const validData = {
            email: 'alice@example.com',
            password: 'Azerty123!',
            rememberMe: true,
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = userLoginSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() =>
                userLoginSchema.parse(validDataWithExtraKey),
            ).toThrow();
        });
    });
});
