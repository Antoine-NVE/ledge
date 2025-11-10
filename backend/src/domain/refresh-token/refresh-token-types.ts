import { ObjectId } from 'mongodb';
import { BaseDocument } from '../shared/shared-types';

export type RefreshTokenData = {
    token: string;
    expiresAt: Date;
    userId: ObjectId;
};

export type RefreshToken = RefreshTokenData & BaseDocument;
