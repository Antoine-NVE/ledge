import bcrypt from 'bcrypt';
import type { Hasher } from '../../domain/ports/hasher.js';

export class BcryptHasher implements Hasher {
    hash = async (value: string): Promise<string> => {
        return await bcrypt.hash(value, 12);
    };

    compare = async (raw: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(raw, hash);
    };
}
