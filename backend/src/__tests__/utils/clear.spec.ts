import { ObjectId } from 'mongodb';
import { User } from '../../types/User';
import { clearUser } from '../../utils/clear';

describe('clear utils', () => {
    describe('clearUser()', () => {
        it('should remove passwordHash from user object', () => {
            const user: User = {
                _id: new ObjectId(),
                email: 'test@example.com',
                passwordHash: 'hashed_password',
                isEmailVerified: true,
                emailVerificationCooldownExpiresAt: null,
                createdAt: new Date(),
                updatedAt: null,
            };

            const safeUser = clearUser(user);
            expect(safeUser).not.toHaveProperty('passwordHash');
        });
    });
});
