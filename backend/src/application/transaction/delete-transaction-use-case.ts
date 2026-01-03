import type { TransactionRepository } from '../../domain/transaction/transaction-repository.js';
import type { Result } from '../../core/types/result.js';
import { fail, ok } from '../../core/utils/result.js';

type Input = {
    transactionId: string;
    userId: string;
};

type Output = void;

export class DeleteTransactionUseCase {
    constructor(private transactionRepository: TransactionRepository) {}

    execute = async ({ transactionId, userId }: Input): Promise<Result<Output, Error>> => {
        const result = await this.transactionRepository.findByIdAndUserIdAndDelete(transactionId, userId);
        if (!result.success) return fail(result.error);

        return ok(undefined);
    };
}
