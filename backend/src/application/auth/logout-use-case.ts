import { fail, ok } from '../../core/utils/result.js';
import type { Result } from '../../core/types/result.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';

type Input = {
    refreshToken: string;
};

type Output = {
    refreshToken: string | null;
};

export class LogoutUseCase {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    execute = async (input: Input): Promise<Result<Output, Error>> => {
        const result = await this.refreshTokenRepository.findByValueAndDelete(input.refreshToken);
        if (!result.success) return fail(result.error);
        const refreshToken = result.value;

        return ok({ refreshToken: refreshToken?.value ?? null });
    };
}
