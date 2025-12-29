import type { UserRepository } from '../../domain/user/user-repository.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { Hasher } from '../ports/hasher.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { IdGenerator } from '../ports/id-generator.js';
import type { User } from '../../domain/user/user-types.js';
import type { RefreshToken } from '../../domain/refresh-token/refresh-token-types.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { generateToken } from '../../core/utils/token.js';
import { ConflictError } from '../../core/errors/conflict-error.js';

type Input = {
    email: string;
    password: string;
};

type Output = {
    user: User;
    accessToken: string;
    refreshToken: RefreshToken;
};

export class RegisterUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepository: RefreshTokenRepository,
        private hasher: Hasher,
        private tokenManager: TokenManager,
        private idGenerator: IdGenerator,
    ) {}

    execute = async ({ email, password }: Input): Promise<Result<Output, ConflictError | Error>> => {
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

        const accessToken = await this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken });
    };
}
