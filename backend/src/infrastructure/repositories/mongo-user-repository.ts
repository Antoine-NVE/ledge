import { Collection, MongoServerError, ObjectId } from 'mongodb';
import { UserRepository } from '../../domain/user/user-repository';
import { User } from '../../domain/user/user-types';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { Result } from '../../core/types/result';
import { fail, ok } from '../../core/utils/result';

type UserDocument = {
    _id: ObjectId;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export class MongoUserRepository implements UserRepository {
    constructor(private userCollection: Collection<UserDocument>) {}

    private toDocument = ({ id, ...rest }: User): UserDocument => {
        return {
            _id: new ObjectId(id),
            ...rest,
        };
    };

    private toDomain = ({ _id, ...rest }: UserDocument): User => {
        return {
            id: _id.toString(),
            ...rest,
        };
    };

    create = async (user: User): Promise<Result<void, ConflictError | Error>> => {
        const document = this.toDocument(user);
        try {
            await this.userCollection.insertOne(document);
            return ok(undefined);
        } catch (err: unknown) {
            if (err instanceof MongoServerError && err.code === 11000) {
                return fail(new ConflictError({ message: 'Email already in use' }));
            }
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findById = async (id: string): Promise<Result<User, Error | NotFoundError>> => {
        try {
            const document = await this.userCollection.findOne({ _id: new ObjectId(id) });
            if (!document) return fail(new NotFoundError({ message: 'User not found' }));
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    findByEmail = async (email: string): Promise<Result<User, Error | NotFoundError>> => {
        try {
            const document = await this.userCollection.findOne({ email });
            if (!document) return fail(new NotFoundError({ message: 'User not found' }));
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };

    save = async (user: User): Promise<Result<void, Error | NotFoundError>> => {
        const { _id, ...rest } = this.toDocument(user);
        try {
            const result = await this.userCollection.updateOne({ _id }, { $set: rest });
            if (result.matchedCount === 0) return fail(new NotFoundError({ message: 'User not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(err instanceof Error ? err : new Error('Unknown error'));
        }
    };
}
