import { ObjectId } from 'mongodb';
import {
    Transaction,
    TransactionData,
    UpdateTransactionData,
} from '../../domain/transaction/transaction-types';
import { TransactionService } from '../../domain/transaction/transaction-service';

export class TransactionOrchestrator {
    constructor(private transactionService: TransactionService) {}

    create = async (data: TransactionData): Promise<Transaction> => {
        return await this.transactionService.create(data);
    };

    readAll = async (userId: ObjectId): Promise<Transaction[]> => {
        return await this.transactionService.readAll(userId);
    };

    update = async (
        transaction: Transaction,
        data: UpdateTransactionData,
    ): Promise<Transaction> => {
        return await this.transactionService.update(transaction, data);
    };

    delete = async (id: ObjectId): Promise<void> => {
        await this.transactionService.delete(id);
    };
}
