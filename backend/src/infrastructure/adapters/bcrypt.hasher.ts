import bcrypt from 'bcrypt';
import type { Hasher } from '../../domain/ports/hasher.js';

export class BcryptHasher implements Hasher {
    hash = (value: string): Promise<string> => {
        return bcrypt.hash(value, 12);
    };

    compare = (raw: string, hash: string): Promise<boolean> => {
        return bcrypt.compare(raw, hash);
    };
}
