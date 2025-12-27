import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { fail, ok } from '../../core/utils/result';
import { Result } from '../../core/types/result';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';

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
