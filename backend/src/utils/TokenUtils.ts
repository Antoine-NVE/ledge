import crypto from 'crypto';

export class TokenUtils {
    static generateToken = (length: number = 64): string => {
        length = Math.abs(Math.floor(length));
        const byteLength = Math.ceil(length / 2);

        return crypto.randomBytes(byteLength).toString('hex').slice(0, length);
    };
}
