import { Collection, Document, InsertOneResult, ObjectId, OptionalId, WithId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { User, UserData } from '../types/userType';

export class UserRepository {
    constructor(private userCollection: Collection<UserData>) {}

    async insertOne(userData: UserData): Promise<User> {
        const result = await this.userCollection.insertOne(userData);

        return {
            _id: result.insertedId,
            ...userData,
        };
    }

    async findOneByEmail(email: string): Promise<User | null> {
        return this.userCollection.findOne({ email });
    }
}
