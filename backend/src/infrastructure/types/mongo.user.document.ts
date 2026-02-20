import type { ObjectId } from 'mongodb';

export type UserDocument = Readonly<{
    _id: ObjectId;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
