import { NewUser, User } from './user-types';

export interface UserRepository {
    create: (newUser: NewUser) => Promise<User>;
    findById: (id: string) => Promise<User | null>;
    findByEmail: (email: string) => Promise<User | null>;
    save: (user: User) => Promise<void>;
}
