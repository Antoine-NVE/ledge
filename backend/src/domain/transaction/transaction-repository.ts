import type { Transaction } from './transaction-types.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Result } from '../../core/types/result.js';

export interface TransactionRepository {
    create: (transaction: Transaction) => Promise<Result<void, Error>>;
    findManyByUserId: (userId: string) => Promise<Result<Transaction[], Error>>;
    getByIdAndUserId: (id: string, userId: string) => Promise<Result<Transaction, Error | NotFoundError>>;
    save: (transaction: Transaction) => Promise<Result<void, Error | NotFoundError>>;
    findByIdAndUserIdAndDelete: (id: string, userId: string) => Promise<Result<Transaction | null, Error>>;
}
