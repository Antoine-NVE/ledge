import jwt, { Secret } from 'jsonwebtoken';

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

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
