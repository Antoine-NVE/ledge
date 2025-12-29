import { Collection, MongoServerError, ObjectId } from 'mongodb';
import type { UserRepository } from '../../domain/user/user-repository.js';
import type { User } from '../../domain/user/user-types.js';
import { ConflictError } from '../../core/errors/conflict-error.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';
import { ensureError } from '../../core/utils/error.js';

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
            return fail(ensureError(err));
        }
    };

    findById = async (id: string): Promise<Result<User | null, Error>> => {
        try {
            const document = await this.userCollection.findOne({ _id: new ObjectId(id) });
            if (!document) return ok(null);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    findByEmail = async (email: string): Promise<Result<User | null, Error>> => {
        try {
            const document = await this.userCollection.findOne({ email });
            if (!document) return ok(null);
            return ok(this.toDomain(document));
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };

    save = async (user: User): Promise<Result<void, Error | NotFoundError>> => {
        const { _id, ...rest } = this.toDocument(user);
        try {
            const result = await this.userCollection.updateOne({ _id }, { $set: rest });
            if (result.matchedCount === 0) return fail(new NotFoundError({ message: 'User not found' }));
            return ok(undefined);
        } catch (err: unknown) {
            return fail(ensureError(err));
        }
    };
}
