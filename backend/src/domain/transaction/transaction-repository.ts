import { Transaction } from './transaction-types';
import { Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

export interface TransactionRepository {
    create: (transaction: Transaction) => Promise<Result<void, Error>>;
    findManyByUserId: (userId: string) => Promise<Result<Transaction[], Error>>;
    findById: (id: string) => Promise<Result<Transaction, Error | NotFoundError>>;
    save: (transaction: Transaction) => Promise<Result<void, Error | NotFoundError>>;
    delete: (transaction: Transaction) => Promise<Result<void, Error | NotFoundError>>;
}
