import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../../repositories/RefreshTokenRepository';
import { RefreshTokenService } from '../../services/RefreshTokenService';
import { TokenService } from '../../services/TokenService';
import { RefreshToken } from '../../types/RefreshToken';
import { RefreshTokenNotFoundError } from '../../errors/NotFoundError';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_schema, data) => data),
}));

describe('RefreshTokenService', () => {
    let service: RefreshTokenService;
    let mockRepo: jest.Mocked<RefreshTokenRepository>;
    let mockTokenService: jest.Mocked<TokenService>;

    const fakeToken = 'mocked-refresh-token';
    const userId = new ObjectId();

    const fakeRefreshToken: RefreshToken = {
        _id: new ObjectId(),
        token: fakeToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        userId,
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockRepo = {
            insertOne: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        } as unknown as jest.Mocked<RefreshTokenRepository>;

        mockTokenService = {
            generate: jest.fn().mockReturnValue(fakeToken),
        } as unknown as jest.Mocked<TokenService>;

        service = new RefreshTokenService(mockRepo, mockTokenService);
    });

    describe('insertOne()', () => {
        it('should create and insert a new refresh token', async () => {
            const result = await service.insertOne(userId);

            expect(mockTokenService.generate).toHaveBeenCalledTimes(1);
            expect(mockRepo.insertOne).toHaveBeenCalledTimes(1);
            expect(mockRepo.insertOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: fakeToken,
                    userId,
                    expiresAt: expect.any(Date),
                    createdAt: expect.any(Date),
                }),
            );
            expect(result.token).toBe(fakeToken);
        });
    });

    describe('findOneByToken()', () => {
        it('should return the refresh token if found', async () => {
            (mockRepo.findOne as jest.Mock).mockResolvedValue(fakeRefreshToken);

            const result = await service.findOneByToken(fakeToken);

            expect(mockRepo.findOne).toHaveBeenCalledWith('token', fakeToken);
            expect(result).toBe(fakeRefreshToken);
        });

        it('should throw RefreshTokenNotFoundError if no token is found', async () => {
            (mockRepo.findOne as jest.Mock).mockResolvedValue(null);

            await expect(service.findOneByToken(fakeToken)).rejects.toThrow(
                RefreshTokenNotFoundError,
            );
        });
    });

    describe('updateOne()', () => {
        it('should update a refresh token and return the updated version', async () => {
            const updated = { ...fakeRefreshToken, updatedAt: null };

            const result = await service.updateOne(updated);

            expect(mockRepo.updateOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    _id: updated._id,
                    token: updated.token,
                    updatedAt: expect.any(Date),
                }),
            );
            expect(result.updatedAt).toBeInstanceOf(Date);
        });
    });

    describe('deleteOneByToken()', () => {
        it('should call repository.deleteOne with the correct token', async () => {
            await service.deleteOneByToken(fakeToken);

            expect(mockRepo.deleteOne).toHaveBeenCalledWith('token', fakeToken);
        });
    });
});
