import { RefreshTokenRepository } from './refresh-token-repository';
import { NewRefreshToken, RefreshToken } from './refresh-token-types';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';

type CreateRefreshTokenInput = {
    userId: string;
    token: string;
};

type ExtendRefreshTokenExpirationInput = {
    token: string;
};

export class RefreshTokenService {
    private readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    create = async (data: CreateRefreshTokenInput): Promise<RefreshToken> => {
        const newRefreshToken: NewRefreshToken = {
            ...data,
            expiresAt: new Date(Date.now() + this.TTL),
            createdAt: new Date(),
        };

        return await this.refreshTokenRepository.create(newRefreshToken);
    };

    findByToken = async (token: string): Promise<RefreshToken> => {
        const refreshToken =
            await this.refreshTokenRepository.findByToken(token);
        if (!refreshToken) throw new NotFoundError('Refresh token not found');

        return refreshToken;
    };

    extendExpiration = async (
        refreshToken: RefreshToken,
        data: ExtendRefreshTokenExpirationInput,
    ): Promise<RefreshToken> => {
        Object.assign(refreshToken, data);
        refreshToken.expiresAt = new Date(Date.now() + this.TTL);
        refreshToken.updatedAt = new Date();

        await this.refreshTokenRepository.save(refreshToken);
        return refreshToken;
    };

    deleteByToken = async (token: string) => {
        const refreshToken =
            await this.refreshTokenRepository.deleteByToken(token);
        if (!refreshToken) throw new NotFoundError('Refresh token not found');
        return refreshToken;
    };
}
