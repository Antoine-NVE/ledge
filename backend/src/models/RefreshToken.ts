import { HydratedDocument, model, Schema, Types } from 'mongoose';
import { UserDocument } from './User';

export interface RefreshToken {
    token: string;
    expiresAt: Date;
    user: Types.ObjectId;
}

export type RefreshTokenDocument = HydratedDocument<RefreshToken> & {
    createdAt: Date;
    updatedAt: Date;
};

const RefreshTokenSchema = new Schema<RefreshTokenDocument>(
    {
        token: {
            type: String,
            trim: true,
            required: [true, 'Token is required'],
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiration date is required'],
            index: { expires: 0 },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
);

const RefreshTokenModel = model<RefreshTokenDocument>('RefreshToken', RefreshTokenSchema);

export default RefreshTokenModel;
