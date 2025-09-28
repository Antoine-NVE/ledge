import { DeleteResult, Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../models/RefreshToken';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { generateToken } from '../utils/token';
import { ExpiredRefreshTokenError, InvalidRefreshTokenError } from '../errors/UnauthorizedError';

export class RefreshTokenService {
    private readonly REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    async create(userId: Types.ObjectId): Promise<RefreshTokenDocument> {
        return await this.refreshTokenRepository.create({
            token: generateToken(),
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION),
            user: userId,
        });
    }

    async findByToken(token: string): Promise<RefreshTokenDocument> {
        const refreshToken = await this.refreshTokenRepository.findByToken(token);
        if (!refreshToken) throw new InvalidRefreshTokenError();
        if (refreshToken.expiresAt < new Date()) throw new ExpiredRefreshTokenError();
        return refreshToken;
    }

    async extendExpiration(refreshToken: RefreshTokenDocument): Promise<RefreshTokenDocument> {
        return await this.refreshTokenRepository.updateFromDocument(refreshToken, {
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION),
        });
    }

    async deleteByToken(token: string): Promise<DeleteResult> {
        return await this.refreshTokenRepository.deleteByToken(token);
    }
}
