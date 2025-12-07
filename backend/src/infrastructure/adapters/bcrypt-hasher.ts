import bcrypt from 'bcrypt';
import { Hasher } from '../../application/ports/hasher';

export class BcryptHasher implements Hasher {
    hash = async (value: string): Promise<string> => {
        return await bcrypt.hash(value, 10);
    };

    compare = async (raw: string, hash: string): Promise<boolean> => {
        return await bcrypt.compare(raw, hash);
    };
}
