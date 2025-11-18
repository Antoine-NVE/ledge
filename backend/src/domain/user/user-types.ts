import { BaseDocument } from '../shared/shared-types';

export type UserData = {
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
};

export type User = UserData & BaseDocument;

export type RegisterUserData = Pick<UserData, 'email' | 'passwordHash'>;
