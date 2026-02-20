import { Collection } from 'mongodb';
import type { RefreshTokenRepository } from '../../domain/repositories/refresh-token.repository.js';
import type { RefreshToken } from '../../domain/entities/refresh-token.js';
import type { RefreshTokenDocument } from '../types/mongo.refresh-token.document.js';
import { toRefreshToken, toRefreshTokenDocument } from '../mappers/mongo.refresh-token.mapper.js';

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshTokenDocument>) {}

    create = async (refreshToken: RefreshToken): Promise<void> => {
        const document = toRefreshTokenDocument(refreshToken);

        await this.refreshTokenCollection.insertOne(document);
    };

    findByValue = async (value: string): Promise<RefreshToken | null> => {
        const document = await this.refreshTokenCollection.findOne({ value });

        return document ? toRefreshToken(document) : null;
    };

    save = async (refreshToken: RefreshToken): Promise<void> => {
        const { _id, ...rest } = toRefreshTokenDocument(refreshToken);

        await this.refreshTokenCollection.updateOne({ _id }, { $set: rest });
    };

    delete = async (refreshToken: RefreshToken): Promise<void> => {
        const { _id } = toRefreshTokenDocument(refreshToken);

        await this.refreshTokenCollection.deleteOne({ _id });
    };
}
