import crypto from 'crypto';

export const generateToken = (charLength: number = 64): string => {
    const length = Math.abs(Math.floor(charLength));
    const byteLength = Math.ceil(length / 2);

    return crypto.randomBytes(byteLength).toString('hex').slice(0, length);
};
