import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';
import type { Logger } from '../../domain/ports/logger.js';

type Input = {
    refreshToken: string;
};

export class LogoutUseCase {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    execute = async (input: Input, logger: Logger): Promise<void> => {
        const refreshToken = await this.refreshTokenRepository.findByValue(input.refreshToken);
        if (!refreshToken) return;

        await this.refreshTokenRepository.delete(refreshToken);
        logger.info('Refresh token deleted', { refreshTokenId: refreshToken.id, userId: refreshToken.userId });
    };
}
