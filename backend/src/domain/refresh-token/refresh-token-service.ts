import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from './refresh-token-repository';
import { RefreshToken } from './refresh-token-types';
import { NotFoundError } from '../../infrastructure/errors/not-found-error';

export class RefreshTokenService {
    private readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    create = async (token: string, userId: ObjectId): Promise<RefreshToken> => {
        const refreshToken: RefreshToken = {
            _id: new ObjectId(),
            token,
            expiresAt: new Date(Date.now() + this.TTL),
            userId,
            createdAt: new Date(),
            updatedAt: null,
        };

        await this.refreshTokenRepository.insertOne(refreshToken);

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
    ): Promise<RefreshToken> => {
        refreshToken.updatedAt = new Date();

        refreshToken.expiresAt = new Date(Date.now() + this.TTL);

        await this.refreshTokenRepository.updateOne(refreshToken);

        return refreshToken;
    };

    deleteOneByToken = async (token: string): Promise<void> => {
        await this.refreshTokenRepository.deleteOne('token', token);
    };
}
