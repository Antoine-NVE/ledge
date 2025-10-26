import { ObjectId } from 'mongodb';
import {
    allowedOriginSchema,
    jwtSchema,
    objectIdSchema,
} from '../../infrastructure/schemas/jwt-service-schemas';

jest.mock('../../config/env', () => ({
    env: {
        ALLOWED_ORIGINS: ['https://mocked.com'],
    },
}));

describe('security schemas', () => {
    describe('objectIdSchema', () => {
        it('should refuse invalid ObjectId', () => {
            expect(() => objectIdSchema.parse('hello123test')).toThrow();
        });

        it('should transform a valid string to ObjectId', () => {
            const stringObjectId = new ObjectId().toString();
            const data = objectIdSchema.parse(stringObjectId);

            expect(ObjectId.isValid(data)).toBe(true);
        });
    });

    describe('allowedOriginsSchema', () => {
        it('should accept allowed origin', () => {
            expect(() =>
                allowedOriginSchema.parse('https://mocked.com'),
            ).not.toThrow();
        });

        it('should refuse forbidden origin', () => {
            expect(() => {
                allowedOriginSchema.parse('https://google.com');
            }).toThrow();
        });
    });

    describe('jwtSchema', () => {
        it('should accept valid JWT', () => {
            expect(() =>
                jwtSchema.parse(
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30',
                ),
            ).not.toThrow();
        });
    });
});
