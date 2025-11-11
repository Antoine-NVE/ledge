import { ObjectId } from 'mongodb';
import { BaseDocument } from '../shared/shared-types';

export type RefreshTokenData = {
    token: string;
    userId: ObjectId;
    expiresAt: Date;
};

export type RefreshToken = RefreshTokenData & BaseDocument;

export type CreateRefreshTokenData = Pick<RefreshTokenData, 'token' | 'userId'>;
