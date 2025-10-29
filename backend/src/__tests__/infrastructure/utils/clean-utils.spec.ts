import { ObjectId } from 'mongodb';
import { User } from '../../../domain/user/user-types';
import { removePasswordHash } from '../../../infrastructure/utils/clean-utils';

describe('clean utils', () => {
    describe('removePasswordHash', () => {
        it('should remove passwordHash', () => {
            const passwordHash = 'hashed-password';

            const user = {
                _id: new ObjectId(),
                passwordHash,
            } as unknown as User;

            const result = removePasswordHash(user);

            expect(result).not.toContain({ passwordHash });
        });
    });
});
