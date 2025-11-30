import { Collection, ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import {
    NewRefreshToken,
    RefreshToken,
} from '../../domain/refresh-token/refresh-token-types';

type RefreshTokenDocument = {
    _id: ObjectId;
    userId: ObjectId;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt?: Date;
};

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
    constructor(
        private refreshTokenCollection: Collection<RefreshTokenDocument>,
    ) {}

    private toDomain({
        _id,
        userId,
        token,
        expiresAt,
        createdAt,
        updatedAt,
    }: RefreshTokenDocument): RefreshToken {
        return {
            id: _id.toString(),
            userId: userId.toString(),
            token,
            expiresAt,
            createdAt,
            updatedAt,
        };
    }

    create = async ({
        userId,
        token,
        expiresAt,
        createdAt,
        updatedAt,
    }: NewRefreshToken) => {
        const document: RefreshTokenDocument = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            token,
            expiresAt,
            createdAt,
            updatedAt,
        };
        await this.refreshTokenCollection.insertOne(document);
        return this.toDomain(document);
    };

    findByToken = async (token: string) => {
        const document = await this.refreshTokenCollection.findOne({
            token,
        });
        return document ? this.toDomain(document) : null;
    };

    save = async ({ id, token, expiresAt, updatedAt }: RefreshToken) => {
        await this.refreshTokenCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    token,
                    expiresAt,
                    updatedAt,
                },
            },
        );
    };

    deleteByToken = async (token: string) => {
        const document = await this.refreshTokenCollection.findOneAndDelete({
            token,
        });
        return document ? this.toDomain(document) : null;
    };
}
