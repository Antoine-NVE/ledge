import { ObjectId } from 'mongodb';
import { refreshTokenSchema } from '../../schemas/refresh-token';

describe('refresh token schemas', () => {
    describe('refreshTokenSchema', () => {
        const validData = {
            _id: new ObjectId(),
            token: 'a'.repeat(64),
            expiresAt: new Date(),
            userId: new ObjectId(),
            createdAt: new Date(),
            updatedAt: null,
        };

        const validDataWithExtraKey = {
            ...validData,
            extraKey: 'extra value',
        };

        it('should accept valid data', () => {
            const data = refreshTokenSchema.parse(validData);
            expect(data).toEqual(validData);
        });

        it('should refuse extra key', () => {
            expect(() =>
                refreshTokenSchema.parse(validDataWithExtraKey),
            ).toThrow();
        });
    });
});
