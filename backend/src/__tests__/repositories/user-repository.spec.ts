import { Collection, ObjectId } from 'mongodb';
import { User } from '../../types/User';
import { UserRepository } from '../../repositories/UserRepository';

describe('UserRepository', () => {
    let mockCollection: Partial<Collection<User>>;
    let userRepository: UserRepository;

    const fakeUser: User = {
        _id: new ObjectId(),
        email: 'john@example.com',
        passwordHash: 'hashed-password',
        isEmailVerified: true,
        emailVerificationCooldownExpiresAt: null,
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockCollection = {
            insertOne: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
        };
        userRepository = new UserRepository(mockCollection as Collection<User>);
    });

    describe('insertOne()', () => {
        it('should call collection.insertOne with the provided user', async () => {
            await userRepository.insertOne(fakeUser);
            expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
            expect(mockCollection.insertOne).toHaveBeenCalledWith(fakeUser);
        });
    });

    describe('findOne()', () => {
        it('should call collection.findOne with the correct filter', async () => {
            (mockCollection.findOne as jest.Mock).mockResolvedValue(fakeUser);

            const result = await userRepository.findOne(
                'email',
                'john@example.com',
            );

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                email: 'john@example.com',
            });
            expect(result).toBe(fakeUser);
        });

        it('should return null when no user is found', async () => {
            (mockCollection.findOne as jest.Mock).mockResolvedValue(null);

            const result = await userRepository.findOne(
                'email',
                'unknown@example.com',
            );
            expect(result).toBeNull();
        });
    });

    describe('updateOne()', () => {
        it('should call collection.updateOne with the correct filter and update', async () => {
            await userRepository.updateOne(fakeUser);

            const { _id, ...rest } = fakeUser;
            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest },
            );
        });
    });
});
