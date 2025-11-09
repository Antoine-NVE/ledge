import { Collection, ObjectId } from 'mongodb';
import { User } from '../../../src/domain/user/user-types';
import { UserRepository } from '../../../src/domain/user/user-repository';

describe('UserRepository', () => {
    const TEST_OBJECT_ID = new ObjectId();

    let user: User;

    let userCollection: Collection<User>;
    let userRepository: UserRepository;

    beforeEach(() => {
        user = {
            _id: TEST_OBJECT_ID,
            email: 'test@example.com',
        } as unknown as User;

        userCollection = {
            insertOne: jest.fn(),
            findOne: jest.fn().mockResolvedValue(user),
            updateOne: jest.fn(),
        } as unknown as Collection<User>;

        userRepository = new UserRepository(userCollection);
    });

    describe('insertOne', () => {
        it('should call userCollection to insertOne', async () => {
            await userRepository.insertOne(user);

            expect(userCollection.insertOne).toHaveBeenCalledWith(user);
        });
    });

    describe('findOne', () => {
        it('should call userCollection to findOne', async () => {
            await userRepository.findOne('_id', TEST_OBJECT_ID);

            expect(userCollection.findOne).toHaveBeenCalledWith({
                ['_id']: TEST_OBJECT_ID,
            });
        });

        it('should return user', async () => {
            const result = await userRepository.findOne('_id', TEST_OBJECT_ID);

            expect(result).toEqual(user);
        });
    });

    describe('updateOne', () => {
        it('should call userRepository to updateOne', async () => {
            await userRepository.updateOne(user);

            const { _id, ...rest } = user;

            expect(userCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest },
            );
        });
    });
});
