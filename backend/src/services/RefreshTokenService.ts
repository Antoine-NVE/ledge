import { Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../models/RefreshToken';
import RefreshTokenRepository from '../repositories/RefreshTokenRepository';
import { generateToken } from '../utils/token';

export default class RefreshTokenService {
    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    async createRefreshToken(userId: Types.ObjectId): Promise<RefreshTokenDocument> {
        return await this.refreshTokenRepository.create({
            token: generateToken(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            user: userId,
        });
    }
}
