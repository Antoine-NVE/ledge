import { RefreshTokenRepository } from './refresh-token-repository';
import { NewRefreshToken, RefreshToken } from './refresh-token-types';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';

type CreateInput = {
    userId: string;
    token: string;
};

type FindByTokenInput = {
    token: string;
};

type RotateTokenInput = {
    refreshToken: RefreshToken;
    token: string;
};

type DeleteByTokenInput = {
    token: string;
};

export class RefreshTokenService {
    private readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    create = async (data: CreateInput) => {
        const newRefreshToken: NewRefreshToken = {
            ...data,
            expiresAt: new Date(Date.now() + this.TTL),
            createdAt: new Date(),
        };

        return await this.refreshTokenRepository.create(newRefreshToken);
    };

    findByToken = async ({ token }: FindByTokenInput) => {
        const refreshToken =
            await this.refreshTokenRepository.findByToken(token);
        if (!refreshToken) throw new NotFoundError('Refresh token not found');

        return refreshToken;
    };

    rotateToken = async ({ refreshToken, token }: RotateTokenInput) => {
        refreshToken.token = token;
        refreshToken.expiresAt = new Date(Date.now() + this.TTL);
        refreshToken.updatedAt = new Date();

        await this.refreshTokenRepository.save(refreshToken);
        return refreshToken;
    };

    deleteByToken = async ({ token }: DeleteByTokenInput) => {
        const refreshToken =
            await this.refreshTokenRepository.deleteByToken(token);
        if (!refreshToken) throw new NotFoundError('Refresh token not found');
        return refreshToken;
    };
}
