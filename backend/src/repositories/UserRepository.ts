import { Collection, Document, InsertOneResult, ObjectId, OptionalId, WithId } from 'mongodb';
import { PartialUserData, User, UserData } from '../types/userType';

export class UserRepository {
    constructor(private userCollection: Collection<OptionalId<User>>) {}

    insertOne = async (userData: UserData): Promise<User> => {
        const result = await this.userCollection.insertOne(userData);

        return {
            _id: result.insertedId,
            ...userData,
        };
    };

    findOne = async <K extends keyof User>(key: K, value: User[K]): Promise<User | null> => {
        return await this.userCollection.findOne({ [key]: value });
    };

    updateOne = async (id: ObjectId, partialUserData: PartialUserData): Promise<void> => {
        await this.userCollection.updateOne({ _id: id }, { $set: partialUserData });
    };
}
