import { ObjectId } from 'mongodb';

export type UserData = {
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    emailVerificationCooldownExpiresAt: Date | null;
};

export type User = UserData & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
};
