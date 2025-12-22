import { User } from '../../../../src/domain/user/user-types';
import { RefreshToken } from '../../../../src/domain/refresh-token/refresh-token-types';
import { UserService } from '../../../../src/domain/user/user-service';
import { TokenManager } from '../../../../src/application/ports/token-manager';
import { RefreshTokenService } from '../../../../src/domain/refresh-token/refresh-token-service';
import { Hasher } from '../../../../src/application/ports/hasher';
import { AuthOrchestrator } from '../../../../src/application/auth/auth-orchestrator';
import * as tokenUtils from '../../../../src/core/utils/token';

describe('AuthOrchestrator', () => {
    const USER_ID = 'USERID123';
    const REFRESH_TOKEN_ID = 'REFRESHTOKENID123';
    const EMAIL = 'test@example.com';
    const PASSWORD = 'Azerty123!';
    const PASSWORD_HASH = 'pAsSwOrD-HaSh';
    const TOKEN = 'token';
    const NEW_TOKEN = 'new-token';
    const ACCESS_TOKEN = 'access-token';

    let user: Partial<User>;
    let refreshToken: Partial<RefreshToken>;

    let userServiceMock: Partial<UserService>;
    let tokenManagerMock: Partial<TokenManager>;
    let refreshTokenServiceMock: Partial<RefreshTokenService>;
    let hasherMock: Partial<Hasher>;

    let generateTokenSpy: jest.SpiedFunction<typeof tokenUtils.generateToken>;

    let authOrchestrator: AuthOrchestrator;

    beforeEach(() => {
        user = {
            id: USER_ID,
            passwordHash: PASSWORD_HASH,
        };
        refreshToken = {
            id: REFRESH_TOKEN_ID,
            userId: USER_ID,
        };

        userServiceMock = {
            register: jest.fn().mockResolvedValue(user),
            findByEmail: jest.fn().mockResolvedValue(user),
        };
        tokenManagerMock = {
            signAccess: jest.fn().mockReturnValue(ACCESS_TOKEN),
        };
        refreshTokenServiceMock = {
            create: jest.fn().mockResolvedValue(refreshToken),
            findByToken: jest.fn().mockResolvedValue(refreshToken),
            rotateToken: jest.fn().mockResolvedValue(refreshToken),
            deleteByToken: jest.fn().mockResolvedValue(refreshToken),
        };
        hasherMock = {
            hash: jest.fn().mockResolvedValue(PASSWORD_HASH),
            compare: jest.fn().mockReturnValue(true),
        };

        generateTokenSpy = jest.spyOn(tokenUtils, 'generateToken').mockReturnValue(TOKEN);

        authOrchestrator = new AuthOrchestrator(
            userServiceMock as UserService,
            tokenManagerMock as TokenManager,
            refreshTokenServiceMock as RefreshTokenService,
            hasherMock as Hasher,
        );
    });

    describe('register', () => {
        it('should call this.hasher.hash', async () => {
            await authOrchestrator.register({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(hasherMock.hash).toHaveBeenCalledWith(PASSWORD);
        });

        it('should call this.userService.register', async () => {
            await authOrchestrator.register({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(userServiceMock.register).toHaveBeenCalledWith({
                email: EMAIL,
                passwordHash: PASSWORD_HASH,
            });
        });

        it('should call this.refreshTokenService.create', async () => {
            await authOrchestrator.register({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(refreshTokenServiceMock.create).toHaveBeenCalledWith({
                userId: USER_ID,
                token: TOKEN,
            });
        });

        it('should call this.tokenManager.signAccess', async () => {
            await authOrchestrator.register({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(tokenManagerMock.signAccess).toHaveBeenCalledWith({
                userId: USER_ID,
            });
        });
    });

    describe('login', () => {
        it('should call this.userService.findByEmail', async () => {
            await authOrchestrator.login({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(userServiceMock.findByEmail).toHaveBeenCalledWith({
                email: EMAIL,
            });
        });

        // it('should throw an UnauthorizedError if user is not found', () => {
        //     (userService.findOneByEmail as jest.Mock).mockRejectedValue(
        //         new NotFoundError(),
        //     );
        //
        //     expect(
        //         authOrchestrator.login({
        //             email: TEST_EMAIL,
        //             password: TEST_PASSWORD,
        //         }),
        //     ).rejects.toThrow(UnauthorizedError);
        // });

        // it('should re-throw any other error', () => {
        //     (userService.findOneByEmail as jest.Mock).mockRejectedValue(
        //         new InternalServerError(),
        //     );
        //
        //     expect(
        //         authOrchestrator.login({
        //             email: TEST_EMAIL,
        //             password: TEST_PASSWORD,
        //         }),
        //     ).rejects.toThrow(InternalServerError);
        // });

        it('should call this.hasher.compare', async () => {
            await authOrchestrator.login({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(hasherMock.compare).toHaveBeenCalledWith(PASSWORD, PASSWORD_HASH);
        });

        // it('should throw UnauthorizedError if passwords do not match', async () => {
        //     (passwordService.compare as jest.Mock).mockResolvedValue(false);
        //
        //     await expect(
        //         authOrchestrator.login({
        //             email: TEST_EMAIL,
        //             password: TEST_PASSWORD,
        //         }),
        //     ).rejects.toThrow(UnauthorizedError);
        // });

        it('should call this.refreshTokenService.create', async () => {
            await authOrchestrator.login({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(refreshTokenServiceMock.create).toHaveBeenCalledWith({
                userId: USER_ID,
                token: TOKEN,
            });
        });

        it('should call this.tokenManager.signAccess', async () => {
            await authOrchestrator.login({
                email: EMAIL,
                password: PASSWORD,
            });

            expect(tokenManagerMock.signAccess).toHaveBeenCalledWith({
                userId: USER_ID,
            });
        });
    });

    describe('refresh', () => {
        it('should call this.refreshTokenService.findByToken', async () => {
            await authOrchestrator.refresh({ token: TOKEN });

            expect(refreshTokenServiceMock.findByToken).toHaveBeenCalledWith({
                token: TOKEN,
            });
        });

        // it('should throw UnauthorizedError if refresh token is not found', () => {
        //     (refreshTokenService.findOneByToken as jest.Mock).mockRejectedValue(
        //         new NotFoundError(),
        //     );
        //
        //     expect(authOrchestrator.refresh(TEST_TOKEN)).rejects.toThrow(
        //         UnauthorizedError,
        //     );
        // });

        // it('should re-throw any other error', () => {
        //     (refreshTokenService.findOneByToken as jest.Mock).mockRejectedValue(
        //         new InternalServerError(),
        //     );
        //
        //     expect(authOrchestrator.refresh(TEST_TOKEN)).rejects.toThrow(
        //         InternalServerError,
        //     );
        // });

        // it('should throw UnauthorizedError if refresh token is expired', () => {
        //     (refreshTokenService.findOneByToken as jest.Mock).mockResolvedValue(
        //         {
        //             ...refreshToken,
        //             expiresAt: new Date(Date.now() - 1000),
        //         },
        //     );
        //
        //     expect(authOrchestrator.refresh(TEST_TOKEN)).rejects.toThrow(
        //         UnauthorizedError,
        //     );
        // });

        it('should call this.refreshTokenService.rotateToken', async () => {
            generateTokenSpy.mockReturnValue(NEW_TOKEN);

            await authOrchestrator.refresh({ token: TOKEN });

            expect(refreshTokenServiceMock.rotateToken).toHaveBeenCalledWith({
                refreshToken,
                newToken: NEW_TOKEN,
            });
        });

        it('should call this.tokenManager.signAccess', async () => {
            await authOrchestrator.refresh({ token: TOKEN });

            expect(tokenManagerMock.signAccess).toHaveBeenCalledWith({
                userId: USER_ID,
            });
        });
    });

    describe('logout', () => {
        it('should call this.refreshTokenService.deleteByToken', async () => {
            await authOrchestrator.logout({ token: TOKEN });

            expect(refreshTokenServiceMock.deleteByToken).toHaveBeenCalledWith({
                token: TOKEN,
            });
        });
    });
});
