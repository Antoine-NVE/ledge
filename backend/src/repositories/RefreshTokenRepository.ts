import { DeleteResult, Model, Types } from 'mongoose';
import { RefreshToken, RefreshTokenDocument, RefreshTokenPopulatedDocument } from '../models/RefreshToken';
import { UserDocument } from '../models/User';

export default class RefreshTokenRepository {
    constructor(private refreshTokenModel: Model<RefreshTokenDocument>) {}

    async create(data: Partial<RefreshToken>): Promise<RefreshTokenDocument> {
        return await this.refreshTokenModel.create(data);
    }

    async findByTokenAndPopulate(token: string): Promise<RefreshTokenPopulatedDocument | null> {
        return await this.refreshTokenModel.findOne({ token }).populate<{ user: UserDocument }>('user');
    }

    async updateFromPopulatedDocument(
        refreshTokenPopulated: RefreshTokenPopulatedDocument,
        data: Partial<RefreshToken>,
    ): Promise<RefreshTokenPopulatedDocument> {
        Object.assign(refreshTokenPopulated, data);

        // The return type of save() is a bit off when using populated documents, so we cast it
        return (await refreshTokenPopulated.save()) as unknown as RefreshTokenPopulatedDocument;
    }

    async deleteByToken(token: string): Promise<DeleteResult> {
        return await this.refreshTokenModel.deleteOne({ token });
    }
}
