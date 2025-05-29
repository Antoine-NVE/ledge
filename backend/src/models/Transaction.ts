import { HydratedDocument, Schema, Types, model } from 'mongoose';

export interface Transaction {
    month: string;
    isIncome: boolean;
    isFixed: boolean;
    name: string;
    value: number;
    user: Types.ObjectId;
}

export type TransactionDocument = HydratedDocument<Transaction> & {
    createdAt: Date;
    updatedAt: Date;
};

const TransactionSchema = new Schema<TransactionDocument>(
    {
        month: {
            type: String,
            required: [true, 'Month is required.'],
            match: [/^\d{4}-(0[1-9]|1[0-2])$/, 'Month must be in YYYY-MM format.'],
        },
        isIncome: {
            type: Boolean,
            required: [true, 'Please specify if this is money coming in.'],
        },
        isFixed: {
            type: Boolean,
            required: [true, 'Please specify if this is a regular (recurring) transaction.'],
        },
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true,
            minlength: [1, 'Name must be at least 1 character.'],
            maxlength: [100, 'Name must be at most 100 characters.'],
        },
        value: {
            type: Number,
            required: [true, 'Value is required.'],
            min: [1, 'Value must be at least 1 centime.'],
            max: [100000000, 'Value must be at most 100,000,000 centimes (1,000,000 euros).'],
            validate: {
                validator: Number.isInteger,
                message: 'Value must be an integer (in centimes).',
            },
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

const TransactionModel = model<TransactionDocument>('Transaction', TransactionSchema);

export default TransactionModel;
