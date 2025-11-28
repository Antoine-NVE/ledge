import bcrypt from 'bcrypt';
import { Hasher } from '../../application/ports/hasher';

export class BcryptHasher implements Hasher {
    hash = async (password: string): Promise<string> => {
        return await bcrypt.hash(password, 10);
    };

    compare = async (
        password: string,
        passwordHash: string,
    ): Promise<boolean> => {
        return await bcrypt.compare(password, passwordHash);
    };
}
