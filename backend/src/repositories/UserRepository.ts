import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../models/User';

export class UserRepository {
    constructor(private userModel: Model<UserDocument>) {}

    async create(data: Partial<User>): Promise<UserDocument> {
        return await this.userModel.create(data);
    }

    async findById(id: Types.ObjectId): Promise<UserDocument | null> {
        return await this.userModel.findById(id);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return await this.userModel.findOne({ email });
    }

    async updateFromDocument(user: UserDocument, data: Partial<User>): Promise<UserDocument> {
        Object.assign(user, data);
        return await user.save();
    }

    async delete(id: Types.ObjectId): Promise<UserDocument | null> {
        return await this.userModel.findByIdAndDelete(id);
    }
}
