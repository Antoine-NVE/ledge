import jwt, { Secret } from 'jsonwebtoken';

let JWT_SECRET: Secret = process.env.JWT_SECRET || 'default-secret';

export const setJwtSecret = (secret: Secret) => {
    JWT_SECRET = secret;
};

export const createJwt = (payload: object, expiresIn: jwt.SignOptions['expiresIn'] = '1h') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyJwt = (token: string) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        console.error(error);

        return null;
    }
};
