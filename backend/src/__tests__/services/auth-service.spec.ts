import { ObjectId } from 'mongodb';
import { AuthService } from '../../application/auth/auth-orchestrator';
import { UserService } from '../../domain/user/user-service';
import { JwtService } from '../../services/jwt-service';
import { RefreshTokenService } from '../../services/refresh-token-service';
import { PasswordService } from '../../services/password-service';

const userId = new ObjectId();
const email = 'test@example.com';
const password = 'Azerty123!';
const passwordHash =
    '$2b$10$/Fcv9vkV0sDEZgK06AGn9uh1alqOVSyScU4tuHF4YGNEHCBNI1xfy';
const user = {
    _id: userId,
    passwordHash,
};
const accessToken = 'json.web.token';
const token = 'token';
const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
const refreshToken = {
    expiresAt,
    userId,
};

const userService = {
    insertOne: jest.fn().mockResolvedValue(user),
    findOneByEmail: jest.fn().mockResolvedValue(user),
} as unknown as UserService;

const jwtService = {
    signAccess: jest.fn().mockReturnValue(accessToken),
} as unknown as JwtService;

const refreshTokenService = {
    insertOne: jest.fn().mockResolvedValue(refreshToken),
    findOneByToken: jest.fn().mockResolvedValue(refreshToken),
    updateOne: jest.fn().mockResolvedValue(refreshToken),
    deleteOneByToken: jest.fn().mockResolvedValue(refreshToken),
} as unknown as RefreshTokenService;

const passwordService = {
    hash: jest.fn().mockResolvedValue(passwordHash),
    compare: jest.fn().mockResolvedValue(true),
} as unknown as PasswordService;

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(() => {
        jest.clearAllMocks();

        authService = new AuthService(
            userService,
            jwtService,
            refreshTokenService,
            passwordService,
        );
    });

    describe('register', () => {
        it('should call passwordService to hash', async () => {
            await authService.register(email, password);

            expect(passwordService.hash).toHaveBeenCalledWith(password);
        });

        it('should call userService to insertOne', async () => {
            await authService.register(email, password);

            expect(userService.insertOne).toHaveBeenCalledWith(
                email,
                passwordHash,
            );
        });

        it('should call refreshToken to insertOne', async () => {
            await authService.register(email, password);

            expect(refreshTokenService.insertOne).toHaveBeenCalledWith(userId);
        });

        it('should call jwtService to signAccess', async () => {
            await authService.register(email, password);

            expect(jwtService.signAccess).toHaveBeenCalledWith(userId);
        });

        it('should return user, accessToken and refreshToken', async () => {
            const result = await authService.register(email, password);

            expect(result).toEqual({
                user,
                accessToken,
                refreshToken,
            });
        });
    });

    describe('login', () => {
        it('should call userService to findOneByEmail', async () => {
            await authService.login(email, password);

            expect(userService.findOneByEmail).toHaveBeenCalledWith(email);
        });

        it('should call passwordService to compare', async () => {
            await authService.login(email, password);

            expect(passwordService.compare).toHaveBeenCalledWith(
                password,
                passwordHash,
            );
        });

        it('should call refreshTokenService to insertOne', async () => {
            await authService.login(email, password);

            expect(refreshTokenService.insertOne).toHaveBeenCalledWith(userId);
        });

        it('should call jwtService to signAccess', async () => {
            await authService.login(email, password);

            expect(jwtService.signAccess).toHaveBeenCalledWith(userId);
        });

        it('should return user, accessToken and refreshToken', async () => {
            const result = await authService.login(email, password);

            expect(result).toEqual({
                user,
                accessToken,
                refreshToken,
            });
        });
    });

    describe('refresh', () => {
        it('should call refreshTokenService to findOneByToken', async () => {
            await authService.refresh(token);

            expect(refreshTokenService.findOneByToken).toHaveBeenCalledWith(
                token,
            );
        });

        it('should call jwtService to signAccess', async () => {
            await authService.refresh(token);

            expect(jwtService.signAccess).toHaveBeenCalledWith(userId);
        });

        it('should return access token and refresh token', async () => {
            const result = await authService.refresh(token);

            expect(result).toEqual({
                accessToken,
                refreshToken,
            });
        });
    });

    describe('logout', () => {
        it('should call refreshTokenService to deleteOneByToken', async () => {
            await authService.logout(token);

            expect(refreshTokenService.deleteOneByToken).toHaveBeenCalledWith(
                token,
            );
        });
    });
});
