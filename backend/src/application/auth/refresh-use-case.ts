import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { TokenManager } from '../ports/token-manager';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';
import { UnauthorizedError } from '../../core/errors/unauthorized-error';
import { generateToken } from '../../core/utils/token';
import { NotFoundError } from '../../core/errors/not-found-error';

type Input = {
    token: string;
};

type Output = {
    accessToken: string;
    refreshToken: RefreshToken;
};

export class RefreshUseCase {
    private readonly REFRESH_TOKEN_DURATION = 7 * 24 * 60 * 60 * 1000;

    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private tokenManager: TokenManager,
    ) {}

    execute = async ({ token }: Input): Promise<Result<Output, Error | NotFoundError | UnauthorizedError>> => {
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

        const accessToken = await this.tokenManager.signAccess({ userId: refreshToken.userId });

        return ok({ accessToken, refreshToken });
    };
}
