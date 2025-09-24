import { HydratedDocument, Model, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import { isEmailValid, isEmailUnique, isPasswordValid, isPasswordTrimmed } from '../validators/user';

export interface User {
    email: string;
    password: string;
    isEmailVerified: boolean;
    emailVerificationCooldownExpiresAt: Date | null;
}

export type UserDocument = HydratedDocument<User> & {
    createdAt: Date;
    updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email is required'],
            validate: [
                {
                    validator: isEmailValid,
                    message: 'Invalid email format',
                },
                {
                    validator: isEmailUnique,
                    message: 'Email already exists',
                },
            ],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            validate: [
                {
                    // We use a validator instead of 'trim: true' to provide a custom error message
                    // Avoid unwanted behavior where leading/trailing spaces are removed without notifying the user
                    validator: isPasswordTrimmed,
                    message: 'Password cannot start or end with whitespace',
                },
                {
                    validator: isPasswordValid,
                    message:
                        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character',
                },
            ],
        },
        isEmailVerified: {
            type: Boolean,
            required: [true, 'You must specify if the email is verified or not'],
        },
        emailVerificationCooldownExpiresAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        optimisticConcurrency: true,
    },
);

UserSchema.pre<UserDocument>('save', async function () {
    if (!this.isModified('password')) return;

    this.password = await bcrypt.hash(this.password, 10);
});

const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);

export default UserModel;
