import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
    month: string;
    isIncome: boolean;
    isFixed: boolean;
    name: string;
    value: number;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        month: {
            type: String,
            required: true,
            match: /^\d{4}-(0[1-9]|1[0-2])$/, // 2025-04, 2025-12, etc.
        },
        isIncome: { type: Boolean, required: true },
        isFixed: { type: Boolean, required: true },
        name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
        value: { type: Number, required: true, min: 1, max: 1000000 },
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
        versionKey: false, // Disable the __v field
    }
);

const TransactionModel = model<ITransaction>('Transaction', TransactionSchema);

export default TransactionModel;
