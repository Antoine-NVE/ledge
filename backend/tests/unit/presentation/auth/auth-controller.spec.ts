import { Request, Response } from 'express';
import { Logger } from 'pino';
import { CookieManager } from '../../../../src/presentation/http/support/cookie-manager';
import { AuthOrchestrator } from '../../../../src/application/auth/auth-orchestrator';
import { AuthController } from '../../../../src/presentation/http/auth/auth-controller';
import { User } from '../../../../src/domain/user/user-types';
import { RefreshToken } from '../../../../src/domain/refresh-token/refresh-token-types';
import * as cleanUtils from '../../../../src/core/utils/clean';

describe('AuthController', () => {
    const USER_ID = 'USERID123';
    const REFRESH_TOKEN_ID = 'REFRESHTOKENID123';
    const EMAIL = 'test@example.com';
    const PASSWORD = 'Azerty123!';
    const PASSWORD_HASH = 'pAsSwOrDhAsH';
    const ACCESS_TOKEN = 'access-token';
    const TOKEN = 'token';

    let user: Partial<User>;
    let cleanUser: Partial<Omit<User, 'passwordHash'>>;
    let refreshToken: Partial<RefreshToken>;

    let reqMock: Partial<Request>;
    let resMock: Partial<Response>;

    let cookieManagerMock: Partial<CookieManager>;
    let authOrchestratorMock: Partial<AuthOrchestrator>;
    let loggerMock: Partial<Logger>;

    let removePasswordHashSpy: jest.SpiedFunction<typeof cleanUtils.removePasswordHash>;

    let authController: AuthController;

    beforeEach(() => {
        user = {
            id: USER_ID,
            email: EMAIL,
            passwordHash: PASSWORD_HASH,
        };
        cleanUser = {
            id: USER_ID,
            email: EMAIL,
        };
        refreshToken = {
            id: REFRESH_TOKEN_ID,
            token: TOKEN,
        };

        reqMock = {};
        resMock = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        cookieManagerMock = {
            setAuth: jest.fn(),
            getRefreshToken: jest.fn().mockReturnValue(TOKEN),
            getRememberMe: jest.fn().mockReturnValue(true),
            clearAuth: jest.fn(),
        };
        authOrchestratorMock = {
            register: jest.fn().mockResolvedValue({
                user: user,
                accessToken: ACCESS_TOKEN,
                refreshToken: refreshToken,
            }),
            login: jest.fn().mockResolvedValue({
                user: user,
                accessToken: ACCESS_TOKEN,
                refreshToken: refreshToken,
            }),
            refresh: jest.fn().mockResolvedValue({
                accessToken: ACCESS_TOKEN,
                refreshToken: refreshToken,
            }),
            logout: jest.fn().mockReturnValue({
                catch: jest.fn(),
            }),
        };
        loggerMock = {
            info: jest.fn(),
        };

        removePasswordHashSpy = jest
            .spyOn(cleanUtils, 'removePasswordHash')
            .mockReturnValue(cleanUser as Omit<User, 'passwordHash'>);

        authController = new AuthController(
            authOrchestratorMock as AuthOrchestrator,
            loggerMock as Logger,
            cookieManagerMock as CookieManager,
        );
    });

    describe('register', () => {
        beforeEach(() => {
            reqMock.body = { email: EMAIL, password: PASSWORD };
        });

        it('should call this.authOrchestrator.register', async () => {
            await authController.register(reqMock as Request, resMock as Response);

            expect(authOrchestratorMock.register).toHaveBeenCalledWith({
                email: EMAIL,
                password: PASSWORD,
            });
        });

        it('should call this.cookieManager.setAuth', async () => {
            await authController.register(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.setAuth).toHaveBeenCalledWith(resMock, ACCESS_TOKEN, TOKEN, false);
        });

        it('should call res.status and res.json', async () => {
            await authController.register(reqMock as Request, resMock as Response);

            expect(removePasswordHashSpy).toHaveBeenCalledWith(user);
            expect(resMock.status).toHaveBeenCalledWith(201);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: {
                        id: USER_ID,
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

        it('should call this.authOrchestrator.login', async () => {
            await authController.login(reqMock as Request, resMock as Response);

            expect(authOrchestratorMock.login).toHaveBeenCalledWith({
                email: EMAIL,
                password: PASSWORD,
            });
        });

        it('should call this.cookieManager.setAuth', async () => {
            await authController.login(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.setAuth).toHaveBeenCalledWith(resMock, ACCESS_TOKEN, TOKEN, true);
        });

        it('should call res.status and res.json', async () => {
            await authController.login(reqMock as Request, resMock as Response);

            expect(removePasswordHashSpy).toHaveBeenCalledWith(user);
            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'User logged in successfully',
                data: {
                    user: {
                        id: USER_ID,
                        email: EMAIL,
                    },
                },
            });
        });
    });

    describe('refresh', () => {
        it('should call this.cookieManager.getRefreshToken', async () => {
            await authController.refresh(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.getRefreshToken).toHaveBeenCalledWith(reqMock);
        });

        it('should call this.cookieManager.getRememberMe', async () => {
            await authController.refresh(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.getRememberMe).toHaveBeenCalledWith(reqMock);
        });

        it('should call this.cookieManager.setAuth', async () => {
            await authController.refresh(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.setAuth).toHaveBeenCalledWith(resMock, ACCESS_TOKEN, TOKEN, true);
        });

        it('should call res.status and res.json', async () => {
            await authController.refresh(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'Tokens refreshed successfully',
            });
        });
    });

    describe('logout', () => {
        it('should call this.cookieManager.getRefreshToken', async () => {
            await authController.logout(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.getRefreshToken).toHaveBeenCalledWith(reqMock);
        });

        it('should call this.authOrchestrator.logout', async () => {
            await authController.logout(reqMock as Request, resMock as Response);

            expect(authOrchestratorMock.logout).toHaveBeenCalledWith({
                token: TOKEN,
            });
        });

        it('should call this.cookieManager.clearAuth', async () => {
            await authController.logout(reqMock as Request, resMock as Response);

            expect(cookieManagerMock.clearAuth).toHaveBeenCalledWith(resMock);
        });

        it('should call res.status and res.json', async () => {
            await authController.logout(reqMock as Request, resMock as Response);

            expect(resMock.status).toHaveBeenCalledWith(200);
            expect(resMock.json).toHaveBeenCalledWith({
                success: true,
                message: 'User logged out successfully',
            });
        });
    });
});
