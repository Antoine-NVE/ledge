import { Collection, ObjectId } from 'mongodb';
import { UserRepository } from '../../domain/user/user-repository';
import { NewUser, User } from '../../domain/user/user-types';

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
    }: NewUser) => {
        const document: UserDocument = {
            _id: new ObjectId(),
            email,
            passwordHash,
            isEmailVerified,
            createdAt,
        };
        await this.userCollection.insertOne(document);
        return this.toDomain(document);
    };

    findById = async (id: string) => {
        const document = await this.userCollection.findOne({
            _id: new ObjectId(id),
        });
        return document ? this.toDomain(document) : null;
    };

    findByEmail = async (email: string) => {
        const document = await this.userCollection.findOne({
            email,
        });
        return document ? this.toDomain(document) : null;
    };

    save = async ({ id, isEmailVerified, updatedAt }: User) => {
        await this.userCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    isEmailVerified,
                    updatedAt,
                },
            },
        );
    };
}
