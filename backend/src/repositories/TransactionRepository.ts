import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../models/Transaction';
import { UserDocument } from '../models/User';

export class TransactionRepository {
    constructor(private transactionModel: Model<TransactionDocument>) {}

    async create(data: Partial<Transaction>): Promise<TransactionDocument> {
        return await this.transactionModel.create(data);
    }

    async findById(id: Types.ObjectId): Promise<TransactionDocument | null> {
        return await this.transactionModel.findById(id);
    }

    async findByUser(user: UserDocument): Promise<TransactionDocument[]> {
        return await this.transactionModel.find({ user });
    }

    async updateFromDocument(
        transaction: TransactionDocument,
        data: Partial<Transaction>,
    ): Promise<TransactionDocument> {
        if (data.month !== undefined) transaction.month = data.month;
        if (data.isIncome !== undefined) transaction.isIncome = data.isIncome;
        if (data.isRecurring !== undefined) transaction.isRecurring = data.isRecurring;
        if (data.name !== undefined) transaction.name = data.name;
        if (data.value !== undefined) transaction.value = data.value;

        return await transaction.save();
    }

    async delete(id: Types.ObjectId): Promise<TransactionDocument | null> {
        return await this.transactionModel.findByIdAndDelete(id);
    }
}
