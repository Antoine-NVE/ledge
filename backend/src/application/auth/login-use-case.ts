import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';
import type { Hasher } from '../../domain/ports/hasher.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { User } from '../../domain/entities/user.js';
import type { RefreshToken } from '../../domain/entities/refresh-token.js';
import type { IdManager } from '../../domain/ports/id-manager.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import { AuthenticationError } from '../errors/authentication.error.js';

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
        private tokenGenerator: TokenGenerator,
    ) {}

    execute = async ({ email, password }: Input): Promise<Output> => {
        const now = new Date();

        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new AuthenticationError();

        const isValidPassword = await this.hasher.compare(password, user.passwordHash);
        if (!isValidPassword) throw new AuthenticationError();

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
