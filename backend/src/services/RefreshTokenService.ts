import { Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument, RefreshTokenPopulatedDocument } from '../models/RefreshToken';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import { generateToken } from '../utils/token';
import { ExpiredRefreshTokenError, InvalidRefreshTokenError } from '../errors/UnauthorizedErrors';

export default class RefreshTokenService {
    private readonly REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    async create(userId: Types.ObjectId): Promise<RefreshTokenDocument> {
        return await this.refreshTokenRepository.create({
            token: generateToken(),
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION),
            user: userId,
        });
    }

    async findByTokenAndPopulate(token: string): Promise<RefreshTokenPopulatedDocument> {
        const refreshTokenPopulated = await this.refreshTokenRepository.findByTokenAndPopulate(token);
        if (!refreshTokenPopulated || !refreshTokenPopulated.user) throw new InvalidRefreshTokenError(); // Also check user existence but should not happen
        if (refreshTokenPopulated.expiresAt < new Date()) throw new ExpiredRefreshTokenError();
        return refreshTokenPopulated;
    }

    async extendExpiration(
        refreshTokenPopulated: RefreshTokenPopulatedDocument,
    ): Promise<RefreshTokenPopulatedDocument> {
        return await this.refreshTokenRepository.updateFromPopulatedDocument(refreshTokenPopulated, {
            expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_EXPIRATION),
        });
    }
}
