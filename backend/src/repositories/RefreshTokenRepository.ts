import { Collection, WithId } from 'mongodb';
import { DeleteResult, Model, Types } from 'mongoose';
import { RefreshToken } from '../types/refreshTokenType';

export class RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshToken>) {}

    async insert(refreshToken: RefreshToken): Promise<WithId<RefreshToken>> {
        const result = await this.refreshTokenCollection.insertOne(refreshToken);

        return {
            ...refreshToken,
            _id: result.insertedId,
        };
    }
}
