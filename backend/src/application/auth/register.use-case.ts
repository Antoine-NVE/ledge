import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';
import type { Hasher } from '../../domain/ports/hasher.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { IdManager } from '../../domain/ports/id-manager.js';
import type { User } from '../../domain/entities/user.js';
import type { RefreshToken } from '../../domain/entities/refresh-token.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import type { Logger } from '../../domain/ports/logger.js';
import { fail, ok, type Result } from '../../core/result.js';

type RegisterInput = { email: string; password: string };

type RegisterResult = Result<{ user: User; accessToken: string; refreshToken: string }, 'DUPLICATE_EMAIL'>;

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

    execute = async (input: RegisterInput, logger: Logger): Promise<RegisterResult> => {
        const now = new Date();

        const existingUser = await this.userRepository.findByEmail(input.email);
        if (existingUser) return fail('DUPLICATE_EMAIL');

        const user: User = {
            id: this.idManager.generate(),
            email: input.email,
            passwordHash: await this.hasher.hash(input.password),
            isEmailVerified: false,
            createdAt: now,
            updatedAt: now,
        };
        await this.userRepository.create(user);
        logger.info('User created', { userId: user.id });

        const refreshToken: RefreshToken = {
            id: this.idManager.generate(),
            userId: user.id,
            value: this.tokenGenerator.generate(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: now,
            updatedAt: now,
        };
        await this.refreshTokenRepository.create(refreshToken);
        logger.info('Refresh token created', { refreshTokenId: refreshToken.id, userId: refreshToken.userId });

        const accessToken = this.tokenManager.signAccess({ userId: user.id });

        return ok({ user, accessToken, refreshToken: refreshToken.value });
    };
}
