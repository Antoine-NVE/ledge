import type { RefreshToken } from '../../domain/refresh-token/refresh-token-types.js';
import { fail, ok } from '../../core/utils/result.js';
import type { Result } from '../../core/types/result.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';

type Input = {
    token: string;
};

type Output = {
    refreshToken: RefreshToken | null;
};

export class LogoutUseCase {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    execute = async ({ token }: Input): Promise<Result<Output, Error>> => {
        const result = await this.refreshTokenRepository.findByValueAndDelete(token);
        if (!result.success) return fail(result.error);
        const refreshToken = result.value;

        return ok({ refreshToken });
    };
}
