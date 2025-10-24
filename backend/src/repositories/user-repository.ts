import { Collection } from 'mongodb';
import { User } from '../types/user-type';

export class UserRepository {
    constructor(private userCollection: Collection<User>) {}

    insertOne = async (user: User): Promise<void> => {
        await this.userCollection.insertOne(user);
    };

    findOne = async <K extends keyof User>(
        key: K,
        value: User[K],
    ): Promise<User | null> => {
        return await this.userCollection.findOne({ [key]: value });
    };

    updateOne = async (user: User): Promise<void> => {
        const { _id, ...rest } = user;
        await this.userCollection.updateOne({ _id }, { $set: rest });
    };
}
