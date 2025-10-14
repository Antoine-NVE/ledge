import { ObjectId } from 'mongodb';
import {
    allowedOriginSchema,
    jwtSchema,
    objectIdSchema,
} from '../../schemas/security';

jest.mock('../../config/env', () => ({
    env: {
        ALLOWED_ORIGINS: [
            'http://localhost:3000',
            'https://example.com',
            'http://subdomain.example.com',
        ],
    },
}));

describe('security schemas', () => {
    describe('objectIdSchema', () => {
        it('should validate a correct ObjectId string', () => {
            const validId = new ObjectId().toHexString();
            expect(() => {
                const result = objectIdSchema.parse(validId);
                expect(result).toBeInstanceOf(ObjectId);
                expect(result.toHexString()).toBe(validId);
            }).not.toThrow();
        });

        it('should throw an error for an incorrect ObjectId string', () => {
            const invalidId = 'not-a-valid-objectid';
            expect(() => {
                objectIdSchema.parse(invalidId);
            }).toThrow();
        });
    });

    describe('allowedOriginsSchema', () => {
        it('should validate a correct allowed origin URL', () => {
            const validUrl = 'http://localhost:3000';
            expect(() => {
                const result = allowedOriginSchema.parse(validUrl);
                expect(result).toBe(validUrl);
            }).not.toThrow();
        });

        it('should throw an error for a URL not in the allowed origins list', () => {
            const invalidUrl = 'http://notallowed.com';
            expect(() => {
                allowedOriginSchema.parse(invalidUrl);
            }).toThrow();
        });

        it('should throw an error for an invalid URL format', () => {
            const invalidFormat = 'not-a-url';
            expect(() => {
                allowedOriginSchema.parse(invalidFormat);
            }).toThrow();
        });
    });

    describe('jwtSchema', () => {
        it('should validate a correct JWT string', () => {
            const validJwt =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MWE2YzA0YzA0YzA0YzA0YzA0YzA0YzAiLCJpYXQiOjE2MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
            expect(() => {
                const result = jwtSchema.parse(validJwt);
                expect(result).toBe(validJwt);
            }).not.toThrow();
        });

        it('should throw an error for an incorrect JWT string', () => {
            const invalidJwt = 'not-a-valid-jwt';
            expect(() => {
                jwtSchema.parse(invalidJwt);
            }).toThrow();
        });
    });
});
