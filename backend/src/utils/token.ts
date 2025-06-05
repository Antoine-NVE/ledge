import crypto from 'crypto';

export const generateToken = (length: number = 64): string => {
    return crypto.randomBytes(length).toString('hex');
};
