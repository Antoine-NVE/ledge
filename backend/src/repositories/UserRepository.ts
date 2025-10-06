import { Collection, Document, InsertOneResult, ObjectId, OptionalId, WithId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { User, UserData } from '../types/userType';

export class UserRepository {
    constructor(private userCollection: Collection<UserData>) {}

    insertOne = async (userData: UserData): Promise<User> => {
        const result = await this.userCollection.insertOne(userData);

        return {
            _id: result.insertedId,
            ...userData,
        };
    };

    findOneByEmail = async (email: string): Promise<User | null> => {
        return this.userCollection.findOne({ email });
    };

    findOneById = async (id: ObjectId): Promise<User | null> => {
        return this.userCollection.findOne({ _id: id });
    };
}
