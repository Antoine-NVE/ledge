import { Collection, Document, InsertOneResult, ObjectId, WithId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { User } from '../types/userType';

export class UserRepository {
    constructor(private userCollection: Collection<User>) {}

    async insert(user: User): Promise<WithId<User>> {
        const result = await this.userCollection.insertOne(user);

        return {
            _id: result.insertedId,
            ...user,
        };
    }

    async findOneByEmail(email: string): Promise<WithId<User> | null> {
        return this.userCollection.findOne({ email });
    }
}
