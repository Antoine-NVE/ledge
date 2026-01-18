export type RefreshToken = Readonly<{
    id: string;
    userId: string;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;
