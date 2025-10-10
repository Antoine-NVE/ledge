import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { RefreshToken } from '../types/refreshTokenType';
import { generateToken } from '../utils/token';

export class RefreshTokenService {
    static readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(private refreshTokenRepository: RefreshTokenRepository) {}

    insertOne = async (userId: ObjectId): Promise<RefreshToken> => {
        const refreshToken: RefreshToken = {
            _id: new ObjectId(),
            token: generateToken(),
            expiresAt: new Date(Date.now() + RefreshTokenService.TTL),
            userId,
            createdAt: new Date(),
            updatedAt: null,
        };

        await this.refreshTokenRepository.insertOne(refreshToken);

        return refreshToken;
    };

    findOneByToken = async (token: string): Promise<RefreshToken | null> => {
        return await this.refreshTokenRepository.findOne('token', token);
    };

    updateOne = async (refreshToken: RefreshToken): Promise<RefreshToken> => {
        refreshToken.updatedAt = new Date();

        await this.refreshTokenRepository.updateOne(refreshToken);

        return refreshToken;
    };

    deleteOneByToken = async (token: string): Promise<void> => {
        await this.refreshTokenRepository.deleteOne('token', token);
    };
}
