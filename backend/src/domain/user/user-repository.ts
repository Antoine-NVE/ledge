import { NewUser, User } from './user-types';
import { ResultAsync } from 'neverthrow';
import { ConflictError } from '../../core/errors/conflict-error';
import { NotFoundError } from '../../core/errors/not-found-error';

export interface UserRepository {
    create: (newUser: NewUser) => ResultAsync<User, ConflictError | Error>;
    findById: (id: string) => ResultAsync<User, NotFoundError | Error>;
    findByEmail: (email: string) => ResultAsync<User, NotFoundError | Error>;
    save: (user: User) => ResultAsync<void, Error>;
}
