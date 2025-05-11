import { Model, model, Schema, Types } from 'mongoose';

export interface User {
    email: string;
    password: string;
    transactions: Types.ObjectId[];
}

export type UserDocument = User & {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
};

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minlength: 8,
            maxlength: 100,
            validate: {
                validator: (password: string) => {
                    const hasUpperCase = /[A-Z]/.test(password);
                    const hasLowerCase = /[a-z]/.test(password);
                    const hasNumber = /\d/.test(password);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
                },
                message:
                    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
        },
        transactions: {
            type: [{ type: Types.ObjectId, ref: 'Transaction' }],
            default: [],
            required: true,
        },
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
        versionKey: false, // Disable the __v field
    }
);

const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);

export default UserModel;
