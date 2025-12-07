export type RefreshToken = {
    id: string;
    userId: string;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt?: Date;
};

export type NewRefreshToken = Omit<RefreshToken, 'id' | 'updatedAt'>;
