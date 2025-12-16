import { Collection, MongoServerError, ObjectId } from 'mongodb';
import { UserRepository } from '../../domain/user/user-repository';
import { NewUser, User } from '../../domain/user/user-types';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { fail, ok, Result } from '../../core/result';

type UserDocument = {
    _id: ObjectId;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt?: Date;
};

export class MongoUserRepository implements UserRepository {
    constructor(private userCollection: Collection<UserDocument>) {}

    private toDomain({
        _id,
        email,
        passwordHash,
        isEmailVerified,
        createdAt,
        updatedAt,
    }: UserDocument): User {
        return {
            id: _id.toString(),
            email,
            passwordHash,
            isEmailVerified,
            createdAt,
            updatedAt,
        };
    }

    create = async ({
        email,
        passwordHash,
        isEmailVerified,
        createdAt,
    }: NewUser): Promise<Result<User, ConflictError | Error>> => {
        const document: UserDocument = {
            _id: new ObjectId(),
            email,
            passwordHash,
            isEmailVerified,
            createdAt,
        };

        try {
            await this.userCollection.insertOne(document);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            if (err instanceof MongoServerError && err.code === 11000) {
                return fail(
                    new ConflictError({
                        message: 'Email already in use',
                    }),
                );
            }
            return fail(
                err instanceof Error ? err : new Error('Unknown error'),
            );
        }
    };

    findById = async (
        id: string,
    ): Promise<Result<User, NotFoundError | Error>> => {
        try {
            const document = await this.userCollection.findOne({
                _id: new ObjectId(id),
            });
            if (!document) {
                return fail(new NotFoundError({ message: 'User not found' }));
            }
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(
                err instanceof Error ? err : new Error('Unknown error'),
            );
        }
    };

    findByEmail = async (
        email: string,
    ): Promise<Result<User, NotFoundError | Error>> => {
        try {
            const document = await this.userCollection.findOne({ email });
            if (!document) {
                return fail(new NotFoundError({ message: 'User not found' }));
            }
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(
                err instanceof Error ? err : new Error('Unknown error'),
            );
        }
    };

    save = async ({
        id,
        isEmailVerified,
        updatedAt,
    }: User): Promise<Result<void, NotFoundError | Error>> => {
        try {
            const document = await this.userCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        isEmailVerified,
                        updatedAt,
                    },
                },
            );
            if (!document) {
                return fail(new NotFoundError({ message: 'User not found' }));
            }
            return ok(undefined);
        } catch (err: unknown) {
            return fail(
                err instanceof Error ? err : new Error('Unknown error'),
            );
        }
    };
}
