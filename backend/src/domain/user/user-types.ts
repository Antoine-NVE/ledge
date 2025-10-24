import { ObjectId } from 'mongodb';

export type NewUser = {
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    emailVerificationCooldownExpiresAt: Date | null;
};

export type User = NewUser & {
    _id: ObjectId;
    createdAt: Date;
    updatedAt: Date | null;
};
