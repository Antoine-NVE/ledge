import { BaseDocument } from '../shared/shared-types';

export type UserData = {
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    emailVerificationCooldownExpiresAt?: Date;
};

export type User = UserData & BaseDocument;
