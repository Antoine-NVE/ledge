import { Collection, ObjectId } from 'mongodb';
import { RefreshToken } from '../../../src/domain/refresh-token/refresh-token-types';
import { RefreshTokenRepository } from '../../../src/domain/refresh-token/refresh-token-repository';

describe('RefreshTokenRepository', () => {
    const TEST_OBJECT_ID = new ObjectId();
    const TEST_TOKEN = 'token';

    let refreshToken: RefreshToken;

    let refreshTokenCollection: Collection<RefreshToken>;
    let refreshTokenRepository: RefreshTokenRepository;

    beforeEach(() => {
        refreshToken = {} as unknown as RefreshToken;

        refreshTokenCollection = {
            insertOne: jest.fn(),
            findOne: jest.fn().mockResolvedValue(refreshToken),
            updateOne: jest.fn(),
            findOneAndDelete: jest.fn(),
        } as unknown as Collection<RefreshToken>;

        refreshTokenRepository = new RefreshTokenRepository(
            refreshTokenCollection,
        );
    });

    describe('insertOne', () => {
        it('should call refreshTokenCollection to insertOne', async () => {
            await refreshTokenRepository.insertOne(refreshToken);

            expect(refreshTokenCollection.insertOne).toHaveBeenCalledWith(
                refreshToken,
            );
        });
    });

    describe('findOne', () => {
        it('should call refreshTokenCollection to findOne', async () => {
            await refreshTokenRepository.findOne('_id', TEST_OBJECT_ID);

            expect(refreshTokenCollection.findOne).toHaveBeenCalledWith({
                ['_id']: TEST_OBJECT_ID,
            });

            await refreshTokenRepository.findOne('token', TEST_TOKEN);

            expect(refreshTokenCollection.findOne).toHaveBeenCalledWith({
                ['token']: TEST_TOKEN,
            });
        });

        it('should return refresh token', async () => {
            const result = await refreshTokenRepository.findOne(
                '_id',
                TEST_OBJECT_ID,
            );

            expect(result).toEqual(refreshToken);
        });
    });

    describe('updateOne', () => {
        it('should call refreshTokenCollection to updateOne', async () => {
            await refreshTokenRepository.updateOne(refreshToken);

            const { _id, ...rest } = refreshToken;

            expect(refreshTokenCollection.updateOne).toHaveBeenCalledWith(
                { _id },
                { $set: rest },
            );
        });
    });

    describe('deleteOne', () => {
        it('should call refreshTokenCollection to deleteOne', async () => {
            await refreshTokenRepository.findOneAndDelete(
                '_id',
                TEST_OBJECT_ID,
            );

            expect(
                refreshTokenCollection.findOneAndDelete,
            ).toHaveBeenCalledWith({
                ['_id']: TEST_OBJECT_ID,
            });

            await refreshTokenRepository.findOneAndDelete('token', TEST_TOKEN);

            expect(
                refreshTokenCollection.findOneAndDelete,
            ).toHaveBeenCalledWith({
                ['token']: TEST_TOKEN,
            });
        });
    });
});
