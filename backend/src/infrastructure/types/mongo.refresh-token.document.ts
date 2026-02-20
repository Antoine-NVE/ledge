import type { ObjectId } from 'mongodb';

export type RefreshTokenDocument = Readonly<{
    _id: ObjectId;
    userId: ObjectId;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
