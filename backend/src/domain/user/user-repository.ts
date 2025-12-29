import type { User } from './user-types.js';
import { ConflictError } from '../../core/errors/conflict-error.js';
import { NotFoundError } from '../../core/errors/not-found-error.js';
import type { Result } from '../../core/types/result.js';

export interface UserRepository {
    create: (user: User) => Promise<Result<void, ConflictError | Error>>;
    findById: (id: string) => Promise<Result<User | null, Error>>;
    findByEmail: (email: string) => Promise<Result<User | null, Error>>;
    save: (user: User) => Promise<Result<void, Error | NotFoundError>>;
}
