import { Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../models/RefreshToken';

export default class RefreshTokenRepository {
    constructor(private refreshTokenModel: Model<RefreshTokenDocument>) {}

    async create(data: Partial<RefreshToken>): Promise<RefreshTokenDocument> {
        return await this.refreshTokenModel.create(data);
    }

    async findByToken(token: string): Promise<RefreshTokenDocument | null> {
        return await this.refreshTokenModel.findOne({ token });
    }

    async delete(id: Types.ObjectId): Promise<RefreshTokenDocument | null> {
        return await this.refreshTokenModel.findByIdAndDelete(id);
    }
}
