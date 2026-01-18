import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';
import type { TokenManager } from '../../domain/ports/token-manager.js';
import type { TokenGenerator } from '../../domain/ports/token-generator.js';
import { AuthenticationError } from '../errors/authentication.error.js';
import type { RefreshToken } from '../../domain/entities/refresh-token.js';

type Input = {
    refreshToken: string;
};

type Output = {
    accessToken: string;
    newRefreshToken: string;
};

export class RefreshUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private tokenManager: TokenManager,
        private tokenGenerator: TokenGenerator,
    ) {}

    execute = async (input: Input): Promise<Output> => {
        const now = new Date();

        const refreshToken = await this.refreshTokenRepository.findByValue(input.refreshToken);
        if (!refreshToken || refreshToken.expiresAt < now) throw new AuthenticationError();

        const updatedRefreshToken: RefreshToken = {
            ...refreshToken,
            value: this.tokenGenerator.generate(),
            expiresAt: new Date(now.getTime() + this.REFRESH_TOKEN_DURATION),
            updatedAt: now,
        };
        await this.refreshTokenRepository.save(updatedRefreshToken);

        const accessToken = this.tokenManager.signAccess({ userId: refreshToken.userId });

        return { accessToken, newRefreshToken: updatedRefreshToken.value };
    };
}
