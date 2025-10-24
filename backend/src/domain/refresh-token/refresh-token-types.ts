import { ObjectId } from 'mongodb';

export type NewRefreshToken = {
    token: string;
    expiresAt: Date;
    userId: ObjectId;
};

export type RefreshToken = NewRefreshToken & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
};
