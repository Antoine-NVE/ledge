import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../models/Transaction';

export class TransactionRepository {
    constructor(private transactionModel: Model<TransactionDocument>) {}

    async create(data: Partial<Transaction>): Promise<TransactionDocument> {
        return await this.transactionModel.create(data);
    }

    async findById(id: Types.ObjectId): Promise<TransactionDocument | null> {
        return await this.transactionModel.findById(id);
    }

    async update(id: Types.ObjectId, data: Partial<Transaction>): Promise<TransactionDocument | null> {
        // We do not use findByIdAndUpdate to ensure that pre-save hooks are executed
        const transaction = await this.transactionModel.findById(id);
        if (!transaction) return null;
        Object.assign(transaction, data);
        return await transaction.save();
    }

    async delete(id: Types.ObjectId): Promise<TransactionDocument | null> {
        return await this.transactionModel.findByIdAndDelete(id);
    }
}
