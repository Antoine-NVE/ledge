import { Transaction } from './transaction-types';
import { NotFoundError } from '../../core/errors/not-found-error';
import { Result } from '../../core/types/result';

export interface TransactionRepository {
    create: (transaction: Transaction) => Promise<Result<void, Error>>;
    findManyByUserId: (userId: string) => Promise<Result<Transaction[], Error>>;
    getById: (id: string) => Promise<Result<Transaction, Error | NotFoundError>>;
    save: (transaction: Transaction) => Promise<Result<void, Error | NotFoundError>>;
    delete: (transaction: Transaction) => Promise<Result<void, Error | NotFoundError>>;
}
