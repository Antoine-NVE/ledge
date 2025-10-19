import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { RefreshToken } from '../types/RefreshToken';
import { RefreshTokenNotFoundError } from '../errors/NotFoundError';
import { parseSchema } from '../utils/schema';
import { refreshTokenSchema } from '../schemas/refresh-token';
import { TokenService } from './TokenService';

export class RefreshTokenService {
    readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private tokenService: TokenService,
    ) {}

    insertOne = async (userId: ObjectId): Promise<RefreshToken> => {
        const refreshToken = parseSchema(refreshTokenSchema, {
            _id: new ObjectId(),
            token: this.tokenService.generate(),
            expiresAt: new Date(Date.now() + this.TTL),
            userId,
            createdAt: new Date(),
            updatedAt: null,
        });

        await this.refreshTokenRepository.insertOne(refreshToken);

        return refreshToken;
    };

    findOneByToken = async (token: string): Promise<RefreshToken> => {
        const refreshToken = await this.refreshTokenRepository.findOne(
            'token',
            token,
        );
        if (!refreshToken) throw new RefreshTokenNotFoundError();

        return refreshToken;
    };

    updateOne = async (refreshToken: RefreshToken): Promise<RefreshToken> => {
        refreshToken.updatedAt = new Date();

        refreshToken = parseSchema(refreshTokenSchema, refreshToken);

        await this.refreshTokenRepository.updateOne(refreshToken);

        return refreshToken;
    };

    deleteOneByToken = async (token: string): Promise<void> => {
        await this.refreshTokenRepository.deleteOne('token', token);
    };
}
