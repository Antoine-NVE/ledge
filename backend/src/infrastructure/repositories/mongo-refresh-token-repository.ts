import { Collection, ObjectId } from 'mongodb';
import { RefreshTokenRepository } from '../../domain/refresh-token/refresh-token-repository';
import { NewRefreshToken, RefreshToken } from '../../domain/refresh-token/refresh-token-types';
import { fail, ok, Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

type RefreshTokenDocument = {
    _id: ObjectId;
    userId: ObjectId;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt?: Date;
};

export class MongoRefreshTokenRepository implements RefreshTokenRepository {
    constructor(private refreshTokenCollection: Collection<RefreshTokenDocument>) {}

    private toDomain({ _id, userId, token, expiresAt, createdAt, updatedAt }: RefreshTokenDocument): RefreshToken {
        return {
            id: _id.toString(),
            userId: userId.toString(),
            token,
            expiresAt,
            createdAt,
            updatedAt,
        };
    }

    create = async ({ userId, token, expiresAt, createdAt }: NewRefreshToken): Promise<Result<RefreshToken, Error>> => {
        const document: RefreshTokenDocument = {
            _id: new ObjectId(),
            userId: new ObjectId(userId),
            token,
            expiresAt,
            createdAt,
        };
        try {
            await this.refreshTokenCollection.insertOne(document);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findByToken = async (token: string): Promise<Result<RefreshToken, NotFoundError | Error>> => {
        try {
            const document = await this.refreshTokenCollection.findOne({
                token,
            });
            if (!document) {
                return fail(new NotFoundError({ message: 'Refresh token not found' }));
            }
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    save = async ({ id, token, expiresAt, updatedAt }: RefreshToken): Promise<Result<void, NotFoundError | Error>> => {
        try {
            const document = await this.refreshTokenCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        token,
                        expiresAt,
                        updatedAt,
                    },
                },
            );
            if (!document) {
                return fail(new NotFoundError({ message: 'Refresh token not found' }));
            }
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    deleteByToken = async (token: string): Promise<Result<RefreshToken, NotFoundError | Error>> => {
        try {
            const document = await this.refreshTokenCollection.findOneAndDelete({
                token,
            });
            if (!document) {
                return fail(new NotFoundError({ message: 'Refresh token not found' }));
            }
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
