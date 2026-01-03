import { fail, ok } from '../../core/utils/result.js';
import type { Result } from '../../core/types/result.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';

type Input = {
    refreshToken: string;
};

type Output = void;

export class LogoutUseCase {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    execute = async ({ refreshToken }: Input): Promise<Result<Output, Error>> => {
        const result = await this.refreshTokenRepository.findByValueAndDelete(refreshToken);
        if (!result.success) return fail(result.error);

        return ok(undefined);
    };
}
