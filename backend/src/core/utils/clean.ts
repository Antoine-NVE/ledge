import type { User } from '../../domain/entities/user.js';

export const removePasswordHash = (user: User): Omit<User, 'passwordHash'> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safeUser } = user;

    return safeUser;
};
