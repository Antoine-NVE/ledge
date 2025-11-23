import { MongoServerError, ObjectId } from 'mongodb';
import { RefreshTokenRepository } from './refresh-token-repository';
import { CreateRefreshTokenData, RefreshToken } from './refresh-token-types';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';
import { InternalServerError } from '../../infrastructure/errors/internal-server-error';

export class RefreshTokenService {
    private readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    create = async (data: CreateRefreshTokenData): Promise<RefreshToken> => {
        const refreshToken: RefreshToken = {
            _id: new ObjectId(),
            ...data,
            expiresAt: new Date(Date.now() + this.TTL),
            createdAt: new Date(),
        };

        await this.refreshTokenRepository
            .insertOne(refreshToken)
            .catch((err) => {
                if (err instanceof MongoServerError && err.code === 11000) {
                    throw new InternalServerError('Duplicate token');
                }
                throw err;
            });

        return refreshToken;
    };

    findOneByToken = async (token: string): Promise<RefreshToken> => {
        const refreshToken = await this.refreshTokenRepository.findOne(
            'token',
            token,
        );
        if (!refreshToken) throw new NotFoundError('Refresh token not found');

        return refreshToken;
    };

    extendExpiration = async (
        refreshToken: RefreshToken,
        newToken: string,
    ): Promise<RefreshToken> => {
        refreshToken.updatedAt = new Date();

        refreshToken.token = newToken;
        refreshToken.expiresAt = new Date(Date.now() + this.TTL);

        await this.refreshTokenRepository.updateOne(refreshToken);

        return refreshToken;
    };

    findOneAndDeleteByToken = async (token: string) => {
        const refreshToken = await this.refreshTokenRepository.findOneAndDelete(
            'token',
            token,
        );
        if (!refreshToken) throw new NotFoundError('Refresh token not found');

        return refreshToken;
    };
}
