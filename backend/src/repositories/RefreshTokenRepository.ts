import { Collection, ObjectId, OptionalId, WithId } from 'mongodb';
import { DeleteResult, Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenData } from '../types/refreshTokenType';

export class RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshTokenData>) {}

    insertOne = async (refreshTokenData: RefreshTokenData): Promise<RefreshToken> => {
        const result = await this.refreshTokenCollection.insertOne(refreshTokenData);

        return {
            _id: result.insertedId,
            ...refreshTokenData,
        };
    };

    findOneByToken = async (token: string): Promise<RefreshToken | null> => {
        return this.refreshTokenCollection.findOne({ token });
    };

    findOneByIdAndUpdate = async (
        id: ObjectId,
        partialRefreshTokenData: Partial<RefreshTokenData>,
    ): Promise<RefreshToken | null> => {
        return this.refreshTokenCollection.findOneAndUpdate(
            { _id: id },
            { $set: partialRefreshTokenData },
            { returnDocument: 'after' },
        );
    };

    deleteOneByToken = async (token: string): Promise<void> => {
        this.refreshTokenCollection.deleteOne({ token });
    };
}
