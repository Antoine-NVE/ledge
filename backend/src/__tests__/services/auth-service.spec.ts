import { ObjectId } from 'mongodb';
import { AuthService } from '../../services/AuthService';
import { JwtService } from '../../services/JwtService';
import { PasswordService } from '../../services/PasswordService';
import { RefreshTokenService } from '../../services/RefreshTokenService';
import { UserService } from '../../services/UserService';
import { User } from '../../types/User';
import { RefreshToken } from '../../types/RefreshToken';
import {
    RefreshTokenNotFoundError,
    UserNotFoundError,
} from '../../errors/NotFoundError';
import {
    ExpiredRefreshTokenError,
    InvalidCredentialsError,
    InvalidRefreshTokenError,
} from '../../errors/UnauthorizedError';

describe('AuthService', () => {
    let service: AuthService;
    let mockUserService: jest.Mocked<UserService>;
    let mockJwtService: jest.Mocked<JwtService>;
    let mockRefreshTokenService: jest.Mocked<RefreshTokenService>;
    let mockPasswordService: jest.Mocked<PasswordService>;

    const userId = new ObjectId();
    const mockUser: User = {
        _id: userId,
        email: 'john@example.com',
        passwordHash: 'hashed_password',
        isEmailVerified: true,
        emailVerificationCooldownExpiresAt: null,
        createdAt: new Date(),
        updatedAt: null,
    };

    const mockRefreshToken: RefreshToken = {
        _id: new ObjectId(),
        token: 'refresh123',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60),
        userId,
        createdAt: new Date(),
        updatedAt: null,
    };

    beforeEach(() => {
        mockUserService = {
            insertOne: jest.fn().mockResolvedValue(mockUser),
            findOneByEmail: jest.fn().mockResolvedValue(mockUser),
        } as unknown as jest.Mocked<UserService>;

        mockJwtService = {
            signAccess: jest.fn().mockReturnValue('access123'),
        } as unknown as jest.Mocked<JwtService>;

        mockRefreshTokenService = {
            insertOne: jest.fn().mockResolvedValue(mockRefreshToken),
            findOneByToken: jest.fn().mockResolvedValue(mockRefreshToken),
            updateOne: jest.fn().mockResolvedValue(mockRefreshToken),
            deleteOneByToken: jest.fn().mockResolvedValue(mockRefreshToken),
            TTL: 7 * 24 * 60 * 60 * 1000,
        } as unknown as jest.Mocked<RefreshTokenService>;

        mockPasswordService = {
            hash: jest.fn().mockResolvedValue('hashed_password'),
            compare: jest.fn().mockResolvedValue(true),
        } as unknown as jest.Mocked<PasswordService>;

        service = new AuthService(
            mockUserService,
            mockJwtService,
            mockRefreshTokenService,
            mockPasswordService,
        );
    });

    describe('register()', () => {
        it('should register a user and return user, accessToken, and refreshToken', async () => {
            const result = await service.register(
                'john@example.com',
                'password',
            );

            expect(mockPasswordService.hash).toHaveBeenCalledWith('password');
            expect(mockUserService.insertOne).toHaveBeenCalledWith(
                'john@example.com',
                'hashed_password',
            );
            expect(mockRefreshTokenService.insertOne).toHaveBeenCalledWith(
                userId,
            );
            expect(mockJwtService.signAccess).toHaveBeenCalledWith(userId);
            expect(result).toEqual({
                user: mockUser,
                accessToken: 'access123',
                refreshToken: mockRefreshToken,
            });
        });
    });

    describe('login()', () => {
        it('should log in successfully with valid credentials', async () => {
            const result = await service.login('john@example.com', 'password');

            expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
                'john@example.com',
            );
            expect(mockPasswordService.compare).toHaveBeenCalledWith(
                'password',
                mockUser.passwordHash,
            );
            expect(mockRefreshTokenService.insertOne).toHaveBeenCalledWith(
                userId,
            );
            expect(mockJwtService.signAccess).toHaveBeenCalledWith(userId);
            expect(result.user).toBe(mockUser);
        });

        it('should throw InvalidCredentialsError when user is not found', async () => {
            (mockUserService.findOneByEmail as jest.Mock).mockRejectedValue(
                new UserNotFoundError(),
            );

            await expect(
                service.login('unknown@example.com', 'password'),
            ).rejects.toThrow(InvalidCredentialsError);
        });

        it('should throw InvalidCredentialsError when password does not match', async () => {
            (mockPasswordService.compare as jest.Mock).mockResolvedValue(false);

            await expect(
                service.login('john@example.com', 'wrong'),
            ).rejects.toThrow(InvalidCredentialsError);
        });

        it('should rethrow unexpected errors from userService.findOneByEmail', async () => {
            const unexpectedError = new Error('Network failure');
            (mockUserService.findOneByEmail as jest.Mock).mockRejectedValueOnce(
                unexpectedError,
            );

            await expect(
                service.login('john@example.com', 'password'),
            ).rejects.toThrow(unexpectedError);
        });
    });

    describe('refresh()', () => {
        it('should generate new access and refresh tokens', async () => {
            const result = await service.refresh('refresh123');

            expect(mockRefreshTokenService.findOneByToken).toHaveBeenCalledWith(
                'refresh123',
            );
            expect(mockJwtService.signAccess).toHaveBeenCalledWith(userId);
            expect(mockRefreshTokenService.updateOne).toHaveBeenCalled();
            expect(result).toHaveProperty('accessToken', 'access123');
            expect(result).toHaveProperty('refreshToken', mockRefreshToken);
        });

        it('should throw InvalidRefreshTokenError when token not found', async () => {
            (
                mockRefreshTokenService.findOneByToken as jest.Mock
            ).mockRejectedValue(new RefreshTokenNotFoundError());

            await expect(service.refresh('invalid')).rejects.toThrow(
                InvalidRefreshTokenError,
            );
        });

        it('should throw ExpiredRefreshTokenError when token is expired', async () => {
            (
                mockRefreshTokenService.findOneByToken as jest.Mock
            ).mockResolvedValue({
                ...mockRefreshToken,
                expiresAt: new Date(Date.now() - 1000),
            });

            await expect(service.refresh('expired')).rejects.toThrow(
                ExpiredRefreshTokenError,
            );
        });

        it('should rethrow unexpected errors from refreshTokenService.findOneByToken', async () => {
            const unexpectedError = new Error('Database connection lost');
            (
                mockRefreshTokenService.findOneByToken as jest.Mock
            ).mockRejectedValueOnce(unexpectedError);

            await expect(service.refresh('any-token')).rejects.toThrow(
                unexpectedError,
            );
        });
    });

    describe('logout()', () => {
        it('should call deleteOneByToken', async () => {
            await service.logout('refresh123');

            expect(
                mockRefreshTokenService.deleteOneByToken,
            ).toHaveBeenCalledWith('refresh123');
        });
    });
});
