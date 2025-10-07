import { Collection, Document, InsertOneResult, ObjectId, OptionalId, WithId } from 'mongodb';
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
        return await this.userCollection.findOne({ email });
    };

    findOneById = async (id: ObjectId): Promise<User | null> => {
        return await this.userCollection.findOne({ _id: id });
    };

    updateOne = async (id: ObjectId, partialUserData: Partial<UserData>) => {
        return await this.userCollection.updateOne({ _id: id }, { $set: partialUserData });
    };
}
