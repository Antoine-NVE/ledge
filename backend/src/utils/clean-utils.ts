import { User } from '../types/user-type';

export const removePasswordHash = (user: User): Omit<User, 'passwordHash'> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;

    return safeUser;
};
