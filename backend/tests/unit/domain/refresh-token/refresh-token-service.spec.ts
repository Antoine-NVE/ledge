import { RefreshToken } from '../../../../src/domain/refresh-token/refresh-token-types';
import { RefreshTokenRepository } from '../../../../src/domain/refresh-token/refresh-token-repository';
import { RefreshTokenService } from '../../../../src/domain/refresh-token/refresh-token-service';

describe('RefreshTokenService', () => {
    const USER_ID = 'USERID123';
    const REFRESH_TOKEN_ID = 'REFRESHTOKEN123';
    const TOKEN = 'token';
    const NEW_TOKEN = 'new-token';
    const TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    let refreshToken: Partial<RefreshToken>;

    let refreshTokenRepositoryMock: Partial<RefreshTokenRepository>;

    let refreshTokenService: RefreshTokenService;

    beforeEach(() => {
        refreshToken = { id: REFRESH_TOKEN_ID, userId: USER_ID, token: TOKEN };

        refreshTokenRepositoryMock = {
            create: jest.fn().mockResolvedValue(refreshToken),
            findByToken: jest.fn().mockResolvedValue(refreshToken),
            save: jest.fn(),
            deleteByToken: jest.fn().mockResolvedValue(refreshToken),
        };
        refreshTokenService = new RefreshTokenService(refreshTokenRepositoryMock as RefreshTokenRepository);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('create', () => {
        it('should call this.refreshTokenRepository.create', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            await refreshTokenService.create({
                userId: USER_ID,
                token: TOKEN,
            });

            expect(refreshTokenRepositoryMock.create).toHaveBeenCalledWith({
                userId: USER_ID,
                token: TOKEN,
                expiresAt: new Date(now.getTime() + TTL),
                createdAt: now,
            });
        });
    });

    describe('findByToken', () => {
        it('should call this.refreshTokenRepository.findByToken', async () => {
            await refreshTokenService.findByToken({ token: TOKEN });

            expect(refreshTokenRepositoryMock.findByToken).toHaveBeenCalledWith(TOKEN);
        });

        // it('should throw a NotFoundError if findOne return null', () => {
        //     (refreshTokenRepository.findOne as jest.Mock).mockResolvedValue(
        //         null,
        //     );
        //
        //     expect(
        //         refreshTokenService.findOneByToken(TEST_TOKEN),
        //     ).rejects.toThrow(NotFoundError);
        // });
    });

    describe('rotateToken', () => {
        it('should call this.refreshTokenRepository.save', async () => {
            const now = new Date();
            jest.useFakeTimers().setSystemTime(now);

            refreshToken = {
                ...refreshToken,
                expiresAt: new Date(now.getTime() + (TTL - 1000)),
                updatedAt: new Date(now.getTime() - 1000),
            };

            await refreshTokenService.rotateToken({
                refreshToken: refreshToken as RefreshToken,
                newToken: NEW_TOKEN,
            });

            expect(refreshTokenRepositoryMock.save).toHaveBeenCalledWith({
                id: REFRESH_TOKEN_ID,
                userId: USER_ID,
                token: NEW_TOKEN,
                expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
                updatedAt: new Date(now.getTime()),
            });
        });
    });

    describe('deleteByToken', () => {
        it('should call this.refreshTokenRepository.deleteByToken', async () => {
            await refreshTokenService.deleteByToken({ token: TOKEN });

            expect(refreshTokenRepositoryMock.deleteByToken).toHaveBeenCalledWith(TOKEN);
        });
    });
});
