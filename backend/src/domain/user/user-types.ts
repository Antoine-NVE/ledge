export type User = {
    id: string;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt?: Date;
};

export type NewUser = Omit<User, 'id' | 'updatedAt'>;
