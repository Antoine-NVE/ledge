import { Request, Response } from 'express';
import { RefreshToken } from '../../../src/domain/refresh-token/refresh-token-types';
import { CookieService } from '../../../src/infrastructure/services/cookie-service';
import { AuthOrchestrator } from '../../../src/application/auth/auth-orchestrator';
import { AuthController } from '../../../src/presentation/auth/auth-controller';
import { User } from '../../../src/domain/user/user-types';
import { removePasswordHash } from '../../../src/infrastructure/utils/clean-utils';
import { UnauthorizedError } from '../../../src/infrastructure/errors/unauthorized-error';
import { Logger } from 'pino';

jest.mock('../../../src/infrastructure/services/cookie-service');
jest.mock('../../../src/infrastructure/utils/clean-utils');

describe('AuthController', () => {
    const EMAIL = 'test@example.com';
    const PASSWORD = 'Azerty123!';
    const PASSWORD_HASH = '123abc';
    const ACCESS_TOKEN = 'json.web.token';
    const TOKEN = 'abc123';

    let reqMock: Partial<Request>;
    let resMock: Partial<Response>;
    let userMock: Partial<User>;
    let refreshTokenMock: Partial<RefreshToken>;

    let removePasswordHashMock: jest.Mock;
    let cookieServiceMock: Partial<CookieService>;
    let authOrchestratorMock: Partial<AuthOrchestrator>;
    let loggerMock: Partial<Logger>;
    let authController: AuthController;

    beforeEach(() => {
        reqMock = {};
        resMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        userMock = {
            email: EMAIL,
            passwordHash: PASSWORD_HASH,
        };
        refreshTokenMock = {
            token: TOKEN,
        };

        cookieServiceMock = {
            setAuth: jest.fn(),
            getRefreshToken: jest.fn().mockReturnValue(TOKEN),
            getRememberMe: jest.fn().mockReturnValue(true),
            clearAuth: jest.fn(),
        };
        (CookieService as jest.Mock).mockImplementation(
            () => cookieServiceMock,
        );

        removePasswordHashMock = removePasswordHash as jest.Mock;
        removePasswordHashMock.mockReturnValue({
            email: EMAIL,
        });

        authOrchestratorMock = {
            register: jest.fn().mockResolvedValue({
                user: userMock,
                accessToken: ACCESS_TOKEN,
                refreshToken: refreshTokenMock,
            }),
            login: jest.fn().mockResolvedValue({
                user: userMock,
                accessToken: ACCESS_TOKEN,
                refreshToken: refreshTokenMock,
            }),
            refresh: jest.fn().mockResolvedValue({
                accessToken: ACCESS_TOKEN,
                refreshToken: refreshTokenMock,
            }),
            logout: jest.fn().mockReturnValue({
                catch: jest.fn(),
            }),
        };
        loggerMock = {
            info: jest.fn(),
        };
        authController = new AuthController(
            authOrchestratorMock as AuthOrchestrator,
            loggerMock as Logger,
        );
    });

    describe('register', () => {
        beforeEach(() => {
            reqMock.body = { email: EMAIL, password: PASSWORD };
        });

        it('should call authOrchestrator.register with valid parameters', async () => {
            await authController.register(
                reqMock as Request,
                resMock as Response,
            );

            expect(authOrchestratorMock.register).toHaveBeenCalledWith({
                email: EMAIL,
                password: PASSWORD,
            });
        });

        it('should call cookieService.setAuth with valid parameters', async () => {
            await authController.register(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.setAuth).toHaveBeenCalledWith(
                ACCESS_TOKEN,
                TOKEN,
                false,
            );
        });

        it('should call res.status().json() with valid parameters', async () => {
            await authController.register(
                reqMock as Request,
                resMock as Response,
            );

            expect(removePasswordHashMock).toHaveBeenLastCalledWith(userMock);
            expect(resMock.status).toHaveBeenCalledWith(201);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                data: {
                    user: {
                        email: EMAIL,
                    },
                },
            });
        });
    });

    describe('login', () => {
        beforeEach(() => {
            reqMock.body = {
                email: EMAIL,
                password: PASSWORD,
                rememberMe: true,
            };
        });

        it('should call authOrchestrator.login with valid parameters', async () => {
            await authController.login(reqMock as Request, resMock as Response);

            expect(authOrchestratorMock.login).toHaveBeenCalledWith({
                email: EMAIL,
                password: PASSWORD,
            });
        });

        it('should call cookieService.setAuth with valid paramaters', async () => {
            await authController.login(reqMock as Request, resMock as Response);

            expect(cookieServiceMock.setAuth).toHaveBeenCalledWith(
                ACCESS_TOKEN,
                TOKEN,
                true,
            );

            reqMock.body.rememberMe = false;

            await authController.login(reqMock as Request, resMock as Response);

            expect(cookieServiceMock.setAuth).toHaveBeenCalledWith(
                ACCESS_TOKEN,
                TOKEN,
                false,
            );
        });

        it('should call res.status().json() with valid parameters', async () => {
            await authController.login(reqMock as Request, resMock as Response);

            expect(removePasswordHashMock).toHaveBeenLastCalledWith(userMock);
            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'User logged in successfully',
                data: {
                    user: {
                        email: EMAIL,
                    },
                },
            });
        });
    });

    describe('refresh', () => {
        it('should call cookieService.getRefreshToken and throw if !token', async () => {
            await authController.refresh(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.getRefreshToken).toHaveBeenCalled();

            (cookieServiceMock.getRefreshToken as jest.Mock).mockReturnValue(
                undefined,
            );

            await expect(
                authController.refresh(reqMock as Request, resMock as Response),
            ).rejects.toThrow(new UnauthorizedError('Required refresh token'));
        });

        it('should call cookieService.getRememberMe', async () => {
            await authController.refresh(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.getRememberMe).toHaveBeenCalled();
        });

        it('should call cookieService.setAuth with valid parameters', async () => {
            await authController.refresh(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.setAuth).toHaveBeenCalledWith(
                ACCESS_TOKEN,
                TOKEN,
                true,
            );
        });

        it('should call res.status().json() with valid parameters', async () => {
            await authController.refresh(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'Tokens refreshed successfully',
            });
        });
    });

    describe('logout', () => {
        it('should call cookieService.getRefreshToken and call authOrchestrator.logout if token', async () => {
            // Part one
            await authController.logout(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.getRefreshToken).toHaveBeenCalled();
            expect(authOrchestratorMock.logout).toHaveBeenCalledWith(TOKEN);

            (authOrchestratorMock.logout as jest.Mock).mockClear();

            // Part two
            (cookieServiceMock.getRefreshToken as jest.Mock).mockReturnValue(
                undefined,
            );

            await authController.logout(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.getRefreshToken).toHaveBeenCalled();
            expect(authOrchestratorMock.logout).not.toHaveBeenCalled();
        });

        it('should call cookieService.clearAuth', async () => {
            await authController.logout(
                reqMock as Request,
                resMock as Response,
            );

            expect(cookieServiceMock.clearAuth).toHaveBeenCalled();
        });

        it('should call res.status().json() with valid parameters', async () => {
            await authController.logout(
                reqMock as Request,
                resMock as Response,
            );

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                message: 'User logged out successfully',
            });
        });
    });
});
