import z from 'zod';
import { User } from '../types/User';

export class FormatUtils {
    static formatZodError = (err: z.ZodError<object>): Record<string, string[]> => {
        const { errors, properties } = z.treeifyError(err);
        const result: Record<string, string[]> = {};

        if (errors.length) result.other = [...errors];

        if (properties) {
            for (const [field, { errors: fieldErrors }] of Object.entries(properties)) {
                result[field] = [...fieldErrors];
            }
        }

        return result;
    };

    static formatSafeUser = (user: User): Omit<User, 'passwordHash'> => {
        const { passwordHash, ...safeUser } = user;

        return safeUser;
    };
}
