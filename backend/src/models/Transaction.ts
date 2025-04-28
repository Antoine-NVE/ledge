import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
    month: string;
    income: boolean;
    fixed: boolean;
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
        income: { type: Boolean, required: true },
        fixed: { type: Boolean, required: true },
        name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
        value: { type: Number, required: true, min: 0, max: 1000000 },
    },
    {
        timestamps: true, // Automatically create createdAt and updatedAt fields
        versionKey: false, // Disable the __v field
    }
);

const TransactionModel = model<ITransaction>('Transaction', TransactionSchema);

export default TransactionModel;
