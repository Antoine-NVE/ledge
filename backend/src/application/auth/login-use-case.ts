import type { UserRepository } from '../../domain/user/user-repository.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { Hasher } from '../ports/hasher.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { User } from '../../domain/user/user-types.js';
import type { RefreshToken } from '../../domain/refresh-token/refresh-token-types.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import { generateToken } from '../../core/utils/token.js';
import type { IdManager } from '../ports/id-manager.js';

type Input = {
    email: string;
    password: string;
};

type Output = {
    user: User;
    accessToken: string;
    refreshToken: string;
};

export class LoginUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepository: RefreshTokenRepository,
        private hasher: Hasher,
        private tokenManager: TokenManager,
        private idManager: IdManager,
    ) {}

    execute = async ({ email, password }: Input): Promise<Result<Output, Error | UnauthorizedError>> => {
        const now = new Date();

        const userResult = await this.userRepository.findByEmail(email);
        if (!userResult.success) return fail(userResult.error);
        const user = userResult.data;

        if (!user) return fail(new UnauthorizedError({ message: 'Invalid credentials' }));

        const isValidPassword = await this.hasher.compare(password, user.passwordHash);
        if (!isValidPassword) return fail(new UnauthorizedError({ message: 'Invalid credentials' }));

        const refreshToken: RefreshToken = {
            id: this.idManager.generate(),
            userId: user.id,
            value: generateToken(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
            updatedAt: now,
        };

        const refreshTokenResult = await this.refreshTokenRepository.create(refreshToken);
        if (!refreshTokenResult.success) return fail(refreshTokenResult.error);

        const accessToken = await this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken: refreshToken.value });
    };
}
