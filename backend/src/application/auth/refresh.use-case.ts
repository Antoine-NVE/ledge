import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import type { RefreshToken } from '../../domain/entities/refresh-token.js';
import type { Logger } from '../../domain/ports/logger.js';
import { fail, ok, type Result } from '../../core/result.js';

type RefreshInput = { refreshToken: string | undefined };

type RefreshResult = Result<
    { accessToken: string; refreshToken: string },
    'MISSING_REFRESH_TOKEN' | 'REFRESH_TOKEN_NOT_FOUND' | 'EXPIRED_REFRESH_TOKEN'
>;

export class RefreshUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private tokenManager: TokenManager,
        private tokenGenerator: TokenGenerator,
    ) {}

    execute = async (input: RefreshInput, logger: Logger): Promise<RefreshResult> => {
        const now = new Date();

        if (!input.refreshToken) return fail('MISSING_REFRESH_TOKEN');

        const refreshToken = await this.refreshTokenRepository.findByValue(input.refreshToken);
        if (!refreshToken) return fail('REFRESH_TOKEN_NOT_FOUND');
        if (refreshToken.expiresAt < now) return fail('EXPIRED_REFRESH_TOKEN');

        const updatedRefreshToken: RefreshToken = {
            id: refreshToken.id,
            userId: refreshToken.userId,
            value: this.tokenGenerator.generate(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            createdAt: refreshToken.createdAt,
            updatedAt: now,
        };
        await this.refreshTokenRepository.save(updatedRefreshToken);
        logger.info('Refresh token updated', { refreshTokenId: refreshToken.id, userId: refreshToken.userId });

        const accessToken = this.tokenManager.signAccess({ userId: refreshToken.userId });

        return ok({ accessToken, refreshToken: updatedRefreshToken.value });
    };
}
