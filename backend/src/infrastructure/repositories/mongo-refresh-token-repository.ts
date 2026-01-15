import { Collection, ObjectId } from 'mongodb';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { RefreshToken } from '../../domain/refresh-token/refresh-token-types.js';

type RefreshTokenDocument = {
    _id: ObjectId;
    userId: ObjectId;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
};

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshTokenDocument>) {}

    private toDocument = ({ id, userId, ...rest }: RefreshToken): RefreshTokenDocument => {
        return {
            _id: new ObjectId(id),
            userId: new ObjectId(userId),
            ...rest,
        };
    };

    private toDomain = ({ _id, userId, ...rest }: RefreshTokenDocument): RefreshToken => {
        return {
            id: _id.toString(),
            userId: userId.toString(),
            ...rest,
        };
    };

    create = async (refreshToken: RefreshToken): Promise<void> => {
        const document = this.toDocument(refreshToken);

        await this.refreshTokenCollection.insertOne(document);
    };

    findByValue = async (value: string): Promise<RefreshToken | null> => {
        const document = await this.refreshTokenCollection.findOne({ value });

        return document ? this.toDomain(document) : null;
    };

    save = async (refreshToken: RefreshToken): Promise<void> => {
        const { _id, ...rest } = this.toDocument(refreshToken);

        await this.refreshTokenCollection.updateOne({ _id }, { $set: rest });
    };

    delete = async (refreshToken: RefreshToken): Promise<void> => {
        const { _id } = this.toDocument(refreshToken);

        await this.refreshTokenCollection.deleteOne({ _id });
    };
}
