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

const validatePassword = (password: string): boolean => {
    const isValidLength = password.length >= 8 && password.length <= 100;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return isValidLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
};

const UserSchema = new Schema<UserDocument>(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: [true, 'Email is required'],
            unique: [true, 'Email already exists'],
            match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address'],
        },
        password: {
            type: String,
            trim: true,
            required: [true, 'Password is required'],
            validate: {
                validator: validatePassword,
                message:
                    'Password must be between 8 and 100 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            },
        },
        transactions: {
            type: [{ type: Types.ObjectId, ref: 'Transaction' }],
            default: [],
        },
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
        versionKey: false, // Disable the __v field
    }
);

const UserModel: Model<UserDocument> = model<UserDocument>('User', UserSchema);

export default UserModel;
