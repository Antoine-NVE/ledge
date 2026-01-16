import type { UserRepository } from '../../domain/user/user-repository.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { Hasher } from '../ports/hasher.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { IdManager } from '../ports/id-manager.js';
import type { User } from '../../domain/user/user-types.js';
import type { RefreshToken } from '../../domain/refresh-token/refresh-token-types.js';
import type { TokenGenerator } from '../ports/token-generator.js';

type Input = {
    email: string;
    password: string;
};

type Output = {
    user: User;
    accessToken: string;
    refreshToken: string;
};

export class RegisterUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private userRepository: UserRepository,
        private refreshTokenRepository: RefreshTokenRepository,
        private hasher: Hasher,
        private tokenManager: TokenManager,
        private idManager: IdManager,
        private tokenGenerator: TokenGenerator,
    ) {}

    execute = async ({ email, password }: Input): Promise<Output> => {
        const now = new Date();

        const user: User = {
            id: this.idManager.generate(),
            email,
            passwordHash: await this.hasher.hash(password),
            isEmailVerified: false,
            createdAt: now,
            updatedAt: now,
        };
        await this.userRepository.create(user);

        const refreshToken: RefreshToken = {
            id: this.idManager.generate(),
            userId: user.id,
            value: this.tokenGenerator.generate(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
            updatedAt: now,
        };
        await this.refreshTokenRepository.create(refreshToken);

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return { user, accessToken, refreshToken: refreshToken.value };
    };
}
