import type { User } from '../entities/user.js';
import type { Result } from '../../core/types/result.js';

export interface UserRepository {
    create: (user: User) => Promise<Result<void, { type: 'DUPLICATE_EMAIL' }>>;
    findById: (id: string) => Promise<User | null>;
    findByEmail: (email: string) => Promise<User | null>;
    save: (user: User) => Promise<void>;
}
