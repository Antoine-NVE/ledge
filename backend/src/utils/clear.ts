import { User } from '../types/User';

export const clearUser = (user: User): Omit<User, 'passwordHash'> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;

    return safeUser;
};
