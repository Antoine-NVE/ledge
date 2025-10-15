import { AuthController } from '../../controllers/AuthController';
import { AuthService } from '../../services/AuthService';
import { UserService } from '../../services/UserService';
import { CookieService } from '../../services/CookieService';
import { RequiredRefreshTokenError } from '../../errors/UnauthorizedError';
import { parseSchema } from '../../utils/schema';
import { User } from '../../types/User';
import { ObjectId } from 'mongodb';

jest.mock('../../utils/schema', () => ({
    parseSchema: jest.fn((_, value) => value),
}));

jest.mock('../../schemas/user', () => ({
    userRegisterSchema: {},
    userLoginSchema: {},
}));

jest.mock('../../services/CookieService');

describe('AuthController', () => {
    let authService: jest.Mocked<AuthService>;
    let userService: jest.Mocked<UserService>;
    let controller: AuthController;
    let mockReq: any;
    let mockRes: any;

    beforeEach(() => {
        authService = {
            register: jest.fn(),
            login: jest.fn(),
            refresh: jest.fn(),
            logout: jest.fn(),
        } as any;

        userService = {
            removePasswordHash: jest.fn(),
        } as any;

        controller = new AuthController(authService, userService);

        mockReq = { body: {}, cookies: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (CookieService as jest.Mock).mockImplementation(() => ({
            setAuth: jest.fn(),
            clearAuth: jest.fn(),
            getRefreshToken: jest.fn(),
            getRememberMe: jest.fn(),
        }));
    });

    describe('register()', () => {
        it('should register a user and set cookies', async () => {
            const _id = new ObjectId();
            const createdAt = new Date();
            const updatedAt = new Date();

            const mockUser: User = {
                _id,
                email: 'test@example.com',
                passwordHash: 'hash',
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                createdAt,
                updatedAt,
            };
            const safeUser: Omit<User, 'passwordHash'> = {
                _id,
                email: 'test@example.com',
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                createdAt,
                updatedAt,
            };

            mockReq.body = { email: 'test@example.com', password: 'pass' };
            authService.register.mockResolvedValue({
                user: mockUser,
                accessToken: 'access',
                refreshToken: {
                    _id: new ObjectId(),
                    token: 'refresh',
                    userId: mockUser._id,
                    expiresAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            userService.removePasswordHash.mockReturnValue(safeUser);

            const mockSetAuth = jest.fn();
            (CookieService as jest.Mock).mockImplementation(() => ({
                setAuth: mockSetAuth,
            }));

            await controller.register(mockReq, mockRes);

            expect(authService.register).toHaveBeenCalledWith(
                'test@example.com',
                'pass',
            );
            expect(mockSetAuth).toHaveBeenCalledWith(
                'access',
                'refresh',
                false,
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User registered successfully',
                data: { user: safeUser },
            });
        });
    });

    describe('login()', () => {
        it('should login user and set cookies', async () => {
            const _id = new ObjectId();
            const createdAt = new Date();
            const updatedAt = new Date();

            const mockUser: User = {
                _id,
                email: 'test@example.com',
                passwordHash: 'hash',
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                createdAt,
                updatedAt,
            };

            const safeUser: Omit<User, 'passwordHash'> = {
                _id,
                email: 'test@example.com',
                isEmailVerified: false,
                emailVerificationCooldownExpiresAt: null,
                createdAt,
                updatedAt,
            };

            mockReq.body = {
                email: 'test@example.com',
                password: 'pass',
                rememberMe: true,
            };
            authService.login.mockResolvedValue({
                user: mockUser,
                accessToken: 'access',
                refreshToken: {
                    _id: new ObjectId(),
                    token: 'refresh',
                    userId: mockUser._id,
                    expiresAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            userService.removePasswordHash.mockReturnValue(safeUser);

            const mockSetAuth = jest.fn();
            (CookieService as jest.Mock).mockImplementation(() => ({
                setAuth: mockSetAuth,
            }));

            await controller.login(mockReq, mockRes);

            expect(authService.login).toHaveBeenCalledWith(
                'test@example.com',
                'pass',
            );
            expect(mockSetAuth).toHaveBeenCalledWith('access', 'refresh', true);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User logged in successfully',
                data: { user: safeUser },
            });
        });
    });

    describe('refresh()', () => {
        it('should throw if refresh token is missing', async () => {
            const mockGetRefreshToken = jest.fn().mockReturnValue(undefined);
            (CookieService as jest.Mock).mockImplementation(() => ({
                getRefreshToken: mockGetRefreshToken,
            }));

            await expect(controller.refresh(mockReq, mockRes)).rejects.toThrow(
                RequiredRefreshTokenError,
            );
        });

        it('should refresh tokens and set new cookies', async () => {
            const mockGetRefreshToken = jest
                .fn()
                .mockReturnValue('refresh-old');
            const mockGetRememberMe = jest.fn().mockReturnValue(true);
            const mockSetAuth = jest.fn();

            (CookieService as jest.Mock).mockImplementation(() => ({
                getRefreshToken: mockGetRefreshToken,
                getRememberMe: mockGetRememberMe,
                setAuth: mockSetAuth,
            }));

            authService.refresh.mockResolvedValue({
                accessToken: 'new-access',
                refreshToken: {
                    _id: new ObjectId(),
                    token: 'new-refresh',
                    userId: new ObjectId(),
                    expiresAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            await controller.refresh(mockReq, mockRes);

            expect(authService.refresh).toHaveBeenCalledWith('refresh-old');
            expect(mockSetAuth).toHaveBeenCalledWith(
                'new-access',
                'new-refresh',
                true,
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Tokens refreshed successfully',
            });
        });

        it('should default rememberMe to false if not set', async () => {
            const mockGetRefreshToken = jest
                .fn()
                .mockReturnValue('refresh-old');
            const mockGetRememberMe = jest.fn().mockReturnValue(undefined);
            const mockSetAuth = jest.fn();

            (CookieService as jest.Mock).mockImplementation(() => ({
                getRefreshToken: mockGetRefreshToken,
                getRememberMe: mockGetRememberMe,
                setAuth: mockSetAuth,
            }));

            authService.refresh.mockResolvedValue({
                accessToken: 'new-access',
                refreshToken: {
                    _id: new ObjectId(),
                    token: 'new-refresh',
                    userId: new ObjectId(),
                    expiresAt: new Date(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });

            await controller.refresh(mockReq, mockRes);

            expect(authService.refresh).toHaveBeenCalledWith('refresh-old');
            expect(mockSetAuth).toHaveBeenCalledWith(
                'new-access',
                'new-refresh',
                false,
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Tokens refreshed successfully',
            });
        });
    });

    describe('logout()', () => {
        it('should clear cookies and logout user if token exists', async () => {
            const mockGetRefreshToken = jest
                .fn()
                .mockReturnValue('refresh-old');
            const mockClearAuth = jest.fn();

            (CookieService as jest.Mock).mockImplementation(() => ({
                getRefreshToken: mockGetRefreshToken,
                clearAuth: mockClearAuth,
            }));

            await controller.logout(mockReq, mockRes);

            expect(authService.logout).toHaveBeenCalledWith('refresh-old');
            expect(mockClearAuth).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User logged out successfully',
            });
        });

        it('should clear cookies even if no token exists', async () => {
            const mockGetRefreshToken = jest.fn().mockReturnValue(undefined);
            const mockClearAuth = jest.fn();

            (CookieService as jest.Mock).mockImplementation(() => ({
                getRefreshToken: mockGetRefreshToken,
                clearAuth: mockClearAuth,
            }));

            await controller.logout(mockReq, mockRes);

            expect(authService.logout).not.toHaveBeenCalled();
            expect(mockClearAuth).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'User logged out successfully',
            });
        });
    });
});
