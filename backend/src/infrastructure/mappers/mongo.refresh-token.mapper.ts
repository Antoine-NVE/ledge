import type { RefreshToken } from '../../domain/entities/refresh-token.js';
import type { RefreshTokenDocument } from '../types/mongo.refresh-token.document.js';
import { ObjectId } from 'mongodb';

export const toRefreshTokenDocument = (refreshToken: RefreshToken): RefreshTokenDocument => {
    return {
        _id: new ObjectId(refreshToken.id),
        userId: new ObjectId(refreshToken.userId),
        value: refreshToken.value,
        expiresAt: refreshToken.expiresAt,
        createdAt: refreshToken.createdAt,
        updatedAt: refreshToken.updatedAt,
    };
};

export const toRefreshToken = (document: RefreshTokenDocument): RefreshToken => {
    return {
        id: document._id.toString(),
        userId: document.userId.toString(),
        value: document.value,
        expiresAt: document.expiresAt,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
    };
};
