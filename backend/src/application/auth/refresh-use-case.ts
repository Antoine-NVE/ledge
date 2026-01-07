import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { TokenManager } from '../ports/token-manager.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { UnauthorizedError } from '../../core/errors/unauthorized-error.js';
import { generateToken } from '../../core/utils/token.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';

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
    ) {}

    execute = async (input: Input): Promise<Result<Output, Error | NotFoundError | UnauthorizedError>> => {
        const now = new Date();

        const findResult = await this.refreshTokenRepository.findByValueAndExpiresAfter(input.refreshToken, now);
        if (!findResult.success) return fail(findResult.error);
        const refreshToken = findResult.data;

        if (!refreshToken) {
            return fail(new UnauthorizedError({ message: 'Invalid or expired refresh token', action: 'LOGIN' }));
        }

        refreshToken.value = generateToken();
        refreshToken.expiresAt = new Date(now.getTime() + this.REFRESH_TOKEN_DURATION);
        refreshToken.updatedAt = now;

        const saveResult = await this.refreshTokenRepository.save(refreshToken);
        if (!saveResult.success) return fail(saveResult.error);

        const accessToken = await this.tokenManager.signAccess({ userId: refreshToken.userId });

        return ok({ accessToken, newRefreshToken: refreshToken.value });
    };
}
