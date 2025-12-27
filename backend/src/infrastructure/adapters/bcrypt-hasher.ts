import bcrypt from 'bcrypt';
import { Hasher } from '../../application/ports/hasher';

export class BcryptHasher implements Hasher {
    hash = (value: string): Promise<string> => {
        return bcrypt.hash(value, 12);
    };

    compare = (raw: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(raw, hash);
    };
}
