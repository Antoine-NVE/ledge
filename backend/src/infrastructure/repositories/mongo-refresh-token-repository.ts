import { Collection, ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { fail, ok, Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

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

    findByValue = async (value: string): Promise<Result<RefreshToken, Error | NotFoundError>> => {
        try {
            const document = await this.refreshTokenCollection.findOne({ value });
            if (!document) return fail(new NotFoundError({ message: 'Refresh token not found' }));
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

    delete = async (refreshToken: RefreshToken): Promise<Result<void, Error | NotFoundError>> => {
        const { _id } = this.toDocument(refreshToken);
        try {
            const result = await this.refreshTokenCollection.deleteOne({ _id });
            if (result.deletedCount === 0) return fail(new NotFoundError({ message: 'Refresh token not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
