import { NewTransaction, Transaction } from './transaction-types';
import { Result } from '../../core/result';
import { NotFoundError } from '../../core/errors/not-found-error';

export interface TransactionRepository {
    create: (newTransaction: NewTransaction) => Promise<Result<Transaction, Error>>;
    findManyByUserId: (userId: string) => Promise<Result<Transaction[], Error>>;
    findById: (id: string) => Promise<Result<Transaction, NotFoundError | Error>>;
    save: (transaction: Transaction) => Promise<Result<void, NotFoundError | Error>>;
    deleteById: (id: string) => Promise<Result<Transaction, NotFoundError | Error>>;
}
