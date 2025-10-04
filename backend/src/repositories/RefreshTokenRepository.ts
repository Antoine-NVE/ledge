import { Collection, ObjectId, OptionalId, WithId } from 'mongodb';
import { DeleteResult, Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenData } from '../types/refreshTokenType';

export class RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshTokenData>) {}

    async insertOne(refreshTokenData: RefreshTokenData): Promise<RefreshToken> {
        const result = await this.refreshTokenCollection.insertOne(refreshTokenData);

        return {
            _id: result.insertedId,
            ...refreshTokenData,
        };
    }

    async findOneByToken(token: string): Promise<RefreshToken | null> {
        return this.refreshTokenCollection.findOne({ token });
    }

    async findOneByIdAndUpdate(
        id: ObjectId,
        partialRefreshTokenData: Partial<RefreshTokenData>,
    ): Promise<RefreshToken | null> {
        return this.refreshTokenCollection.findOneAndUpdate(
            { _id: id },
            { $set: partialRefreshTokenData },
            { returnDocument: 'after' },
        );
    }
}
