import { Collection, ObjectId } from 'mongodb';
import { RefreshToken } from '../../types/RefreshToken';
import { RefreshTokenRepository } from '../../repositories/RefreshTokenRepository';

describe('RefreshTokenRepository', () => {
    let mockCollection: Partial<Collection<RefreshToken>>;
    let refreshTokenRepository: RefreshTokenRepository;

    const fakeToken: RefreshToken = {
        _id: new ObjectId(),
        token: 'abc123',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        userId: new ObjectId(),
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockCollection = {
            insertOne: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        };
        refreshTokenRepository = new RefreshTokenRepository(
            mockCollection as Collection<RefreshToken>,
        );
    });

    describe('insertOne()', () => {
        it('should call collection.insertOne with the provided refresh token', async () => {
            await refreshTokenRepository.insertOne(fakeToken);

            expect(mockCollection.insertOne).toHaveBeenCalledTimes(1);
            expect(mockCollection.insertOne).toHaveBeenCalledWith(fakeToken);
        });
    });

    describe('findOne()', () => {
        it('should call collection.findOne with the correct filter and return a refresh token', async () => {
            (mockCollection.findOne as jest.Mock).mockResolvedValue(fakeToken);

            const result = await refreshTokenRepository.findOne(
                'token',
                'abc123',
            );

            expect(mockCollection.findOne).toHaveBeenCalledWith({
                token: 'abc123',
            });
            expect(result).toBe(fakeToken);
        });

        it('should return null when no token is found', async () => {
            (mockCollection.findOne as jest.Mock).mockResolvedValue(null);

            const result = await refreshTokenRepository.findOne(
                'token',
                'not-found',
            );
            expect(result).toBeNull();
        });
    });

    describe('updateOne()', () => {
        it('should call collection.updateOne with the correct filter and update object', async () => {
            await refreshTokenRepository.updateOne(fakeToken);

            const { _id, ...rest } = fakeToken;
            expect(mockCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest },
            );
        });
    });

    describe('deleteOne()', () => {
        it('should call collection.deleteOne with the correct filter', async () => {
            await refreshTokenRepository.deleteOne('token', fakeToken.token);

            expect(mockCollection.deleteOne).toHaveBeenCalledWith({
                token: fakeToken.token,
            });
        });
    });
});
