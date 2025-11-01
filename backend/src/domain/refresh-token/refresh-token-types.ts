import { ObjectId } from 'mongodb';

export type RefreshTokenData = {
    token: string;
    expiresAt: Date;
    userId: ObjectId;
};

export type RefreshToken = RefreshTokenData & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
};
