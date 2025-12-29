import { Collection, ObjectId } from 'mongodb';
import type { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository.js';
import type { RefreshToken } from '../../domain/refresh-token/refresh-token-types.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

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

    create = async (refreshToken: RefreshToken): Promise<Result<void, Error>> => {
        const document = this.toDocument(refreshToken);
        try {
            await this.refreshTokenCollection.insertOne(document);
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findByValueAndExpiresAfter = async (
        value: string,
        expiresAfter: Date,
    ): Promise<Result<RefreshToken | null, Error>> => {
        try {
            const document = await this.refreshTokenCollection.findOne({ value, expiresAt: { $gt: expiresAfter } });
            if (!document) return ok(null);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    save = async (refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>> => {
        const { _id, ...rest } = this.toDocument(refreshToken);
        try {
            const result = await this.refreshTokenCollection.updateOne({ _id }, { $set: rest });
            if (result.matchedCount === 0) return fail(new NotFoundError({ message: 'Refresh token not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findByValueAndDelete = async (value: string): Promise<Result<RefreshToken | null, Error>> => {
        try {
            const document = await this.refreshTokenCollection.findOneAndDelete({ value });
            if (!document) return ok(null);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
