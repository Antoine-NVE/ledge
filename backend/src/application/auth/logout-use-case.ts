import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';

type Input = {
    refreshToken: string;
};

type Output = void;

export class LogoutUseCase {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    execute = async (input: Input): Promise<Output> => {
        const refreshToken = await this.refreshTokenRepository.findByValue(input.refreshToken);
        if (!refreshToken) return;

        await this.refreshTokenRepository.delete(refreshToken);
    };
}
