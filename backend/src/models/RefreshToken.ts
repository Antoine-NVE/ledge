import { HydratedDocument, model, Schema, Types } from 'mongoose';

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
            required: [true, 'Token is required.'],
            unique: true,
            trim: true,
        },
        expiresAt: {
            type: Date,
            required: [true, 'Expiration date is required.'],
            default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            index: { expires: 0 },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required.'],
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
);

const RefreshTokenModel = model<RefreshTokenDocument>('RefreshToken', RefreshTokenSchema);

export default RefreshTokenModel;
