import { Collection, MongoServerError, ObjectId } from 'mongodb';
import type { UserRepository } from '../../domain/user/user-repository.js';
import type { User } from '../../domain/user/user-types.js';

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

    create = async (user: User): Promise<void> => {
        // TODO: check for duplicate email
        const document = this.toDocument(user);

        await this.userCollection.insertOne(document);
    };

    findById = async (id: string): Promise<User | null> => {
        const document = await this.userCollection.findOne({ _id: new ObjectId(id) });

        return document ? this.toDomain(document) : null;
    };

    findByEmail = async (email: string): Promise<User | null> => {
        const document = await this.userCollection.findOne({ email });

        return document ? this.toDomain(document) : null;
    };

    save = async (user: User): Promise<void> => {
        const { _id, ...rest } = this.toDocument(user);

        await this.userCollection.updateOne({ _id }, { $set: rest });
    };
}
