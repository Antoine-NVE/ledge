import {
    CreateInput,
    DeleteById,
    FindManyByUserId,
    TransactionService,
    UpdateInput,
} from '../../domain/transaction/transaction-service';

export class TransactionOrchestrator {
    constructor(private transactionService: TransactionService) {}

    create = async (data: CreateInput) => {
        return await this.transactionService.create(data);
    };

    findManyByUserId = async (data: FindManyByUserId) => {
        return await this.transactionService.findManyByUserId(data);
    };

    update = async (data: UpdateInput) => {
        return await this.transactionService.update(data);
    };

    deleteById = async (data: DeleteById) => {
        return await this.transactionService.deleteById(data);
    };
}
