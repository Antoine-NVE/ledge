import type { User } from '../entities/user.js';

export interface UserRepository {
    create: (user: User) => Promise<void>;
    findById: (id: string) => Promise<User | null>;
    findByEmail: (email: string) => Promise<User | null>;
    save: (user: User) => Promise<void>;
}
