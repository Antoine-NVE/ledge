import { User } from '../../../../src/domain/user/user';
import { removePasswordHash } from '../../../../src/core/utils/clean';

describe('clean utils', () => {
    describe('removePasswordHash', () => {
        it('should remove passwordHash', () => {
            const USER_ID = 'USERID123';
            const PASSWORD_HASH = 'hashed-password';

            const user: Partial<User> = {
                id: USER_ID,
                passwordHash: PASSWORD_HASH,
            };

            const result = removePasswordHash(user as User);

            expect(result).toEqual({
                id: USER_ID,
            });
        });
    });
});
