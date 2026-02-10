import { Collection, ObjectId } from 'mongodb';
import type { RefreshTokenRepository } from '../../../domain/repositories/refresh-token.repository.js';
import type { RefreshToken } from '../../../domain/entities/refresh-token.js';

type RefreshTokenDocument = Readonly<{
    _id: ObjectId;
    userId: ObjectId;
    value: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}>;

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshTokenDocument>) {}

    private toDocument = (refreshToken: RefreshToken): RefreshTokenDocument => {
        return {
            _id: new ObjectId(refreshToken.id),
            userId: new ObjectId(refreshToken.userId),
            value: refreshToken.value,
            expiresAt: refreshToken.expiresAt,
            createdAt: refreshToken.createdAt,
            updatedAt: refreshToken.updatedAt,
        };
    };

    private toDomain = (document: RefreshTokenDocument): RefreshToken => {
        return {
            id: document._id.toString(),
            userId: document.userId.toString(),
            value: document.value,
            expiresAt: document.expiresAt,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
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
