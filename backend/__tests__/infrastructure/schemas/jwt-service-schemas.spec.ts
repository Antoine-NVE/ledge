import { verifySchema } from '../../../src/infrastructure/schemas/jwt-service-schemas';
import { ObjectId } from 'mongodb';

describe('JwtService schemas', () => {
    describe('verifySchema', () => {
        it('should not accept an invalid sub', () => {
            const { success } = verifySchema.safeParse({
                aud: '',
                sub: 'invalid',
                iat: 0,
                exp: 0,
            });

            expect(success).toBe(false);
        });

        it('should transform a valid sub into an ObjectId', () => {
            const objectId = new ObjectId();
            const stringObjectId = objectId.toString();

            const { success, data } = verifySchema.safeParse({
                aud: '',
                sub: stringObjectId,
                iat: 0,
                exp: 0,
            });

            expect(success).toBe(true);
            expect(data?.sub).toEqual(objectId);
        });
    });
});
