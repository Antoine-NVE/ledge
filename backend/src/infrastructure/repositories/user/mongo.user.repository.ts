import { Collection, ObjectId } from 'mongodb';
import type { UserRepository } from '../../../domain/repositories/user.repository.js';
import type { User } from '../../../domain/entities/user.js';

type UserDocument = Readonly<{
    _id: ObjectId;
    email: string;
    passwordHash: string;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;

export class MongoUserRepository implements UserRepository {
    constructor(private userCollection: Collection<UserDocument>) {}

    private toDocument = (user: User): UserDocument => {
        return {
            _id: new ObjectId(user.id),
            email: user.email,
            passwordHash: user.passwordHash,
            isEmailVerified: user.isEmailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    };

    private toDomain = (document: UserDocument): User => {
        return {
            id: document._id.toString(),
            email: document.email,
            passwordHash: document.passwordHash,
            isEmailVerified: document.isEmailVerified,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        };
    };

    create = async (user: User): Promise<void> => {
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
