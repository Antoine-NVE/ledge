import jwt, { Secret } from 'jsonwebtoken';

let JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret';

export const setJwtSecret = (secret: Secret) => {
    JWT_SECRET = secret;
};

export const createJwt = (userId: string, expiresIn: jwt.SignOptions['expiresIn'] = '1h') => {
    return jwt.sign({ _id: userId }, JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string) => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded === 'object' && '_id' in decoded) {
            return decoded;
        }

        throw new Error('Invalid JWT payload');
    } catch (error) {
        console.error(error);

        return null;
    }
};
