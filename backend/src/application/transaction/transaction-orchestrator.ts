import { ObjectId } from 'mongodb';
import {
    Transaction,
    TransactionData,
    TransactionUpdateData,
} from '../../domain/transaction/transaction-types';
import { TransactionService } from '../../services/transaction-service';

export class TransactionOrchestrator {
    constructor(private transactionService: TransactionService) {}

    create = async (data: TransactionData): Promise<Transaction> => {
        return await this.transactionService.insertOne(data);
    };

    readAll = async (userId: ObjectId): Promise<Transaction[]> => {
        return await this.transactionService.findByUserId(userId);
    };

    update = async (
        transaction: Transaction,
        data: TransactionUpdateData,
    ): Promise<Transaction> => {
        return await this.transactionService.updateOne(transaction, data);
    };

    delete = async (id: ObjectId): Promise<void> => {
        return await this.transactionService.deleteOneById(id);
    };
}
