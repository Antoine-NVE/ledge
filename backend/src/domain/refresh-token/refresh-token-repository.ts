import { Collection } from 'mongodb';
import { RefreshToken } from './refresh-token-types';

export class RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshToken>) {}

    insertOne = async (refreshToken: RefreshToken): Promise<void> => {
        await this.refreshTokenCollection.insertOne(refreshToken);
    };

    findOne = async <K extends keyof RefreshToken>(
        key: K,
        value: RefreshToken[K],
    ): Promise<RefreshToken | null> => {
        return await this.refreshTokenCollection.findOne({ [key]: value });
    };

    updateOne = async (refreshToken: RefreshToken): Promise<void> => {
        const { _id, ...rest } = refreshToken;
        await this.refreshTokenCollection.updateOne({ _id }, { $set: rest });
    };

    findOneAndDelete = async <K extends keyof RefreshToken>(
        key: K,
        value: RefreshToken[K],
    ): Promise<RefreshToken | null> => {
        return await this.refreshTokenCollection.findOneAndDelete({
            [key]: value,
        });
    };
}
