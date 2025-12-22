import { User } from '../../domain/user/user-types';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { TokenManager } from '../ports/token-manager';
import { Hasher } from '../ports/hasher';
import { NotFoundError } from '../../core/errors/not-found-error';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { generateToken } from '../../core/utils/token';
import { UserRepository } from '../../domain/user/user-repository';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { fail, ok, Result } from '../../core/result';
import { ConflictError } from '../../core/errors/conflict-error';

type RegisterInput = {
    email: string;
    password: string;
};

type RegisterOutput = {
    user: User;
    accessToken: string;
    refreshToken: RefreshToken;
};

type LoginInput = {
    email: string;
    password: string;
};

type LoginOutput = {
    user: User;
    accessToken: string;
    refreshToken: RefreshToken;
};

type RefreshInput = {
    token: string;
};

type RefreshOutput = {
    accessToken: string;
    refreshToken: RefreshToken;
};

type LogoutInput = {
    token: string;
};

type LogoutOutput = {
    refreshToken: RefreshToken;
};

export class AuthOrchestrator {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
        private refreshTokenRepository: RefreshTokenRepository,
        private hasher: Hasher,
    ) {}

    register = async ({ email, password }: RegisterInput): Promise<Result<RegisterOutput, ConflictError | Error>> => {
        const now = new Date();

        const passwordHash = await this.hasher.hash(password);

        const userResult = await this.userRepository.create({
            email,
            passwordHash,
            isEmailVerified: false,
            createdAt: now,
        });
        if (!userResult.success) return fail(userResult.error);
        const user = userResult.value;

        const refreshTokenResult = await this.refreshTokenRepository.create({
            userId: user.id,
            token: generateToken(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
        });
        if (!refreshTokenResult.success) return fail(refreshTokenResult.error);
        const refreshToken = refreshTokenResult.value;

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken });
    };

    login = async ({ email, password }: LoginInput): Promise<Result<LoginOutput, UnauthorizedError | Error>> => {
        const now = new Date();

        const userResult = await this.userRepository.findByEmail(email);
        if (!userResult.success) {
            const err = userResult.error;
            if (err instanceof NotFoundError) {
                return fail(new UnauthorizedError({ message: 'Invalid credentials' }));
            }
            return fail(err);
        }
        const user = userResult.value;

        const doesMatch = await this.hasher.compare(password, user.passwordHash);
        if (!doesMatch) {
            return fail(new UnauthorizedError({ message: 'Invalid credentials' }));
        }

        const refreshTokenResult = await this.refreshTokenRepository.create({
            userId: user.id,
            token: generateToken(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
        });
        if (!refreshTokenResult.success) return fail(refreshTokenResult.error);
        const refreshToken = refreshTokenResult.value;

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken });
    };

    refresh = async ({ token }: RefreshInput): Promise<Result<RefreshOutput, UnauthorizedError | Error>> => {
        const now = new Date();

        const findResult = await this.refreshTokenRepository.findByToken(token);
        if (!findResult.success) {
            const err = findResult.error;
            if (err instanceof NotFoundError) {
                return fail(new UnauthorizedError({ message: 'Invalid refresh token' }));
            }
            return fail(err);
        }
        const refreshToken = findResult.value;

        if (refreshToken.expiresAt < now) {
            return fail(new UnauthorizedError({ message: 'Expired refresh token' }));
        }

        refreshToken.token = generateToken();
        refreshToken.expiresAt = new Date(now.getTime() + this.REFRESH_TOKEN_DURATION);
        refreshToken.updatedAt = now;
        const saveResult = await this.refreshTokenRepository.save(refreshToken);
        if (!saveResult.success) return fail(saveResult.error);

        const accessToken = this.tokenManager.signAccess({
            userId: refreshToken.userId,
        });

        return ok({ accessToken, refreshToken });
    };

    logout = async ({ token }: LogoutInput): Promise<Result<LogoutOutput, NotFoundError | Error>> => {
        const result = await this.refreshTokenRepository.deleteByToken(token);
        if (!result.success) return fail(result.error);
        const refreshToken = result.value;

        return ok({ refreshToken });
    };
}
