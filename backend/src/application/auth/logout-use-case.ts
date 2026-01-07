import { fail, ok } from '../../core/utils/result.js';
import type { Result } from '../../core/types/result.js';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { NotFoundError } from '../../core/errors/not-found-error.js';

type Input = {
    refreshToken: string;
};

type Output = void;

export class LogoutUseCase {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    execute = async (input: Input): Promise<Result<Output, Error | NotFoundError>> => {
        const findResult = await this.refreshTokenRepository.findByValue(input.refreshToken);
        if (!findResult.success) return fail(findResult.error);
        const refreshToken = findResult.data;

        if (!refreshToken) return ok(undefined);

        const deleteResult = await this.refreshTokenRepository.delete(refreshToken);
        if (!deleteResult.success) return fail(deleteResult.error);

        return ok(undefined);
    };
}
