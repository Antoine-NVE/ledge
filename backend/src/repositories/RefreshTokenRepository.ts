import { DeleteResult, Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument } from '../models/RefreshToken';
import { UserDocument } from '../models/User';

export class RefreshTokenRepository {
    constructor(private refreshTokenModel: Model<RefreshTokenDocument>) {}

    async create(data: Partial<RefreshToken>): Promise<RefreshTokenDocument> {
        return await this.refreshTokenModel.create(data);
    }

    async findByToken(token: string): Promise<RefreshTokenDocument | null> {
        return await this.refreshTokenModel.findOne({ token });
    }

    async updateFromDocument(
        refreshToken: RefreshTokenDocument,
        data: Partial<RefreshToken>,
    ): Promise<RefreshTokenDocument> {
        Object.assign(refreshToken, data);
        return await refreshToken.save();
    }

    async deleteByToken(token: string): Promise<DeleteResult> {
        return await this.refreshTokenModel.deleteOne({ token });
    }
}
