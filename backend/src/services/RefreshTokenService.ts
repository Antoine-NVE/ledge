import { ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { RefreshToken } from '../types/RefreshToken';
import { RefreshTokenNotFoundError } from '../errors/NotFoundError';
import { RefreshTokenSchema } from '../schemas/RefreshTokenSchema';
import { InvalidDataError } from '../errors/InternalServerError';
import z from 'zod';
import { generateToken } from '../utils/token';

export class RefreshTokenService {
    static readonly TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

    constructor(
        private refreshTokenRepository: RefreshTokenRepository,
        private refreshTokenSchema: RefreshTokenSchema,
    ) {}

    insertOne = async (userId: ObjectId): Promise<RefreshToken> => {
        const refreshToken = this.refreshTokenSchema.parseBase({
            _id: new ObjectId(),
            token: generateToken(),
            expiresAt: new Date(Date.now() + RefreshTokenService.TTL),
            userId,
            createdAt: new Date(),
            updatedAt: null,
        });

        await this.refreshTokenRepository.insertOne(refreshToken);

        return refreshToken;
    };

    findOneByToken = async (token: string): Promise<RefreshToken> => {
        const refreshToken = await this.refreshTokenRepository.findOne('token', token);
        if (!refreshToken) throw new RefreshTokenNotFoundError();

        return refreshToken;
    };

    updateOne = async (refreshToken: RefreshToken): Promise<RefreshToken> => {
        refreshToken.updatedAt = new Date();

        refreshToken = this.refreshTokenSchema.parseBase(refreshToken);

        await this.refreshTokenRepository.updateOne(refreshToken);

        return refreshToken;
    };

    deleteOneByToken = async (token: string): Promise<void> => {
        await this.refreshTokenRepository.deleteOne('token', token);
    };
}
