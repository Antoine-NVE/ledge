import { NewUser, User } from './user-types';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';
import { Result } from '../../core/result';

export interface UserRepository {
    create: (newUser: NewUser) => Promise<Result<User, ConflictError | Error>>;
    findById: (id: string) => Promise<Result<User, NotFoundError | Error>>;
    findByEmail: (
        email: string,
    ) => Promise<Result<User, NotFoundError | Error>>;
    save: (user: User) => Promise<Result<void, NotFoundError | Error>>;
}
