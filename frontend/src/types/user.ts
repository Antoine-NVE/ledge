export interface NewUser {
    email: string;
    password: string;
}

export type User = Omit<NewUser, 'password'> & {
    _id: string;
    isEmailVerified: boolean;
    emailVerificationRequestExpiresAt?: Date | null;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};
