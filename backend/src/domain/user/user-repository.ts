import { User } from './user-types';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { Result } from '../../core/types/result';

export interface UserRepository {
    create: (user: User) => Promise<Result<void, ConflictError | Error>>;
    findById: (id: string) => Promise<Result<User | null, Error>>;
    findByEmail: (email: string) => Promise<Result<User | null, Error>>;
    save: (user: User) => Promise<Result<void, Error | NotFoundError>>;
}
