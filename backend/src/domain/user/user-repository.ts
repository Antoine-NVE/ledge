import { User } from './user-types';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { Result } from '../../core/types/result';

export interface UserRepository {
    create: (user: User) => Promise<Result<void, ConflictError | Error>>;
    findById: (id: string) => Promise<Result<User, Error | NotFoundError>>;
    findByEmail: (email: string) => Promise<Result<User, Error | NotFoundError>>;
    save: (user: User) => Promise<Result<void, Error | NotFoundError>>;
}
