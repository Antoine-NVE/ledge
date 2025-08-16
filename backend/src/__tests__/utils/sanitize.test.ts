import { removePassword } from '../../utils/sanitize';
import { UserDocument } from '../../models/User';

describe('removePassword', () => {
    it('should remove the password and return the rest of the fields', () => {
        const fakeUser: Partial<UserDocument> = {
            toObject: jest.fn().mockReturnValue({
                _id: 'abc123',
                email: 'jane.doe@example.com',
                name: 'Jane Doe',
                password: 'supersecret',
                createdAt: new Date('2025-01-01'),
                updatedAt: new Date('2025-01-02'),
            }) as UserDocument['toObject'],
        };

        const userDoc = fakeUser as UserDocument;

        const result = removePassword(userDoc);

        expect(fakeUser.toObject).toHaveBeenCalled();
        expect(result).toHaveProperty('_id', 'abc123');
        expect(result).toHaveProperty('email', 'jane.doe@example.com');
        expect(result).toHaveProperty('name', 'Jane Doe');
        expect(result).toHaveProperty('createdAt');
        expect(result).toHaveProperty('updatedAt');
        expect(result).not.toHaveProperty('password');
    });
});
