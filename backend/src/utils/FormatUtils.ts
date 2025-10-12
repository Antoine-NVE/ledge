import z from 'zod';
import { User } from '../types/User';

export class FormatUtils {
    static formatSafeUser = (user: User): Omit<User, 'passwordHash'> => {
        const { passwordHash, ...safeUser } = user;

        return safeUser;
    };
}
