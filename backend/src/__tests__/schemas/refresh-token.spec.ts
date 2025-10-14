import { ObjectId } from 'mongodb';
import { RefreshToken } from '../../types/RefreshToken';
import { refreshTokenSchema } from '../../schemas/refresh-token';

describe('refresh token schemas', () => {
    describe('refreshTokenSchema', () => {
        const validRefreshToken: RefreshToken = {
            _id: new ObjectId(),
            token: 'a'.repeat(64),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60),
            userId: new ObjectId(),
            createdAt: new Date(),
            updatedAt: null,
        };

        const invalidRefreshToken = {
            _id: 'not-an-objectid',
            token: 'short',
            expiresAt: 'not-a-date',
            userId: 'not-an-objectid',
            createdAt: 'not-a-date',
            updatedAt: 'not-a-date',
        };

        it('should validate a correct refresh token object', () => {
            expect(() => {
                refreshTokenSchema.parse(validRefreshToken);
            }).not.toThrow();
        });

        it('should throw an error for an incorrect refresh token object', () => {
            expect(() => {
                refreshTokenSchema.parse(invalidRefreshToken);
            }).toThrow();
        });

        it('should throw an error if there are unknown keys', () => {
            const validRefreshTokenWithExtra = {
                ...validRefreshToken,
                extraKey: 'extra_value',
            };
            expect(() => {
                refreshTokenSchema.parse(validRefreshTokenWithExtra);
            }).toThrow();
        });
    });
});
