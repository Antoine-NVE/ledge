import { authorizeParamsSchema } from '../../../../../presentation/shared/middlewares/authorize/authorize-schemas';
import { ObjectId } from 'mongodb';

describe('authorize schemas', () => {
    describe('authorizeParamsSchema', () => {
        it('should refuse an invalid ObjectId', () => {
            const { success } = authorizeParamsSchema.safeParse({
                id: 'invalidId',
            });

            expect(success).toBe(false);
        });

        it('should accept a valid ObjectId', () => {
            const { success } = authorizeParamsSchema.safeParse({
                id: new ObjectId().toString(),
            });

            expect(success).toBe(true);
        });
    });
});
