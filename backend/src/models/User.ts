import { HydratedDocument, Model, model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

import { isEmailValid, isEmailUnique, isPasswordValid } from '../validators/user';

export interface User {
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserDocument = HydratedDocument<User>;

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            unique: true,
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
        },
        password: {
            type: String,
            select: false, // Do not include password in queries by default
            trim: true,
            required: [true, 'Password is required'],
            validate: {
                validator: isPasswordValid,
                message:
                    'Password must be between 8 and 100 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
        },
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
        versionKey: false, // Disable the __v field
    },
);

UserSchema.pre<UserDocument>('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error: unknown) {
        next(error instanceof Error ? error : new Error('Unknown error during hashing'));
    }
});

const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);

export default UserModel;
