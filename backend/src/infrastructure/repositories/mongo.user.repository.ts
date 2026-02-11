import { Collection, ObjectId } from 'mongodb';
import type { UserRepository } from '../../domain/repositories/user.repository.js';
import type { User } from '../../domain/entities/user.js';
import type { UserDocument } from '../types/mongo.user.document.js';
import { toUser, toUserDocument } from '../mappers/mongo.user.mapper.js';

export class MongoUserRepository implements UserRepository {
    constructor(private userCollection: Collection<UserDocument>) {}

    create = async (user: User): Promise<void> => {
        const document = toUserDocument(user);

        await this.userCollection.insertOne(document);
    };

    findById = async (id: string): Promise<User | null> => {
        const document = await this.userCollection.findOne({ _id: new ObjectId(id) });

        return document ? toUser(document) : null;
    };

    findByEmail = async (email: string): Promise<User | null> => {
        const document = await this.userCollection.findOne({ email });

        return document ? toUser(document) : null;
    };

    save = async (user: User): Promise<void> => {
        const { _id, ...rest } = toUserDocument(user);

        await this.userCollection.updateOne({ _id }, { $set: rest });
    };
}
