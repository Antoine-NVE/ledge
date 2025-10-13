import z from 'zod';
import { User } from '../types/User';

export const clearUser = (user: User): Omit<User, 'passwordHash'> => {
    const { passwordHash, ...safeUser } = user;

    return safeUser;
};
