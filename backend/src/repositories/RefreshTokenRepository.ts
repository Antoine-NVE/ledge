import { Collection, ObjectId, WithId } from 'mongodb';
import { DeleteResult, Model, Types } from 'mongoose';
import { RefreshToken } from '../types/refreshTokenType';

export class RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshToken>) {}

    async insertOne(refreshToken: RefreshToken): Promise<WithId<RefreshToken>> {
        const result = await this.refreshTokenCollection.insertOne(refreshToken);

        return {
            _id: result.insertedId,
            ...refreshToken,
        };
    }

    async findOneByToken(token: string): Promise<WithId<RefreshToken> | null> {
        return this.refreshTokenCollection.findOne({ token });
    }

    async findOneByIdAndUpdate(
        id: ObjectId,
        data: Partial<RefreshToken>,
    ): Promise<WithId<RefreshToken> | null> {
        return this.refreshTokenCollection.findOneAndUpdate(
            { _id: id },
            { $set: data },
            { returnDocument: 'after' },
        );
    }
}
