import { Types } from 'mongoose';
import { Transaction, TransactionDocument } from '../models/Transaction';
import { UserDocument } from '../models/User';
import { TransactionRepository } from '../repositories/TransactionRepository';

export class TransactionService {
    constructor(private transactionRepository: TransactionRepository) {}

    async create(data: Transaction): Promise<TransactionDocument> {
        return await this.transactionRepository.create(data);
    }

    async findByUser(user: UserDocument): Promise<TransactionDocument[]> {
        return await this.transactionRepository.findByUser(user);
    }

    async updateFromDocument(transaction: TransactionDocument, data: Partial<Transaction>) {
        return await this.transactionRepository.updateFromDocument(transaction, data);
    }

    async delete(id: Types.ObjectId): Promise<TransactionDocument | null> {
        return await this.transactionRepository.delete(id);
    }
}
