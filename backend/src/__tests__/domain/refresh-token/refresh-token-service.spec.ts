import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../../../domain/refresh-token/refresh-token-repository';
import { RefreshTokenService } from '../../../domain/refresh-token/refresh-token-service';
import { RefreshToken } from '../../../domain/refresh-token/refresh-token-types';
import { NotFoundError } from '../../../infrastructure/errors/not-found-error';

describe('RefreshTokenService', () => {
    const TEST_TOKEN = 'token';
    const TEST_USER_ID = new ObjectId();

    let refreshToken: RefreshToken;

    let refreshTokenRepository: RefreshTokenRepository;
    let refreshTokenService: RefreshTokenService;

    beforeEach(() => {
        refreshToken = {} as unknown as RefreshToken;

        refreshTokenRepository = {
            insertOne: jest.fn(),
            findOne: jest.fn().mockResolvedValue(refreshToken),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
        } as unknown as RefreshTokenRepository;
        refreshTokenService = new RefreshTokenService(refreshTokenRepository);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('create', () => {
        it('should call refreshTokenRepository to insertOne', async () => {
            await refreshTokenService.create(TEST_TOKEN, TEST_USER_ID);

            expect(refreshTokenRepository.insertOne).toHaveBeenCalledWith(
                expect.objectContaining({
                    token: TEST_TOKEN,
                    userId: TEST_USER_ID,
                    updatedAt: null,
                }),
            );
        });

        it('should return refreshToken', async () => {
            const result = await refreshTokenService.create(
                TEST_TOKEN,
                TEST_USER_ID,
            );

            expect(result).toEqual(
                expect.objectContaining({
                    token: TEST_TOKEN,
                    userId: TEST_USER_ID,
                    updatedAt: null,
                }),
            );
        });
    });

    describe('findOneByToken', () => {
        it('should call refreshTokenRepository to findOne', async () => {
            await refreshTokenService.findOneByToken(TEST_TOKEN);

            expect(refreshTokenRepository.findOne).toHaveBeenCalledWith(
                'token',
                TEST_TOKEN,
            );
        });

        it('should throw a NotFoundError if findOne return null', () => {
            (refreshTokenRepository.findOne as jest.Mock).mockResolvedValue(
                null,
            );

            expect(
                refreshTokenService.findOneByToken(TEST_TOKEN),
            ).rejects.toThrow(NotFoundError);
        });

        it('should return refresh token', async () => {
            const result = await refreshTokenService.findOneByToken(TEST_TOKEN);

            expect(result).toEqual(refreshToken);
        });
    });

    describe('extendExpiration', () => {
        it('should update updatedAt and expiresAt', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            refreshToken = {
                ...refreshToken,
                expiresAt: new Date(now.getTime() - 1000),
                updatedAt: new Date(now.getTime() - 1000),
            };

            const result =
                await refreshTokenService.extendExpiration(refreshToken);

            expect(result).toMatchObject({
                expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now.getTime()),
            });
        });

        it('should call refreshTokenRepository to updateOne', async () => {
            await refreshTokenService.extendExpiration(refreshToken);

            expect(refreshTokenRepository.updateOne).toHaveBeenCalledWith(
                refreshToken,
            );
        });
    });

    describe('deleteOneByToken', () => {
        it('should call refreshTokenRepository to deleteOne', async () => {
            await refreshTokenService.deleteOneByToken(TEST_TOKEN);

            expect(refreshTokenRepository.deleteOne).toHaveBeenCalledWith(
                'token',
                TEST_TOKEN,
            );
        });
    });
});
