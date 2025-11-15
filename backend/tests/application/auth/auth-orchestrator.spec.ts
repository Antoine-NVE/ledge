import { ObjectId } from 'mongodb';
import { AuthOrchestrator } from '../../../src/application/auth/auth-orchestrator';
import { RefreshTokenService } from '../../../src/domain/refresh-token/refresh-token-service';
import { UserService } from '../../../src/domain/user/user-service';
import { User } from '../../../src/domain/user/user-types';
import { JwtService } from '../../../src/infrastructure/services/jwt-service';
import { PasswordService } from '../../../src/infrastructure/services/password-service';
import { TokenService } from '../../../src/infrastructure/services/token-service';
import { RefreshToken } from '../../../src/domain/refresh-token/refresh-token-types';
import { NotFoundError } from '../../../src/infrastructure/errors/not-found-error';
import { UnauthorizedError } from '../../../src/infrastructure/errors/unauthorized-error';
import { InternalServerError } from '../../../src/infrastructure/errors/internal-server-error';

describe('AuthOrchestrator', () => {
    const TEST_EMAIL = 'test@example.com';
    const TEST_PASSWORD = 'Azerty123!';
    const TEST_HASHED_PASSWORD = 'hashed-password';
    const TEST_TOKEN = 'token'; // Field of RefreshToken
    const TEST_NEW_TOKEN = 'new-token';
    const TEST_ACCESS_TOKEN = 'access-token'; // JWT

    let user: User;
    let refreshToken: RefreshToken;

    let userService: UserService;
    let jwtService: JwtService;
    let refreshTokenService: RefreshTokenService;
    let passwordService: PasswordService;
    let tokenService: TokenService;
    let authOrchestrator: AuthOrchestrator;

    beforeEach(() => {
        user = {
            _id: new ObjectId(),
            passwordHash: TEST_HASHED_PASSWORD,
        } as unknown as User;

        refreshToken = {
            userId: user._id,
        } as unknown as RefreshToken;

        userService = {
            register: jest.fn().mockResolvedValue(user),
            findOneByEmail: jest.fn().mockResolvedValue(user),
        } as unknown as UserService;

        jwtService = {
            signAccess: jest.fn().mockReturnValue(TEST_ACCESS_TOKEN),
        } as unknown as JwtService;

        refreshTokenService = {
            create: jest.fn().mockResolvedValue(refreshToken),
            findOneByToken: jest.fn().mockResolvedValue(refreshToken),
            extendExpiration: jest.fn().mockResolvedValue(refreshToken),
            deleteOneByToken: jest.fn().mockResolvedValue(refreshToken),
        } as unknown as RefreshTokenService;

        passwordService = {
            hash: jest.fn().mockResolvedValue(TEST_HASHED_PASSWORD),
            compare: jest.fn().mockReturnValue(true),
        } as unknown as PasswordService;

        tokenService = {
            generate: jest.fn().mockReturnValue(TEST_TOKEN),
        } as unknown as TokenService;

        authOrchestrator = new AuthOrchestrator(
            userService,
            jwtService,
            refreshTokenService,
            passwordService,
            tokenService,
        );
    });

    describe('register', () => {
        it('should call passwordService to hash', async () => {
            await authOrchestrator.register({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(passwordService.hash).toHaveBeenCalledWith(TEST_PASSWORD);
        });

        it('should call userService to register', async () => {
            await authOrchestrator.register({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(userService.register).toHaveBeenCalledWith({
                email: TEST_EMAIL,
                passwordHash: TEST_HASHED_PASSWORD,
            });
        });

        it('should call tokenService to generate', async () => {
            await authOrchestrator.register({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(tokenService.generate).toHaveBeenCalled();
        });

        it('should call refreshTokenService to create', async () => {
            await authOrchestrator.register({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(refreshTokenService.create).toHaveBeenCalledWith({
                token: TEST_TOKEN,
                userId: user._id,
            });
        });

        it('should call jwtService to signAccess', async () => {
            await authOrchestrator.register({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(jwtService.signAccess).toHaveBeenCalledWith(user._id);
        });

        it('should return user, accessToken and refreshToken', async () => {
            const result = await authOrchestrator.register({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(result).toEqual({
                user,
                accessToken: TEST_ACCESS_TOKEN,
                refreshToken,
            });
        });
    });

    describe('login', () => {
        it('should call userService to findOneByEmail', async () => {
            await authOrchestrator.login({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(userService.findOneByEmail).toHaveBeenCalledWith(TEST_EMAIL);
        });

        it('should throw an UnauthorizedError if user is not found', () => {
            (userService.findOneByEmail as jest.Mock).mockRejectedValue(
                new NotFoundError(),
            );

            expect(
                authOrchestrator.login({
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                }),
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should re-throw any other error', () => {
            (userService.findOneByEmail as jest.Mock).mockRejectedValue(
                new InternalServerError(),
            );

            expect(
                authOrchestrator.login({
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                }),
            ).rejects.toThrow(InternalServerError);
        });

        it('should call passwordService to compare', async () => {
            await authOrchestrator.login({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(passwordService.compare).toHaveBeenCalledWith(
                TEST_PASSWORD,
                user.passwordHash,
            );
        });

        it('should throw UnauthorizedError if passwords do not match', async () => {
            (passwordService.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                authOrchestrator.login({
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                }),
            ).rejects.toThrow(UnauthorizedError);
        });

        it('should call tokenService to generate', async () => {
            await authOrchestrator.login({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(tokenService.generate).toHaveBeenCalled();
        });

        it('should call refreshTokenService to create', async () => {
            await authOrchestrator.login({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(refreshTokenService.create).toHaveBeenCalledWith({
                token: TEST_TOKEN,
                userId: user._id,
            });
        });

        it('should call jwtService to signAccess', async () => {
            await authOrchestrator.login({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(jwtService.signAccess).toHaveBeenCalledWith(user._id);
        });

        it('should return user, accessToken and refreshToken', async () => {
            const result = await authOrchestrator.login({
                email: TEST_EMAIL,
                password: TEST_PASSWORD,
            });

            expect(result).toEqual({
                user,
                accessToken: TEST_ACCESS_TOKEN,
                refreshToken,
            });
        });
    });

    describe('refresh', () => {
        it('should call refreshTokenService to findOneByToken', async () => {
            await authOrchestrator.refresh(TEST_TOKEN);

            expect(refreshTokenService.findOneByToken).toHaveBeenCalledWith(
                TEST_TOKEN,
            );
        });

        it('should throw UnauthorizedError if refresh token is not found', () => {
            (refreshTokenService.findOneByToken as jest.Mock).mockRejectedValue(
                new NotFoundError(),
            );

            expect(authOrchestrator.refresh(TEST_TOKEN)).rejects.toThrow(
                UnauthorizedError,
            );
        });

        it('should re-throw any other error', () => {
            (refreshTokenService.findOneByToken as jest.Mock).mockRejectedValue(
                new InternalServerError(),
            );

            expect(authOrchestrator.refresh(TEST_TOKEN)).rejects.toThrow(
                InternalServerError,
            );
        });

        it('should throw UnauthorizedError if refresh token is expired', () => {
            (refreshTokenService.findOneByToken as jest.Mock).mockResolvedValue(
                {
                    ...refreshToken,
                    expiresAt: new Date(Date.now() - 1000),
                },
            );

            expect(authOrchestrator.refresh(TEST_TOKEN)).rejects.toThrow(
                UnauthorizedError,
            );
        });

        it('should call refreshTokenService to extendExpiration', async () => {
            (tokenService.generate as jest.Mock).mockReturnValue(
                TEST_NEW_TOKEN,
            );

            await authOrchestrator.refresh(TEST_TOKEN);

            expect(refreshTokenService.extendExpiration).toHaveBeenCalledWith(
                refreshToken,
                TEST_NEW_TOKEN,
            );
        });

        it('should call jwtService to signAccess', async () => {
            await authOrchestrator.refresh(TEST_TOKEN);

            expect(jwtService.signAccess).toHaveBeenCalledWith(
                refreshToken.userId,
            );
        });

        it('should return accessToken and refreshToken', async () => {
            const result = await authOrchestrator.refresh(TEST_TOKEN);

            expect(result).toEqual({
                accessToken: TEST_ACCESS_TOKEN,
                refreshToken,
            });
        });
    });

    describe('logout', () => {
        it('should call refreshTokenService to deleteOneByToken', async () => {
            await authOrchestrator.logout(TEST_TOKEN);

            expect(refreshTokenService.deleteOneByToken).toHaveBeenCalledWith(
                TEST_TOKEN,
            );
        });
    });
});
