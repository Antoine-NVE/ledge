import { User } from '../../domain/user/user-types';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { TokenManager } from '../ports/token-manager';
import { Hasher } from '../ports/hasher';
import { NotFoundError } from '../../core/errors/not-found-error';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { generateToken } from '../../core/utils/token';
import { UserRepository } from '../../domain/user/user-repository';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { ConflictError } from '../../core/errors/conflict-error';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';
import { IdGenerator } from '../ports/id-generator';

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
    refreshToken: RefreshToken | null;
};

export class AuthOrchestrator {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private userRepository: UserRepository,
        private tokenManager: TokenManager,
        private refreshTokenRepository: RefreshTokenRepository,
        private hasher: Hasher,
        private idGenerator: IdGenerator,
    ) {}

    register = async ({ email, password }: RegisterInput): Promise<Result<RegisterOutput, ConflictError | Error>> => {
        const now = new Date();

        const user: User = {
            id: this.idGenerator.generate(),
            email,
            passwordHash: await this.hasher.hash(password),
            isEmailVerified: false,
            createdAt: now,
            updatedAt: now,
        };
        const userResult = await this.userRepository.create(user);
        if (!userResult.success) return fail(userResult.error);

        const refreshToken: RefreshToken = {
            id: this.idGenerator.generate(),
            userId: user.id,
            value: generateToken(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
            updatedAt: now,
        };
        const refreshTokenResult = await this.refreshTokenRepository.create(refreshToken);
        if (!refreshTokenResult.success) return fail(refreshTokenResult.error);

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken });
    };

    login = async ({ email, password }: LoginInput): Promise<Result<LoginOutput, Error | UnauthorizedError>> => {
        const now = new Date();

        const userResult = await this.userRepository.findByEmail(email);
        if (!userResult.success) return fail(userResult.error);
        const user = userResult.value;
        if (!user) return fail(new UnauthorizedError({ message: 'Invalid credentials' }));

        const isValidPassword = await this.hasher.compare(password, user.passwordHash);
        if (!isValidPassword) return fail(new UnauthorizedError({ message: 'Invalid credentials' }));

        const refreshToken: RefreshToken = {
            id: this.idGenerator.generate(),
            userId: user.id,
            value: generateToken(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
            updatedAt: now,
        };
        const refreshTokenResult = await this.refreshTokenRepository.create(refreshToken);
        if (!refreshTokenResult.success) return fail(refreshTokenResult.error);

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken });
    };

    refresh = async ({ token }: RefreshInput): Promise<Result<RefreshOutput, Error | UnauthorizedError>> => {
        const now = new Date();

        const findResult = await this.refreshTokenRepository.findByValueAndExpiresAfter(token, now);
        if (!findResult.success) return fail(findResult.error);
        const refreshToken = findResult.value;
        if (!refreshToken) return fail(new UnauthorizedError({ message: 'Invalid or expired refresh token' }));

        refreshToken.value = generateToken();
        refreshToken.expiresAt = new Date(now.getTime() + this.REFRESH_TOKEN_DURATION);
        refreshToken.updatedAt = now;
        const saveResult = await this.refreshTokenRepository.save(refreshToken);
        if (!saveResult.success) return fail(saveResult.error);

        const accessToken = this.tokenManager.signAccess({ userId: refreshToken.userId });

        return ok({ accessToken, refreshToken });
    };

    logout = async ({ token }: LogoutInput): Promise<Result<LogoutOutput, Error | NotFoundError>> => {
        const result = await this.refreshTokenRepository.findByValueAndDelete(token);
        if (!result.success) return fail(result.error);
        const refreshToken = result.value;

        return ok({ refreshToken });
    };
}
