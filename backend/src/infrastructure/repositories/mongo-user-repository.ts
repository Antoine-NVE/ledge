import { Collection, MongoServerError, ObjectId } from 'mongodb';
import { UserRepository } from '../../domain/user/user-repository';
import { NewUser, User } from '../../domain/user/user-types';
import { ConflictError } from '../../core/errors/conflict-error';
import { err, ok, ResultAsync } from 'neverthrow';
import { NotFoundError } from '../../core/errors/not-found-error';

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

    create = ({
        email,
        passwordHash,
        isEmailVerified,
        createdAt,
    }: NewUser): ResultAsync<User, ConflictError | Error> => {
        const document: UserDocument = {
            _id: new ObjectId(),
            email,
            passwordHash,
            isEmailVerified,
            createdAt,
        };

        return ResultAsync.fromPromise(
            this.userCollection.insertOne(document),
            (err: unknown) => {
                if (err instanceof MongoServerError && err.code === 11000) {
                    return new ConflictError({
                        message: 'Email already in use',
                    });
                }
                return err instanceof Error ? err : new Error('Unknown error');
            },
        ).map(() => {
            return this.toDomain(document);
        });
    };

    findById = (id: string): ResultAsync<User, NotFoundError | Error> => {
        return ResultAsync.fromPromise(
            this.userCollection.findOne({ _id: new ObjectId(id) }),
            (err: unknown) => {
                return err instanceof Error ? err : new Error('Unknown error');
            },
        ).andThen((document) => {
            if (!document) {
                return err(new NotFoundError({ message: 'User not found' }));
            }
            return ok(this.toDomain(document));
        });
    };

    findByEmail = (email: string): ResultAsync<User, NotFoundError | Error> => {
        return ResultAsync.fromPromise(
            this.userCollection.findOne({ email }),
            (err: unknown) => {
                return err instanceof Error ? err : new Error('Unknown error');
            },
        ).andThen((document) => {
            if (!document) {
                return err(new NotFoundError({ message: 'User not found' }));
            }
            return ok(this.toDomain(document));
        });
    };

    save = ({
        id,
        isEmailVerified,
        updatedAt,
    }: User): ResultAsync<void, Error> => {
        return ResultAsync.fromPromise(
            this.userCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        isEmailVerified,
                        updatedAt,
                    },
                },
            ),
            (err: unknown) => {
                return err instanceof Error ? err : new Error('Unknown error');
            },
        ).map(() => {
            return undefined;
        });
    };
}
