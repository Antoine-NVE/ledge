import type { TokenGenerator } from '../../application/ports/token-generator.js';
import crypto from 'crypto';

export class CryptoTokenGenerator implements TokenGenerator {
    // TODO: check why it seems to work without default value
    generate = (length: number = 64): string => {
        length = Math.abs(Math.floor(length));
        const byteLength = Math.ceil(length / 2);

        return crypto.randomBytes(byteLength).toString('hex').slice(0, length);
    };
}
